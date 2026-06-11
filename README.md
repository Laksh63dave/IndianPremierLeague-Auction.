<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=F5A623&height=120&section=header&text=IPL%20Auction%202026&fontSize=42&fontColor=0D0D0D&fontAlignY=65&animation=fadeIn" alt="IPL Auction 2026" />

### Build your dream squad. Rule the auction room.

[![Live Demo](https://img.shields.io/badge/▶%20Live%20Demo-laksh--iplauction.vercel.app-F5A623?style=for-the-badge&labelColor=0D0D0D)](https://laksh-iplauction.vercel.app/)

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-black?style=flat-square&logo=vercel)](https://laksh-iplauction.vercel.app/)

</div>

---

## What is it?

A fully interactive, single-player **IPL auction simulator** — pick a franchise, get **₹120 Crore**, and compete against 9 AI-powered rival teams to build the best squad before the gavel falls.

Every decision matters. Bid too early and you blow your budget. Wait too long and an AI snipes your target in the last 2 seconds. Designed to feel like a real auction room.

---

## Core Features

### ⚡ Auction Engine
- **10-second live bid timer** with a progress bar that pulses red in the final 3 seconds
- **Automatic player progression** — Batsmen → Wicketkeepers → All-rounders → Bowlers
- **Cinematic set-transition overlays** between each role group
- **Sold / Unsold resolution** — players with no bids enter the unsold pool, reviewable mid-auction

### 🤖 AI Bidding System — 6 Strategies

Each of the 9 rival teams runs a multi-strategy decision engine on every bid:

| Strategy | Behaviour |
|---|---|
| **Purse-to-Slot Panic** | Calculates average budget per remaining slot; caps spend when running lean |
| **Position Quota Logic** | Becomes aggressive when short on a role; backs off when already covered |
| **Price Elasticity** | Max bid ceilings scale with player rating — 95+ rated players trigger far higher limits |
| **Set Inflation Fatigue** | If 3+ players sold above ₹18 Cr early, AI cools down to conserve |
| **Squad Deficit Panic** | In the final 35% of the auction, AI emergency-bids for critical missing roles |
| **Rival Purse Bullying** | Top-3 richest AI teams inflate ceilings when rivals are visibly broke |

> AI also has **last-second snipe behaviour** — a randomised delay window in the final 2–3s simulates a real auction table.

### 🎙️ Live Commentary Engine

Contextual broadcast commentary generated dynamically at runtime:

- **Openers** — first bid on a new player
- **Escalation** — triggered when price crosses 2.5× base
- **Snipe** — commentary fires on last-second bids with ≤3s on clock
- **Sold anthems** — each of the 10 franchises has 3 unique custom sold lines *(e.g. "joins the Paltan! #AalaRe 💙" for MI)*
- All lines use parameterised templates — `{bidder}`, `{player}`, `{bid}`, `{timer}` — filled at runtime, no repeats

### 🔍 Scouting & Squad Tools

- **Live player search** — filter the full pool by name and role in real time
- **Target marking** — star any player; they glow when they hit the block
- **Sold tracking** — starred players show `SOLD ₹XCr` inline after being bought
- **Squad requirements panel** — live Bat / Bowl / AR / WK counts vs minimums
- **Teams overview modal** — all 10 franchises sorted by purse, drill into any squad

### 🎨 Design & UI

- **Dynamic franchise theming** — the entire UI shifts to your team's primary colour: glow, borders, buttons, badges
- **Franchise briefing screen** — pre-auction onboarding with strategy cards and squad requirements
- **3-2-1 countdown** — cinematic full-screen lead-in before bidding opens
- **Responsive three-panel auction board** — player pool / main card / user squad

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| State | `useState` / `useEffect` / `useMemo` |
| Deployment | Vercel |

No backend. No database. All auction state lives client-side in React.

---

## Getting Started

```bash
git clone https://github.com/Laksh63dave/IndianPremierLeague-Auction.git
cd IndianPremierLeague-Auction
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
├── app/
│   └── page.tsx        # Entire auction engine — all game logic
├── players.ts          # Full player pool: ratings, roles, base prices
├── shuffle.ts          # Fisher-Yates shuffle utility
└── public/
    └── logos/          # 10 IPL franchise PNGs (mi, csk, rcb …)
```

---

## How the Auction Works

```
1. Pick your franchise  →  ₹120 Crore purse assigned
2. Players go live      →  Sets: Bat → WK → AR → Bowl
3. Bid or hold          →  10 seconds. AI bids in real time.
4. Build your squad     →  Min 15 players: 5 bat · 4 bowl · 4 AR · 2 WK · max 4 overseas
5. Gavel falls          →  Final squad and purse balance revealed
```

> **Pro tip:** The AI snipes hard in the last 2 seconds. Don't wait on your key targets.

---

## Roadmap

- [x] Single-player auction vs 9 AI teams
- [x] 6-strategy AI decision engine
- [x] Live commentary hub
- [x] Player favourites and scouting
- [x] Dynamic franchise theming
- [x] Set-by-set auction progression
- [ ] **Multiplayer** — real-time lobby for up to 10 human players *(in development)*
- [ ] Post-auction team strength score + radar chart
- [ ] Player value predictor (ML estimated fair value)
- [ ] Match simulation after auction ends
- [ ] Mobile-optimised layout

### Multiplayer — In Development

Real-time multiplayer is being built with **WebSockets** (Socket.io or Supabase Realtime). Up to 10 players join a lobby, each pick a franchise, and compete in a shared live auction room with room codes and host-controlled flow.

---

## Feedback & Contributions

| Channel | Best for |
|---|---|
| [GitHub Issues](https://github.com/Laksh63dave/IndianPremierLeague-Auction/issues) | Bug reports, feature requests — trackable and public |
| [Instagram @lakshhh_63](https://www.instagram.com/lakshhh_63/) | Quick feedback, no GitHub account needed |
| [LinkedIn](https://www.linkedin.com/in/laksh63dave/) | Technical discussions, collabs |
| Pull Requests | Fix it yourself — all PRs welcome |

**Bug reports:** include what you did, what you expected, what happened, your browser/device, and a screenshot if possible.

**PRs:** fork → `git checkout -b fix/your-fix` → commit → open PR against `main`.

---

## Author

**Laksh Dave**

[![GitHub](https://img.shields.io/badge/GitHub-Laksh63dave-black?style=flat-square&logo=github)](https://github.com/Laksh63dave)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-laksh63dave-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/laksh63dave/)
[![Instagram](https://img.shields.io/badge/Instagram-lakshhh__63-E1306C?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/lakshhh_63/)

---

<div align="center">

<sub>© 2026 Laksh Dave · Not affiliated with BCCI or IPL · Built for fun</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=F5A623&height=80&section=footer" />

</div>
