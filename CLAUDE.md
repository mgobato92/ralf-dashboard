# ralf-dashboard — Claude instructions

## Auto-push rule
**After every code change to this project, commit and push to GitHub.**
```bash
cd /Users/mgobato/Documents/Claude/ralf-dashboard
git add -A
git commit -m "<short description of what changed>"
git push
```
No exceptions — every edit lands on GitHub so Lovable stays in sync.

## Data refresh
To bake a fresh snapshot from runner.log before pushing:
```bash
npm run push   # refreshes data.json + commits + pushes in one step
```

## Architecture
- Client reads ONLY from `/public/data.json` — no live API calls from the browser.
- `lib/logparser.js` parses `~/.claude/ralf-tasks/logs/runner.log` (local Mac only).
- `lib/agents.js` is the single source of truth for agent metadata (names, rings, schedules).
- `scripts/export-data.mjs` bakes runner.log → public/data.json.
- `app/api/status/route.js` exists for local debugging only (curl only, client ignores it).

## GitHub
Repo: https://github.com/mgobato92/ralf-dashboard (private)
Lovable is connected to this repo — every push triggers a Lovable sync.
