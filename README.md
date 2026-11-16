# Greedy Pig

A web version of the dice game *Greedy Pig* (also known as Pig), built for CSC 419 at Pan-Atlantic University. Play pass-and-play with friends on one device, or play against a computer opponent with five difficulty levels.

## Team

| Name | Matric No |
|---|---|
| Onukwu Kanayochukwu | 23120111049 |
| Olabalade Emmanuel | 23120111046 |
| MaryAnne Ochulor | 23120111034 |
| Folashade Williams | 24120111116 |
| Ugwu Chinonso Onochie | 23120111052 |

## The game

Players take turns rolling a die. Each roll adds to your turn score, and you can bank at any time to lock the turn score into your total. Roll a 1 and you lose everything from that turn. First to the target score wins.

The server rolls the die and decides every score and the winner; the browser only displays what the server returns, so no client can cheat.

## Our three improvements

### 1. Power-ups ("Muddy Pig" set)

Bust with 10 or more turn points and you earn a random power-up (the *Comeback* rule), up to three held at a time. One can be used per turn, from the tray under the die.

| Power-up | What it does |
|---|---|
| 🐽 Truffle Sniff | Tells you whether your next roll is a 1, so you can bank in time. |
| 🐷 Piggy Bank | Bank half your turn score right now and keep rolling with the rest. |
| 🟤 Mud Bath | The next time you bust, you keep half your turn score instead of losing it all. |
| 🐾 Muddy Trotters | Pick an opponent: their next bank only counts half. |

Each event has on-screen feedback (sniff answer, mud flash on a saved bust, halved-bank note, earned highlight) so players never miss what happened. All power-up rules live on the server.

### 2. Computer opponent (bots)

Play vs Computer gives you one opponent with a difficulty from **Very Easy** to **Expert**. Each level has its own strategy: how many points it chases per turn, how it reacts to being behind, and how long it "thinks". The computer rolls through the same animated die as a human, and you can watch each of its decisions in a turn recap. The vs-computer mode is deliberately kept simple: no power-ups and no route back to the friends setup, so it plays as its own mode.

### 3. Keyboard accessibility

The whole game can be played without a mouse:

| Key | Action |
|---|---|
| `R` | Roll |
| `B` | Bank |
| `M` | Toggle sound |
| `1` `2` `3` | Use power-up slot 1, 2 or 3 |
| `Esc` | Close the target picker |
| `N` / `H` | Next game / Home on the game-over screen |
| `?` | Show the shortcut help |

Shortcuts pause while a dialog is open, the shortcut list is on the How To Play page, interactive controls carry ARIA labels, and feedback messages are announced to screen readers through live regions.

## How to run

### Requirements

- Node.js 18 or newer
- npm

### Quick start (no backend needed)

The frontend ships with a mock server that runs in the browser, so the game is fully playable with just these steps:

```bash
git clone https://github.com/Th3xander/greed_piggy.git
cd greed_piggy
npm install
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Open the URL Vite prints (normally http://localhost:5173). `.env.local` has `VITE_USE_MOCK_API=true` by default, which selects the mock server.

### Running with the real backend (Express + Supabase)

1. Create a Supabase project and run `backend/greedy_pig_schema.sql` in its SQL editor.
2. In `backend/`, create a `.env` file:

   ```
   SUPABASE_URL=your-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```

3. Start the API:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   It runs on http://localhost:5000/api.

4. In the frontend's `.env.local`, set `VITE_USE_MOCK_API=false` and `VITE_API_URL=http://localhost:5000/api`, then restart `npm run dev`.

### Other commands

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint
```

## Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router 6
- **Backend:** Node.js, Express, Supabase (PostgreSQL)

## Project layout

```
src/
  api/          API client and the in-browser mock server
  components/   shared UI (die, power-up tray, shortcut help, …)
  computer/     computer opponent: difficulty levels, strategy, turn animation
  context/      game session state (single source of truth from the server)
  hooks/        audio, keyboard shortcuts, image preloading
  routes/       pages: Home, How To Play, friends setup, vs-computer setup, game
backend/
  src/          Express app, routes and controllers
  greedy_pig_schema.sql
```