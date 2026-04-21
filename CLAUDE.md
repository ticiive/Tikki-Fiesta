# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at http://localhost:8080
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run tests once (Vitest)
npm run test:watch   # Tests in watch mode
npm run preview      # Preview production build
```

## Architecture

**Pop Board Play** is a fully client-side, tropical-themed board game (no backend). Players (2–6) take turns across multiple rounds earning coins (búzios) and stars (pérolas) via minigames.

### Game Flow

```
Index (setup: players + rounds)
  → Game (active player turn: adjust coins/stars, navigate to sorteio)
    → Sorteio (animated minigame lottery reveal)
      → Timer (minigame countdown — placeholder "Em breve")
  → Ranking (final leaderboard, shown when rounds are exhausted)
```

State is passed between pages via **React Router `location.state`** — there is no global state manager. Nothing persists across a page refresh.

### Key Files

| Path | Role |
|---|---|
| `src/pages/Index.tsx` | Player/round selection; builds initial `Player[]` |
| `src/pages/Game.tsx` | Turn rotation, score mutation, round counter; **line 47-50 has a critical guard against infinite loop when cycling back to the starting player** |
| `src/pages/Sorteio.tsx` | Card-shuffle animation; defines the 5 minigame objects inline |
| `src/pages/Ranking.tsx` | Final screen sorted by stars then coins |
| `src/components/IslandLayout.tsx` | Master layout wrapper — tropical sea background + wooden frame |
| `src/components/SeaBackground.tsx` | Multi-layer animated ocean (CSS wave keyframes) |
| `src/components/game/ActivePlayerCard.tsx` | Current player HUD with +/− coin/star buttons |
| `src/types/game.ts` | `Player` interface: `{ id, label, coins, stars }` |
| `src/lib/utils.ts` | `cn()` — Tailwind class merger |

### UI & Styling

- **shadcn/ui** (Radix primitives) for base components in `src/components/ui/`
- **Tailwind CSS** with custom tokens in `tailwind.config.ts`: `coral` (#FF7F50), `menta` (#AAF0D1), `areia` (#F4E4C1), `turquoise` (#1FBFCF), `wave` (#40B0D0)
- **Framer Motion** used broadly for entrance animations; `MotionBounce` is a reusable spring-bounce wrapper
- CSS custom properties in `src/index.css` expose design tokens (including `--pop-shadow-*` variants)
- Fonts: Fredoka (in-game display), Quicksand (fallback) via `@fontsource`

### TypeScript

Config has `noImplicitAny: false` and `skipLibCheck: true` — intentionally relaxed for rapid development. Path alias `@` maps to `src/`.
