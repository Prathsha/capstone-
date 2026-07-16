# IBM Client Intelligence Agent

A seller productivity tool that aggregates account intelligence, quota tracking, and market signals into a single dashboard — built with React + FastAPI, following IBM Design Language guidelines.

## Architecture

```
basic-react-app/
├── src/                        # React frontend
│   ├── App.js                  # Root: routing, account selector, state
│   ├── styles/global.css       # IBM Design Language color system + components
│   ├── services/api.js         # Axios API client
│   ├── components/
│   │   ├── Topbar.js           # IBM header bar
│   │   ├── Sidebar.js          # Navigation sidebar
│   │   └── Helpers.js          # Shared UI components + utils
│   └── pages/
│       ├── Dashboard.js        # Quota progress + action items
│       └── MarketIntelligence.js # News, financial news, stock data
│
└── backend/
    ├── main.py                 # FastAPI app (accounts, news, financial endpoints)
    ├── accounts.json           # Seed data: 9 accounts + seller profile
    └── requirements.txt        # Python dependencies
```

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
# → API docs: http://localhost:8000/docs
```

### 2. Frontend (React)

```bash
# from project root
npm start
# → http://localhost:3000
```

## API Keys

Open [`backend/main.py`](backend/main.py) and replace the placeholder values:

| Variable | Service | Get Key |
|---|---|---|
| `NEWS_API_KEY` | NewsAPI | https://newsapi.org |
| `FINNHUB_API_KEY` | Finnhub | https://finnhub.io |

> **yfinance** requires no API key — stock data is fetched directly.  
> Without keys, the app shows realistic mock data with a warning banner.

## Features

### Dashboard (`/`)
- **Quota progress bar** — closed won + pipeline overlay against total quota
- **KPI tiles** — closed amount, pipeline, pending actions count, AI suggestion count
- **Pending Action Items** — prioritized (critical → high → medium) with due dates
- **AI-Suggested Actions** — ranked by confidence score with visual confidence bars
- **Per-account attainment table** — health score, tier, and quota % per account
- **Account selector** — view all accounts, a tier group (Premier / Strategic), or one account

### Market Intelligence (`/intelligence`)
- **General News tab** — NewsAPI with precise, disambiguated company queries  
  (e.g. `"Lincoln National" (insurance OR financial OR LNC)` — no Abraham Lincoln articles)
- **Financial News tab** — Finnhub company news for publicly traded accounts
- **Stock & Financials tab** — yfinance: price, market cap, P/E, analyst target, 90-day chart

## IBM Design Language

Colors follow the official IBM color system: https://www.ibm.com/design/language/color/

- **Primary action:** IBM Blue 60 (`#0f62fe`)
- **Success:** Green 50 (`#24a148`)
- **Warning:** Yellow 30 (`#f1c21b`)
- **Error/Critical:** Red 60 (`#da1e28`)
- **Sidebar:** Cool Gray 100 (`#161616`)
- **Typography:** IBM Plex Sans (300/400/600/700) + IBM Plex Mono

## Sample Accounts

| Account | Ticker | Tier |
|---|---|---|
| Quest Diagnostics | DGX | Horizon |
| The Lincoln National Life Insurance Company | LNC | Horizon |
| Siemens | SIEGY | Horizon |
| SEI Investments | SEIC | Horizon |
| Independence BlueCross | — | Horizon |
| SunGard Data Systems | — | Horizon |
| Select Medical Corp | SEM | Horizon |
| Ricoh | RICOY | Horizon |
| Sagent M&C LLC | — | Horizon |
