# Web Interactive Collection

**Live hub:** [https://vgandhi1.github.io/interactive-lab/](https://vgandhi1.github.io/interactive-lab/)

Static HTML slide decks, EV/SDV reference pages, homelab documentation, and browser-based learning tools. The main portfolio ([vgandhi1.github.io](https://vgandhi1.github.io/)) holds the career narrative and project grid; **this repo** publishes demos and deep-dive material only.

`index.html` groups everything into three in-page anchors: **Repositories** (`#repos`), **Case studies** (`#case-studies`), **Tools & simulators** (`#tools`).

---

## Case studies

| Page | Summary |
|------|---------|
| [Homelab portal](Homelab/HomelabPortal.html) | Raspberry Pi homelab — Cloudflare Tunnel + Access, Tailscale device plane, self-hosted stack |
| [CVML — manufacturing QA](CVML_Project_Overview.html) | Edge CV, MQTT, AWS ML, MES/SCADA |
| [Amazon Monitron IIoT](monitron-IIoT-sensors.html) | Vibration sensing, gateway, AWS Monitron workflow |
| [OEE data model](oee_data_model.html) | Star schema, T-SQL, Power BI — on-prem OEE reporting |
| [Cancer recurrence ML](cancer_recurrence_ml_presentation.html) | Clinical ML study presentation |
| [ARIMA forecasting](arima_report.html) | eCommerce sales — ARIMA baseline & validation |
| [DOE — packaging seal](DOE_Summary_Document.html) | 2³ factorial, ANOVA, process optimization |
| [Vehicle protocols](ev_protocols.html) | CAN, LIN, FlexRay, DoIP |
| [EV cybersecurity](ev-cybersecurity.html) | SecOC, UN R155/R156, ISO 21434 |

**[Homelab/](Homelab/)** — [portal](Homelab/HomelabPortal.html) (interactive, both architecture diagrams) · [README](Homelab/README.md) · [tunnel architecture](Homelab/TUNNEL-ARCHITECTURE.md) · [Tailscale architecture](Homelab/TAILSCALE-ARCHITECTURE.md) · [docker-compose template](Homelab/docker-compose-template.yml)

## Tools & simulators

| Page | Summary |
|------|---------|
| [AI Guide](ai-guide.html) | 9 interactive explainers (Transformers, MCP, reasoning models, RAG, agents) + searchable 100+ term glossary |
| [Claude Ecosystem Guide](claude-ecosystem-guide.html) | Anthropic 2026 — Chat, Code, Skills, Coworker, MCP, Academy |
| [DSA Architect](DSA.html) | Data structures & algorithms reference with complexity notes |
| [Mastering uv](uv-guide.html) | Interactive guide to the `uv` Python package manager |
| [Git 101](git_101.html) | Git/GitHub guide + working-tree simulator |
| [Hedging simulator](hedging_simulator.html) | Stock + put option P/L scenarios |
| [ISO & RSU dashboard](equity_dashboard.html) | Equity compensation / tax scenario explorer |
| [Calculator](calculator.html) | Browser calculator with history |

**Hosted elsewhere:** [Weather WebApp](https://vgandhi1.github.io/weather-WebApp/) · [ToDoApp (FARM stack)](https://github.com/vgandhi1/ToDoApp)

---

## Tech stack

Static HTML, no build step. Tailwind CSS v4 browser CDN on the hub and a few tool pages, inline CSS elsewhere. Chart.js / Plotly.js where charts are used. Vanilla ES6+, plus React 18 (browser CDN) on [ai-guide.html](ai-guide.html) and the homelab portal. Hosted on GitHub Pages under `/interactive-lab/`.

```bash
python3 -m http.server 8000    # then open http://localhost:8000/
```

Serve via a local server so relative links (e.g. `Homelab/HomelabPortal.html`) resolve.

**Deploy:** push to the default branch of `vgandhi1/interactive-lab`, then **Settings → Pages** → deploy from branch, folder `/ (root)`.

---

## Contact

[@vgandhi1](https://github.com/vgandhi1) · [LinkedIn](https://www.linkedin.com/in/vinaygandhi274/) · gandhivinay2008@gmail.com

Content is for learning, demonstration, and portfolio use. No `LICENSE` file — if you reuse pages, please retain attribution to **Vinay Gandhi** and link back to the live hub.
