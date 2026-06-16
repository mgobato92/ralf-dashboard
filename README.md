# Constelação Ralf

A localhost dashboard that visualizes how Marcelo's **Ralf** chief-of-staff agents
operate — modeled on the "Constellation of Agents" idea from
[agents.liqi.com.br](https://agents.liqi.com.br/login).

Ralf sits at the center as the **Cérebro (Brain)**, **Vigília** is the watchdog,
and every scheduled routine + on-demand skill orbits around them. Node color =
live status, pulled straight from `~/.claude/ralf-tasks/logs/runner.log`.

## Run it

```bash
cd ~/Documents/Claude/ralf-dashboard
npm install      # first time only
npm run dev      # http://localhost:3000
```

It auto-refreshes every 30s. Localhost only — no login, nothing leaves your Mac.

## What it shows

- **Hero stats** — agents, runs today, all-time runs, uptime (success rate), last activity
- **Constellation** — each agent as a node; green = last run OK, red = last run failed,
  blue pulse = currently running, amber = watchdog, gray = on-demand (no scheduled runs)
- **Activity heatmap** — runs by day-of-week × hour, all-time
- **Activity feed** — the latest 60 START/END events from the runner log
- **Agent panel** — click any node for its schedule, last run, run count, success rate
- **Live context** — today's calendar, open action items, recent Slack (see below)

## Data sources

| Panel | Source |
|---|---|
| Stats, constellation, heatmap, feed, agent panel | `~/.claude/ralf-tasks/logs/runner.log` (read live) |
| Live context strip | `~/.claude/ralf-tasks/dashboard/snapshot.json` (optional) |

### The live-context snapshot (optional)

The app has no credentials of its own. To fill the "Live context" strip, have Ralf
write `~/.claude/ralf-tasks/dashboard/snapshot.json` using its MCP access. Shape:

```json
{
  "calendar":    [{ "title": "...", "time": "10:00" }],
  "actionItems": [{ "task": "...", "priority": "High", "category": "Portfolio" }],
  "slack":       [{ "text": "...", "time": "09:14" }]
}
```

Until that file exists, the strip shows a friendly "not connected" note.

## Adding / renaming agents

Everything about the nodes (names, roles, rings, schedules, descriptions) lives in
[`lib/agents.js`](lib/agents.js). The `id` must match the routine name in
`runner.log` for live stats to attach; on-demand skills use `type: "ondemand"`.

## Files

- `lib/logparser.js` — parses runner.log → events + per-agent stats + heatmap
- `lib/agents.js` — curated agent metadata
- `app/api/status/route.js` — merges metadata + live stats
- `app/api/snapshot/route.js` — reads the optional snapshot
- `components/Constellation.js` — the orbit/constellation render
- `app/page.js` — the dashboard
