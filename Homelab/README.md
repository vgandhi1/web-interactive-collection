# 🦈 DatasharkVAG Homelab

Raspberry Pi homelab on two independent planes:

| Plane | Mechanism | Carries | Doc |
| :--- | :--- | :--- | :--- |
| **Ingress** | Cloudflare Tunnel + Access | apps published to the internet | [TUNNEL-ARCHITECTURE.md](TUNNEL-ARCHITECTURE.md) |
| **Device** | Tailscale + MagicDNS | applied AI lab — Mac mini + mini PCs, peer-to-peer | [TAILSCALE-ARCHITECTURE.md](TAILSCALE-ARCHITECTURE.md) |

The rule that decides which: **browser traffic goes on the tunnel, everything else stays on Tailscale.**

The Raspberry Pi stack below and the AI lab are separate projects that share one tailnet.

> Open **`HomelabPortal.html`** for the interactive version with both diagrams.

---

## The stack (main Pi 4)

One `docker-compose.yml` — see [docker-compose-template.yml](docker-compose-template.yml).

| Service | Role |
| :--- | :--- |
| **Nginx Proxy Manager** | Gateway: SSL + host-header routing |
| **cloudflared** | Tunnel connector, outbound only |
| **Home Assistant** | Smart home (host mode) |
| **Nextcloud + MariaDB** | Personal cloud storage |
| **InfluxDB + Grafana** | Sensor data + dashboards |
| **Portainer** | Docker management UI |
| **Samba** | File sharing off the HDD |

Deploy: `docker compose up -d`

Other nodes: **Pi-hole** on a Pi Zero (LAN ad-blocking, handed out by router DHCP) and a **sensor node** with a Sense HAT writing temperature/pressure/humidity to InfluxDB on port `8086`. The sensor script is in the portal's Sensor Node tab.

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
