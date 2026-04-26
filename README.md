# ContractorOS

**The complete fleet operating system for contract carriers.**

ContractorOS is a web-based management platform built specifically for the 1–10 vehicle contract carrier market — a segment historically underserved by expensive enterprise software.

---

## Supported Contractor Types

| Segment | Description |
|---|---|
| 🚛 OTR / Owner Operator | Load board hauling with own MC/DOT authority |
| 📦 FedEx Ground / HD | ISP route management and compliance |
| 📬 Amazon DSP | Delivery Service Partner operations |
| 🏠 Last Mile | Lowe's, Home Depot, and home delivery contractors |
| 📮 USPS HCR | Highway Contract Route operations |

---

## Features

### Shared Across All Segments
- **Compliance Command Center** — Vehicle and driver expiration tracking, DOT document guide, AI-powered compliance Q&A
- **Fleet & Maintenance** — Per-vehicle service log with upcoming maintenance alerts
- **Driver Management** — Pay tracking, incident logging, scorecards
- **Finance & P&L** — Revenue tracking, expense categorization, monthly profit/loss
- **Contract Tracker** — Renewal date alerts, contract value tracking

### OTR / Owner Operator Specific
- **Load Rate Analyzer** — AI-powered rate scoring (A/B/C/D) with true net RPM after fuel, deadhead, and truck costs
- **Broker Counter-Offer Scripts** — Word-for-word negotiation language generated per load
- **Broker Scoreboard** — Auto-ranks brokers by avg net RPM with blacklist support
- **Lane Intelligence** — Most/least profitable origin-destination pairs
- **Load Board Hub** — Quick links to DAT, Truckstop, Amazon Relay, and more

### Route-Based Segments (FedEx, Amazon, Last Mile, USPS)
- **Route Profitability Analyzer** — AI scoring per route with net per stop and net per mile
- **Driver Scorecards** — Performance tracking per driver
- **Segment-Specific Contract Tracking** — ISP agreements, DSP operating agreements, HCR contracts

---

## Tech Stack

- **React 18** with Vite
- **Claude API** (Anthropic) for AI-powered rate analysis, route scoring, and compliance Q&A
- **localStorage** for persistent data (no backend required)
- **Zero external UI dependencies** — all styles written inline

---

## Getting Started

### Prerequisites
- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/contractor-os.git
cd contractor-os

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173`

### Environment Variables

The Claude API key is handled client-side in this version. For production, move API calls to a backend proxy to protect your key.

### Build for Production

```bash
npm run build
```

Output goes to `dist/` — ready to deploy to Vercel, Netlify, or any static host.

---

## Deploy to Vercel

The fastest path to a live URL:

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — click **Deploy**
5. Done. Live URL in ~2 minutes.

`vercel.json` is already configured for you.

---

## Project Structure

```
contractor-os/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main application (all segments)
│   └── main.jsx         # React entry point
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
└── .gitignore
```

---

## Roadmap

- [ ] Backend API proxy for secure key management
- [ ] DAT API integration for live lane rate benchmarks
- [ ] Multi-user / team accounts
- [ ] Mobile-optimized driver view
- [ ] Telematics data integration (Amazon Mentor, FedEx GPS)
- [ ] IFTA quarterly report generator
- [ ] Route planning with HOS limit checking
- [ ] Export to PDF / CSV

---

## License

MIT — free to use, modify, and distribute.

---

*Built by a box truck owner-operator for the contract carrier industry.*
