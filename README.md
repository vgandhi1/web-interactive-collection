# Web Interactive Collection

**Live hub:** [https://vgandhi1.github.io/interactive-lab/](https://vgandhi1.github.io/interactive-lab/)

A curated library of **static HTML** slide decks, EV/SDV reference pages, homelab documentation, and browser-based learning tools. The main portfolio ([vgandhi1.github.io](https://vgandhi1.github.io/)) holds the career narrative and GitHub project grid; **this repo** publishes demos and deep-dive material only.

| Site | Repository | URL |
|------|------------|-----|
| Portfolio | [vgandhi1/vgandhi1.github.io](https://github.com/vgandhi1/vgandhi1.github.io) | `https://vgandhi1.github.io/` |
| Interactive lab (this repo) | [vgandhi1/interactive-lab](https://github.com/vgandhi1/interactive-lab) | `https://vgandhi1.github.io/interactive-lab/` |

---

## Hub layout (`index.html`)

The landing page groups artifacts into three areas (in-page anchors):

| Section | Anchor | Purpose |
|---------|--------|---------|
| **Repositories** | `#repos` | Points to portfolio flagship projects and [all GitHub repos](https://github.com/vgandhi1?tab=repositories) |
| **Case studies** | `#case-studies` | Academic & professional project deep-dives, manufacturing/ML research, homelab, vehicle protocols & cybersecurity |
| **Tools & simulators** | `#tools` | Interactive glossaries, DSA guide, Git lab, financial/education simulators, calculator |

---

## Artifacts in this repository

### Case studies (`#case-studies`)

| Page | File | Summary |
|------|------|---------|
| Homelab portal | [Homelab/HomelabPortal.html](Homelab/HomelabPortal.html) | Raspberry Pi homelab — Cloudflare Tunnel, Tailscale, self-hosted stack |
| CVML — manufacturing QA | [CVML_Project_Overview.html](CVML_Project_Overview.html) | Edge CV, MQTT, AWS ML, MES/SCADA |
| Amazon Monitron IIoT | [monitron-IIoT-sensors.html](monitron-IIoT-sensors.html) | Vibration sensing, gateway, AWS Monitron workflow |
| OEE data model | [oee_data_model.html](oee_data_model.html) | Star schema, T-SQL, Power BI — on-prem OEE reporting |
| Cancer recurrence ML | [cancer_recurrence_ml_presentation.html](cancer_recurrence_ml_presentation.html) | Clinical ML study presentation |
| ARIMA forecasting | [arima_report.html](arima_report.html) | eCommerce sales — ARIMA baseline & validation |
| DOE — packaging seal | [DOE_Summary_Document.html](DOE_Summary_Document.html) | 2³ factorial, ANOVA, process optimization |
| Vehicle protocols | [ev_protocols.html](ev_protocols.html) | CAN, LIN, FlexRay, DoIP |
| EV cybersecurity | [ev-cybersecurity.html](ev-cybersecurity.html) | SecOC, UN R155/R156, ISO 21434 |

**Homelab folder** ([Homelab/](Homelab/)):

- [HomelabPortal.html](Homelab/HomelabPortal.html) — interactive setup guide + architecture diagram
- [README.md](Homelab/README.md) — beginner walkthrough: public (Cloudflare Tunnel) vs private (Tailscale + MagicDNS), stack, commands
- [docker-compose-template.yml](Homelab/docker-compose-template.yml) — deployable stack

### Tools & simulators (`#tools`)

| Page | File | Summary |
|------|------|---------|
| AI Guide | [ai-guide.html](ai-guide.html) | Unified hub — 9 interactive explainers (Transformers, MCP, reasoning models, RAG, agents, etc.) + searchable 100+ term glossary with 2025–2026 updates |
| Claude Ecosystem Guide | [claude-ecosystem-guide.html](claude-ecosystem-guide.html) | Anthropic 2026 — Chat, Code, Skills, Coworker, MCP, Academy |
| DSA Architect | [DSA.html](DSA.html) | Data structures & algorithms reference with complexity notes |
| Mastering uv | [uv-guide.html](uv-guide.html) | Interactive guide to the `uv` Python package manager |
| Hedging simulator | [hedging_simulator.html](hedging_simulator.html) | Stock + put option P/L scenarios |
| Git 101 | [git_101.html](git_101.html) | Guide + working-tree simulator |
| ISO & RSU dashboard | [equity_dashboard.html](equity_dashboard.html) | Equity compensation / tax scenario explorer |
| Calculator | [calculator.html](calculator.html) | Browser calculator with history |

**Markdown companion:**

- [GIT_AND_GITHUB_GUIDE.md](GIT_AND_GITHUB_GUIDE.md) — longer-form Git/GitHub reference (companion to `git_101.html`)

### Related apps (hosted elsewhere)

These are linked from the [main portfolio](https://vgandhi1.github.io/) rather than stored in this repo:

| App | Link |
|-----|------|
| Weather WebApp | [vgandhi1.github.io/weather-WebApp/](https://vgandhi1.github.io/weather-WebApp/) |
| ToDoApp (FARM stack) | [github.com/vgandhi1/ToDoApp](https://github.com/vgandhi1/ToDoApp) |

---

## Tech stack

| Category | Technologies |
|----------|----------------|
| Markup & style | Static HTML; [Tailwind CSS v4 browser CDN](https://tailwindcss.com/docs/installation/play-cdn) on the hub and a few tool pages; inline custom CSS everywhere else |
| Charts / viz | [Chart.js](https://www.chartjs.org/), [Plotly.js](https://plotly.com/javascript/) where used |
| Logic | Vanilla JavaScript (ES6+); React 18 (browser CDN) on [ai-guide.html](ai-guide.html) |
| Fonts | Inter (hub), per-page fonts elsewhere |
| Hosting | GitHub Pages (project site under `/interactive-lab/`) |

**No build step** — clone, open `index.html` via a local server, or push to GitHub Pages. Pages that use Tailwind load it from jsDelivr at runtime.

---

## Local preview

```bash
cd interactive-lab   # or your clone path
python3 -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/) for the hub. Open individual `.html` files via the same origin so relative links (e.g. `Homelab/HomelabPortal.html`) work.

---

## Deploying to GitHub Pages

1. Push to the default branch of **`vgandhi1/interactive-lab`**.
2. **Settings → Pages** → deploy from branch, folder `/ (root)`.
3. The site is served at **`https://<user>.github.io/interactive-lab/`** (project Pages URL).

Ensure the portfolio repo links to this path (already wired on [vgandhi1.github.io](https://vgandhi1.github.io/)).

---

## Contact

- **GitHub:** [@vgandhi1](https://github.com/vgandhi1)
- **LinkedIn:** [vinaygandhi274](https://www.linkedin.com/in/vinaygandhi274/)
- **Email:** gandhivinay2008@gmail.com

---

## License & attribution

Content is provided for learning, demonstration, and portfolio use. There is no separate `LICENSE` file in this repository; if you fork or reuse pages, please retain attribution to **Vinay Gandhi** and link back to the live hub when practical.
