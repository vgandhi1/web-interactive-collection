# Homelab — Cloudflare Tunnel (Ingress Plane)

Status: **draft**. Not applied — the portal shows the target design, the running
homelab does not yet match it.

Covers app access only, public and private. Device-to-device connectivity is the
other plane: [TAILSCALE-ARCHITECTURE.md](TAILSCALE-ARCHITECTURE.md). Tailscale is
**not** being removed; it just stops being how the apps are reached.

---

## 0. Why a tunnel at all — CGNAT

Cloudflare's own description, from the **Networks → Tunnels** page of the
Zero Trust dashboard:

> Create secure, outbound-only connections from your infrastructure to
> Cloudflare without opening inbound ports.

Read what that sentence does and does not promise. It covers *reachability* —
outbound-only, no inbound ports. It says nothing about who is allowed to reach
the application once the hostname is live. That omission is the whole basis for
the tier split in §2.


The ISP puts this connection behind **CGNAT**: one public IP shared across many
customers, and the NAT is theirs, not yours. Port forwarding is not misconfigured
here, it is unavailable — there is no router setting that can expose port 443 to
the internet because the address the world sees is not yours to bind.

Cloudflare Tunnel sidesteps that by reversing the direction. `cloudflared` makes
an **outbound-only** connection to Cloudflare's edge on **port 7844** (UDP for
QUIC, TCP for HTTP/2) and holds it open; the edge then multiplexes inbound
requests back down that existing connection. No inbound ports, no firewall
changes, no public IP required — and nothing for CGNAT to block, because from
the ISP's view it is ordinary outbound traffic.

Same property is why the origin has no attack surface: there is no listening port
on the internet to find.

### 0.1 Terminology — what this actually is

Worth being precise, because the naming has changed twice:

| Term | What it means here |
|---|---|
| **Cloudflare Tunnel** | The product. Formerly **Argo Tunnel**; renamed in April 2021 when it stopped requiring an Argo subscription and became free. |
| **`cloudflared`** | The connector daemon that dials out. What runs in the compose stack. |
| **Cloudflare One / Zero Trust** | The dashboard and platform brand the tunnel is administered under. Not a tunnel type. |
| **Cloudflare Access** | A **separate** product — identity-based policies in front of an application. |

So this is not "a Zero Trust tunnel" — there is no such product. It is a
Cloudflare Tunnel, specifically a **remotely-managed** one (created in the
dashboard, run with `--token`, config stored by Cloudflare) as opposed to a
locally-managed tunnel driven by a `config.yaml`.

**The distinction matters operationally.** A tunnel on its own applies no access
control at all. Per Cloudflare's docs: *if you do not have an Access application
in place, the published application will be available to anyone on the Internet.*
The tunnel solves reachability; Access is what supplies the zero-trust part. That
is precisely the split in §2 — a public tier with no Access application, and a
private tier that has one.

Corollary worth internalising: **add the Access application before routing the
hostname.** Create the route first and the app is briefly open to the world.

### 0.2 As built today

- **`datasharkvag.com` is on Cloudflare.** Not optional for this design —
  `cfargotunnel.com` only proxies traffic for DNS records in the same Cloudflare
  account, so the tunnel cannot route a hostname on a domain hosted elsewhere.
  It is also what makes the DNS-01 wildcard cert possible.
- **Each public hostname is a CNAME** to `<tunnel-UUID>.cfargotunnel.com`,
  created by the dashboard or `cloudflared`. The record can exist without the
  tunnel running; traffic simply is not proxied until the connector is up.
- **The connector runs in Docker**, not as a host service — the `cloudflared`
  container on `homelab_net`, dashboard-managed via `--token`.
- **Path:** edge → connector → NPM → app. The connector addresses origins by
  Docker service name (`http://nginx:80`) because it shares the compose network.

Consequences of the connector being containerised, none of them problems but all
worth knowing:

| | Implication |
|---|---|
| Updates | `docker compose pull` / image tag, not `apt upgrade`. Pinning `:latest` means an update lands whenever the image is pulled. |
| Credentials | The token lives in container env, visible to anything that can run `docker inspect`. See §3. |
| Failure mode | `restart: unless-stopped` is doing the reconnect work. If the container is down, every public hostname 502s at the edge. |
| Origin naming | Origins must be Docker service names, not `localhost` — `localhost` inside the connector container is the connector itself. |

---

## 1. Earlier architecture (`5e3ed2f`)

Sound design — nothing port-forwarded, private apps genuinely unreachable from
the internet. The simplification available: it ran **two ingress mechanisms** to
reach **one** reverse proxy on **one** box.

| Concern | Public zone | Private zone |
|---|---|---|
| Ingress | cloudflared | Tailscale |
| Identity | none | tailnet membership |
| Naming | `*.datasharkvag.com` | `*.ts.net` |
| TLS | Cloudflare edge | NPM wildcard via DNS-01 |
| Client needs an agent | no | yes |

The last two rows are the cost. Pretty private hostnames needed grey-cloud A
records pointing public DNS at a `100.x.y.z` Tailscale IP, and every client had
to install an agent before reaching anything. Collapsing to one ingress removes
both.

---

## 2. Target: one tunnel, two policy tiers

The public/private split stops being *two transports* and becomes *one transport
with a policy check on half the hostnames*.

| Hostname | Tier | Access policy | Origin |
|---|---|---|---|
| `weather.datasharkvag.com` | public | none | `static-web-apps:80` |
| `hedging.datasharkvag.com` | public | none | `static-web-apps:80` |
| `cloud.datasharkvag.com` | private | required | `nextcloud:80` |
| `grafana.datasharkvag.com` | private | required | `grafana:3000` |
| `portainer.datasharkvag.com` | private | required | `portainer:9000` |
| `npm.datasharkvag.com` | **never routed** | — | LAN only |

All point at the same connector and resolve to `http://nginx:80`; NPM does
host-header routing. Tier is decided purely by whether an Access application
covers the hostname.

Access policy: allowlisted emails, one-time PIN to start, OIDC later. Short
sessions — these are admin surfaces.

**Removes:** the grey-cloud/Tailscale-IP workaround, the NPM wildcard cert as a
*requirement* (Cloudflare terminates TLS at the edge; keep the cert for the
origin hop if wanted), and the agent install for anyone who only uses the apps.

**Does not add a single point of failure** — the device plane stays up, so a
Cloudflare outage costs the apps but never the machines.

---

## 3. Origin changes

**`cloudflared`** — token moves off the command line, where `docker inspect`
exposes it:

```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    command: tunnel --no-autoupdate run
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARED_TOKEN:?set in .env}
    networks: [homelab_net]
```

**`TRUSTED_PROXIES`** (`docker-compose-template.yml:70`) currently reads
`172.16.0.0/12 100.64.0.0/10`. The second is the Tailscale CGNAT range — dead
config once Tailscale is off the request path, and a trusted-proxy entry with no
corresponding hop is exactly what gets exploited later. Drop it.

**Host port bindings** — `nginx` 80/81/443, `portainer` 9000, `samba` 139/445
stay LAN-reachable regardless of Access. Fine for a homelab, but it means Access
protects the *internet* path only. Portainer in particular is a Docker socket UI
on an unauthenticated port. Decide deliberately.

**NPM** — add proxy hosts for the private names; forward
`CF-Access-Authenticated-User-Email` where apps can use it; never expose the
admin UI (`:81`) through a tunnel hostname.

---

## 4. Migration order

Each step is reversible on its own, and Tailscale stays up throughout.

1. Create the Access applications and policies **first** — before any private
   hostname is routed. A routed hostname with no Access application is open to
   the internet (§0.1).
2. Add the private hostnames to Cloudflare DNS + tunnel ingress. Verify the login
   prompt appears from a device **not** on the tailnet.
3. Add NPM proxy hosts.
4. Test every app, including the non-browser clients in §5.
5. Fix `TRUSTED_PROXIES`, restart Nextcloud, re-test.
6. Remove the grey-cloud A records pointing at the Tailscale IP.
7. Leave Tailscale installed and unused for a few weeks before touching it.

---

## 5. What does not go on the tunnel

Cloudflare Access authenticates in a browser and issues a cookie. Non-browser
clients get an HTML login page where they expect an API response:

| Client | Consequence | Answer |
|---|---|---|
| Nextcloud sync | Breaks on the tunnel hostname | Point at the device-plane name, or bypass `/remote.php/*` |
| HA companion app | Push + sensors break | Keep HA on the device plane |
| Grafana API | Script auth breaks | Access service token |
| Samba | Not carryable over HTTP | Device plane — unchanged from today |

Rule of thumb: **browser traffic on the tunnel, everything else on Tailscale.**

**Home Assistant stays off the tunnel.** It runs `network_mode: host` with
`privileged: true` and `NET_ADMIN`/`NET_RAW`
(`docker-compose-template.yml:44-55`). A public DNS name means one Access
misconfiguration exposes a privileged host-networked container that controls
physical devices. The device plane already reaches it and keeps the companion
app working, so the tunnel buys convenience that is not worth the risk.

**Two systems to revoke through.** Removing someone's access means the Access
allowlist *and* the tailnet device list. Keep them in sync or an old device
retains a way in.

---

## 6. Open questions

- IdP behind Access — one-time PIN allowlist, or Google/GitHub OIDC?
- Nextcloud sync: repoint at the device-plane name, or add the `/remote.php/*` bypass?
- Keep the NPM wildcard cert for origin TLS, or let the tunnel handle TLS end to end?
