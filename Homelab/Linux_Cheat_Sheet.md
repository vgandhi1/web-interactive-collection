# 🐧 Linux Command Cheat Sheet for Homelabbers

This guide covers essential Linux commands for setting up, maintaining, and troubleshooting your Raspberry Pi homelab running Docker.

---

## 1. System Basics & Updates

Maintaining a healthy OS is the foundation of a stable homelab.

| Task | Command |
| :--- | :--- |
| **Update Package Lists** | `sudo apt update` |
| **Upgrade Packages** | `sudo apt upgrade -y` |
| **Check Disk Space** | `df -h` |
| **Check RAM Usage** | `free -h` |
| **Reboot System** | `sudo reboot` |
| **Safe Shutdown** | `sudo shutdown -h now` |

---

## 2. Network Configuration

[Image of Linux networking stack architecture]

### Check & Change Identity
* **Check IP Address:** `hostname -I` or `ip addr show`
* **Change Hostname:**
    1. Set new name: `sudo hostnamectl set-hostname <new-name>`
    2. Edit hosts file: `sudo nano /etc/hosts` (Update old name to new name)
    3. `sudo reboot`

### Set Static IP (nmtui method)
1. Run: `sudo nmtui`
2. Select **'Edit a connection'** → Select interface (e.g., `eth0`).
3. Set **IPv4 CONFIGURATION** to `<Manual>`.
4. Select **<Show>** and add your Address, Gateway, and DNS.

---

## 3. Docker & Docker Compose
*Run these commands from your project directory (e.g., `~/homelab`).*

* **Start/Update Stack:** `docker compose up -d`
* **Stop Stack:** `docker compose stop`
* **Remove Containers:** `docker compose down`
* **Check Status:** `docker compose ps`
* **Live Logs:** `docker compose logs -f [service_name]`
* **Restart Service:** `docker compose restart [service_name]`

---

## 4. Maintenance & Backups

### Nginx Proxy Manager (NPM)
Create a timestamped backup of your configuration:
