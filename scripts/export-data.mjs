// Bakes the current Ralf status into public/data.json from runner.log.
//
// Run:  npm run refresh        — update the snapshot
//       npm run push           — update snapshot + commit + push to GitHub
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readEvents, buildStats } from "../lib/logparser.js";
import { AGENTS } from "../lib/agents.js";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "public", "data.json");

const events = readEvents();
const stats = buildStats(events);

const agents = AGENTS.map((a) => {
  const s = stats.perAgent[a.id] || {};
  return {
    ...a,
    runs: s.runs || 0,
    runsToday: s.runsToday || 0,
    successRate: s.successRate ?? null,
    failures: s.failures || 0,
    status: s.status || "idle",
    lastStartIso: s.lastStartIso || null,
    lastEndIso: s.lastEndIso || null,
    lastExit: s.lastExit ?? null,
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  summary: stats.summary,
  agents,
  feed: stats.feed,
  heatmap: stats.heatmap,
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(payload, null, 2));

console.log(
  `✓ Wrote public/data.json\n  ${agents.length} agents · ${stats.summary.totalRuns} total runs · ${stats.summary.runsToday} today`
);
