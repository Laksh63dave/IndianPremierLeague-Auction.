<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=F5A623&height=120&section=header&text=IPL%20Auction%202026&fontSize=42&fontColor=FFFFFF&fontAlignY=65&animation=fadeIn" />

# 🏏 IPL Auction 2026

### Build your dream squad. Rule the auction.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://laksh-iplauction.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**[Live Demo →](https://laksh-iplauction.vercel.app/)**

</div>

---

## What is this?

IPL Auction 2026 is a fully interactive, single-player IPL auction simulator built with Next.js and TypeScript. You pick a franchise, get ₹120 Crore, and compete against 9 AI-powered rival teams to build the best squad before the gavel falls.

Every decision matters — bid too early and you blow your budget on early sets, wait too long and an AI snipes your target in the last 2 seconds. The game is designed to feel like a real auction room.

---

## Features

### Core Auction Engine

- **Real-time 10-second bid timer** with a live progress bar that pulses red in the final 3 seconds
- **Automatic player progression** — auction moves through all players sorted by role: Batsmen → Wicketkeepers → All-rounders → Bowlers
- **Set transition overlays** — cinematic full-screen announcements between each role group
- **Sold / Unsold resolution** — players with no bids go to the unsold pool; you can review them anytime mid-auction

### AI Bidding System (6 Strategies)

The 9 rival AI teams don't just bid randomly. Each one runs a multi-strategy decision engine on every bid:

| Strategy | What it does |
|---|---|
| **Purse-to-Slot Panic** | AI calculates average budget per remaining slot and caps spending if it's running low |
| **Position Quota Logic** | AI becomes aggressive when it's short on a role, and backs off when it already has world-class cover |
| **Price Elasticity** | Max bid limits scale with player rating — elite (95+) players trigger much higher ceilings |
| **Set Inflation Fatigue** | If 3+ players have already sold above ₹18 Cr early in the auction, AI cools down to conserve |
| **Squad Deficit Panic Mode** | In the final 35% of the auction, AI goes into emergency mode if it's short on a required role |
| **Rival Purse Bullying** | Top-3 richest AI teams inflate their ceilings when they know rivals are broke |

AI also has **last-second snipe behaviour** — a random delay window in the final 2–3 seconds simulates a real auction table.

### Live Commentary Engine

A dynamic broadcast commentary hub generates contextual lines based on what's actually happening:

- **Openers** — first bid on a player
- **Standard** — mid-auction increments
- **Escalation** — when price crosses 2.5x base
- **Snipe** — last-second bids with ≤3s on clock
- **Bullying** — when a rich AI dominates the room
- **Sold anthems** — each of the 10 franchises has 3 unique custom sold lines (e.g. *"joins the Paltan! #AalaRe 💙"* for MI)
- **Unsold** — 3 variants of commentary when no one bids

All lines are parameterised templates — `{bidder}`, `{player}`, `{bid}`, `{timer}` — filled dynamically at runtime. No repeated lines.

### Scouting & Squad Management

- **Player search sidebar** — search the full player pool by name in real time, filtered by role
- **Favourites / Target marking** — star any unsold player to get a visual highlight glow when they hit the auction block
- **Sold status tracking** — starred players show `(SOLD - ₹XCr)` inline once bought, star icon disappears
- **Squad Requirements panel** — live tracker showing Bat/Bowl/AR/WK counts vs minimums (5/4/4/2)
- **Teams overview modal** — view all 10 franchises sorted by remaining purse; drill into any team's full squad
- **Unsold players modal** — review every unsold player with their country

### UI & Design

- **Dynamic colour theming** — the entire UI shifts to your selected franchise's primary colour. Glow, borders, buttons, badges, and accents all update live
- **Franchise mottos** — each team's tagline displays on the selection screen (`#WhistlePodu`, `#EeSalaCupNamde`, etc.)
- **Franchise briefing screen** — pre-auction onboarding with strategy cards and squad requirements
- **3-2-1 countdown** — cinematic full-screen countdown before the auction opens
- **Hover watermark effect** — semi-transparent team logos appear behind franchise cards on hover
- **Sold overlay** — full-screen modal with team logo and final price on every sale
- **Responsive auction board** — three-panel layout: player pool sidebar / main auction card / user squad sidebar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Deployment | Vercel |
| State | React `useState` / `useEffect` / `useMemo` |

No backend. No database. All auction state is managed client-side in React.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Laksh63dave/IndianPremierLeague-Auction.git
cd IndianPremierLeague-Auction

# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── app/
│   └── page.tsx          # Main auction engine (all game logic lives here)
├── players.ts            # Full player pool with ratings, roles, base prices
├── shuffle.ts            # Fisher-Yates shuffle utility
├── public/
│   └── logos/            # All 10 IPL franchise logo PNGs
│       ├── mi.png
│       ├── csk.png
│       └── ...
```

---

## How the Auction Works

1. **Pick your franchise** — choose from all 10 IPL teams. Your starting purse is ₹120 Crore.
2. **Auction begins** — players come up in sets: Batsmen first, then Wicketkeepers, All-rounders, Bowlers.
3. **Bid or hold** — you have 10 seconds per player. Click BID to raise the price. The AI teams bid against you in real time.
4. **Build your squad** — you need at least 15 players: 5 bat, 4 bowl, 4 AR, 2 WK. Max 4 overseas players.
5. **Auction ends** — once all players are processed, the game ends. Your final squad and purse balance are shown.

**Pro tip:** The AI snipes hard in the last 2 seconds. Don't wait too long on your key targets.

---

## Roadmap

- [x] Single-player auction vs 9 AI teams
- [x] 6-strategy AI decision engine
- [x] Live commentary hub
- [x] Player favourites and scouting
- [x] Dynamic franchise theming
- [x] Set-by-set auction progression
- [ ] **Multiplayer** — real-time auction with up to 10 human players (in development)
- [ ] Player value predictor (ML model — estimated fair value per player)
- [ ] Post-auction team strength score and radar chart
- [ ] Mobile-optimised layout
- [ ] Match simulation after auction ends

---

## Multiplayer (In Development)

Real-time multiplayer is currently being built. Up to 10 players will be able to join a lobby, each pick a different franchise, and compete in a live shared auction room.

Planned tech: **WebSockets** (Socket.io or Supabase Realtime) for shared bid state, lobby system with room codes, and a host-controlled auction flow.

If you want to follow progress or contribute, watch the repo.

---

## Found a Bug? Have a Feature Idea?

Feedback is what makes this game better. Here are all the ways you can reach me:

### Option 1 — GitHub Issues (best for bugs)

This is the most useful channel because it keeps everything tracked and public so others can upvote or add context.

**To report a bug:**
1. Go to [Issues](https://github.com/Laksh63dave/IndianPremierLeague-Auction/issues) → **New Issue** → select **Bug Report**
2. Include:
   - What you were doing when it happened
   - What you expected vs what actually happened
   - Your browser and device (e.g. Chrome on Android)
   - A screenshot if possible

**To suggest a feature:**
1. Go to [Issues](https://github.com/Laksh63dave/IndianPremierLeague-Auction/issues) → **New Issue** → select **Feature Request**
2. Describe the idea and why it would improve the game

> You need a free GitHub account to open an issue. Takes 2 minutes to sign up.

---

### Option 2 — Instagram DM (quickest)

If you don't have GitHub and just want to quickly tell me something, slide into my DMs:

**[@lakshhh_63](https://www.instagram.com/lakshhh_63/)** on Instagram

Drop a message with what you found or what you'd like to see. I check this regularly.

---

### Option 3 — LinkedIn (for serious feedback or collabs)

If you're a developer and want to discuss the project more technically, or have ideas about collaborating:

**[linkedin.com/in/laksh63dave](https://www.linkedin.com/in/laksh63dave/)**

---

### Option 4 — Submit a Pull Request (for developers)

If you want to fix something yourself:

1. Fork the repo
2. Create a branch: `git checkout -b fix/your-fix-name`
3. Make your changes and commit: `git commit -m 'Fix: describe what you fixed'`
4. Push and open a PR against `main`

All PRs are welcome — bug fixes, UI improvements, new player data, anything.

---

## Author

Built by **Laksh Dave**.

[![GitHub](https://img.shields.io/badge/GitHub-Laksh63dave-black?style=flat-square&logo=github)](https://github.com/Laksh63dave)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-laksh63dave-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/laksh63dave/)
[![Instagram](https://img.shields.io/badge/Instagram-lakshhh__63-pink?style=flat-square&logo=instagram)](https://www.instagram.com/lakshhh_63/)

---

<div align="center">
<sub>© 2026 Laksh Dave · Not affiliated with BCCI or IPL · Built for fun</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=F5A623&height=80&section=footer" />
</div>
