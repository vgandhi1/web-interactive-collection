# 🦈 DatasharkVAG Homelab Stack

Comprehensive setup for a distributed Raspberry Pi homelab utilizing **Cloudflare Tunnels** for public access and **Tailscale** for private administrative access.

## 🏗️ Architecture Overview

The network is partitioned into two distinct security zones:

* **Public Zone:** Cloudflare Tunnel → Nginx Proxy Manager (NPM) → Static Web Containers.
* **Private Zone:** Tailscale → Nginx Proxy Manager (SSL) → Application Containers.
* **DNS/Ad-Blocking:** Distributed Pi-hole on a secondary node (Pi Zero).



---

## 📋 Prerequisites

* **Cloudflare API Token:** Requires `Zone:Read` and `DNS:Edit` permissions.
* **Tailscale:** Installed on all nodes and client devices.
* **Docker & Docker Compose:** Installed on the primary Pi 4 node.

---

## 1. The Stack (Primary Node)
The `docker-compose.yml` deploys the following core services:

* **Nginx Proxy Manager:** Gateway with Cloudflare SSL integration.
* **Home Assistant:** Smart home controller (Run in **Host Mode**).
* **Nextcloud:** Personal cloud storage with MariaDB backend.
* **Data Stack:** InfluxDB v2, MariaDB, Grafana.
* **Portainer:** Docker management interface.
* **Samba:** Local file sharing for HDD access.

---

## 2. Network Routing Strategy

### Public Static Sites
* `weather.datasharkvag.com`
* `hedging.datasharkvag.com`

These are routed via **Cloudflare Tunnels** directly to the NPM container, which serves files from the `static-web-apps` container.

### Private Applications
Apps like Home Assistant and Nextcloud are accessed via `*.datasharkvag.com` but resolve to the **Tailscale IP** of the Pi 4. SSL is managed by NPM using the Cloudflare DNS-01 challenge.

**DNS Mapping:**
1.  **Cloudflare DNS:** Create A Records for `ha`, `cloud`, `grafana` pointing to the Tailscale IP. 
2.  **Proxy Status:** Set to **Grey Cloud** (DNS Only).
3.  **Access Flow:** > User (on VPN) → `datasharkvag.com` (resolves to 100.x.y.z) → NPM → Container.

---

## 3. Remote Node: Pi-hole SSL Fix
To ensure SSL functionality for a Pi-hole instance running on a separate hardware device (Pi Zero):

1.  **In NPM:** Create a Proxy Host for `pihole.datasharkvag.com` pointing to the Pi Zero IP.
2.  **In Pi-hole:** Navigate to **Local DNS → DNS Records** and map `pihole.datasharkvag.com` to the Pi 4 (NPM) Tailscale IP.

**Advanced Tab (NPM) Configuration:**
```nginx
location = / { return 301 $scheme://$http_host/admin/; }

location / {
    proxy_pass http://<PiZero_IP>/admin/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
