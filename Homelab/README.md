# 🦈 DatasharkVAG Homelab

A small Raspberry Pi homelab with two ways in:

* **Public** — a Cloudflare Tunnel exposes a couple of static sites to the internet.
* **Private** — everything else is reachable only over **Tailscale** (a peer-to-peer VPN) using **MagicDNS**.

> New here? Open **`HomelabPortal.html`** in a browser for the interactive diagram and reference. This README is the text version.

---

## Architecture at a glance

```
Public visitor ──HTTPS──► Cloudflare Tunnel ─┐
                                             ├─► Nginx Proxy Manager (SSL) ─► apps
You (on Tailscale) ──peer-to-peer──► MagicDNS┘
                                                        │
                                     Main Server (Pi 4B): Nextcloud · Grafana ·
                                     Home Assistant · Portainer · InfluxDB · MariaDB · HDD

Other Pis:  Pi-hole (Pi Zero, LAN ad-blocking)   Sensor Node (Sense HAT ─► InfluxDB)
```

Two zones, one server. That is the whole idea.

---

## Prerequisites

* **Docker & Docker Compose** on the main Pi 4.
* **Tailscale** installed on the Pi 4, the other Pis, and your phone/laptop — all signed in to the same account.
* **Cloudflare** account with a Tunnel token (only needed for the public static sites).

---

## The stack (main Pi 4)

Everything runs from one `docker-compose.yml` (see `docker-compose-template.yml`):

| Service | Role |
| :--- | :--- |
| **Nginx Proxy Manager** | Gateway: SSL + routing |
| **cloudflared** | Public tunnel for static sites |
| **Home Assistant** | Smart home (host mode) |
| **Nextcloud + MariaDB** | Personal cloud storage |
| **InfluxDB + Grafana** | Sensor data + dashboards |
| **Portainer** | Docker management UI |
| **Samba** | File sharing off the HDD |

Deploy: `docker compose up -d`

---

## Public access — Cloudflare Tunnel

Two static sites are served to the open internet:

* `weather.datasharkvag.com`
* `hedging.datasharkvag.com`

Flow: **visitor → Cloudflare → tunnel → Nginx Proxy Manager → static files**. No ports opened on your router; the tunnel dials out.

---

## Private access — Tailscale + MagicDNS

Every device joins one private network (a **tailnet**). Connections are peer-to-peer and encrypted — nothing is exposed to the internet.

**MagicDNS** gives each machine a stable name, so you reach the main server from anywhere as:

```
mainserver.your-tailnet.ts.net
```

No need to remember the `100.x.y.z` Tailscale IP.

### Setup (once)

1. Install Tailscale on every device, sign in to the same account.
2. Admin console → **DNS** → turn on **MagicDNS**.
3. Leave **"Override local DNS" OFF.** MagicDNS only resolves `.ts.net` names; each device keeps its normal DNS for everything else. Simpler and no surprises.

### Optional: pretty HTTPS names

If you want `https://cloud.datasharkvag.com` instead of a raw `.ts.net` name:

1. In Cloudflare DNS, add A records (`cloud`, `grafana`, `ha`, …) pointing to the Pi 4's **Tailscale IP**, set to **Grey Cloud (DNS only)**.
2. Nginx Proxy Manager gets a wildcard cert via the Cloudflare **DNS-01** challenge and terminates SSL.

This is optional polish — MagicDNS names already work.

---

## Pi-hole — home ad-blocking (Pi Zero)

Kept deliberately simple: **LAN only.**

* Pi-hole runs on a Pi Zero with a static IP.
* Router DHCP hands out the Pi Zero IP as the DNS server → every device on home Wi-Fi is filtered, no per-device setup.
* Because Tailscale's "Override local DNS" is off, phones on cellular use their own DNS — Pi-hole is not forced onto them.

To manage it while away: install Tailscale on the Pi Zero and open `http://pihole.your-tailnet.ts.net/admin`. No global nameserver or "Permit all origins" tweaks required.

---

## Sensor node (Sense HAT)

A separate Pi with a Sense HAT reads temperature/pressure/humidity and writes to InfluxDB (port `8086`) on the main server; Grafana visualises it. The Python script lives in the portal's **Sensor Node** tab.

---

## Common commands

```bash
# Docker (run from the compose folder, e.g. ~/homelab)
docker compose up -d              # start / update the stack
docker compose ps                 # status
docker compose logs -f nginx      # live logs for one service
docker compose down               # stop and remove containers

# System
sudo apt update && sudo apt upgrade -y   # update packages
df -h                             # disk space
free -h                           # RAM
sudo reboot                       # restart

# Network
hostname -I                       # this machine's IP
sudo hostnamectl set-hostname NAME  # rename host (then edit /etc/hosts, reboot)
sudo nmtui                        # set a static IP (Edit a connection → Manual)

# Pi-hole
pihole -g                         # update blocklists
pihole -up                        # update Pi-hole

# Backup Nginx Proxy Manager config
cp ./volumes/nginx/data/database.sqlite \
   ./volumes/nginx/data/database_$(date +%F).sqlite
```

---

*© datasharkvag.com — Pi 4B (8GB RAM)*
