// Server-only. Parses ~/.claude/ralf-tasks/logs/runner.log into structured
// events and derived stats. Log lines look like:
//   2026-06-16 14:51:35 START: pre-meeting
//   2026-06-16 14:51:35 END: pre-meeting (exit=0)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const RUNNER_LOG = path.join(
  os.homedir(),
  ".claude",
  "ralf-tasks",
  "logs",
  "runner.log"
);

const LINE_RE =
  /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) (START|END): ([a-z0-9-]+)(?: \(exit=(\d+)\))?/;

// Parse a log line into { ts(Date), date, time, kind, agent, exit }.
function parseLine(line) {
  const m = LINE_RE.exec(line);
  if (!m) return null;
  const [, y, mo, d, h, mi, s, kind, agent, exit] = m;
  const ts = new Date(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    Number(s)
  );
  return {
    ts,
    iso: ts.toISOString(),
    date: `${y}-${mo}-${d}`,
    time: `${h}:${mi}:${s}`,
    kind,
    agent,
    exit: exit === undefined ? null : Number(exit),
  };
}

export function readEvents() {
  let raw;
  try {
    raw = fs.readFileSync(RUNNER_LOG, "utf8");
  } catch {
    return [];
  }
  const events = [];
  for (const line of raw.split("\n")) {
    const e = parseLine(line);
    if (e) events.push(e);
  }
  return events;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Build per-agent stats + global summary + recent feed + heatmap.
export function buildStats(events) {
  const now = new Date();
  const perAgent = {};

  const ensure = (id) =>
    (perAgent[id] ??= {
      id,
      runs: 0,
      runsToday: 0,
      ends: 0,
      failures: 0,
      lastStart: null,
      lastEnd: null,
      lastExit: null,
    });

  // heatmap: 7 days-of-week (0=Sun..6=Sat) x 24 hours, counts of STARTs
  const heatmap = Array.from({ length: 7 }, () => new Array(24).fill(0));

  for (const e of events) {
    const a = ensure(e.agent);
    if (e.kind === "START") {
      a.runs += 1;
      if (sameDay(e.ts, now)) a.runsToday += 1;
      if (!a.lastStart || e.ts > a.lastStart) a.lastStart = e.ts;
      heatmap[e.ts.getDay()][e.ts.getHours()] += 1;
    } else {
      a.ends += 1;
      if (e.exit !== 0 && e.exit !== null) a.failures += 1;
      if (!a.lastEnd || e.ts > a.lastEnd) {
        a.lastEnd = e.ts;
        a.lastExit = e.exit;
      }
    }
  }

  for (const id of Object.keys(perAgent)) {
    const a = perAgent[id];
    a.successRate = a.ends ? Math.round(((a.ends - a.failures) / a.ends) * 100) : null;
    // status: running if a START is newer than the latest END; else ok/error
    if (a.lastStart && (!a.lastEnd || a.lastStart > a.lastEnd)) {
      a.status = "running";
    } else if (a.lastExit === 0 || a.lastExit === null) {
      a.status = "ok";
    } else {
      a.status = "error";
    }
    a.lastStartIso = a.lastStart ? a.lastStart.toISOString() : null;
    a.lastEndIso = a.lastEnd ? a.lastEnd.toISOString() : null;
    delete a.lastStart;
    delete a.lastEnd;
  }

  // global summary
  const totalRuns = events.filter((e) => e.kind === "START").length;
  const totalEnds = events.filter((e) => e.kind === "END");
  const totalFailures = totalEnds.filter((e) => e.exit !== 0 && e.exit !== null).length;
  const runsToday = events.filter(
    (e) => e.kind === "START" && sameDay(e.ts, now)
  ).length;
  const uptime = totalEnds.length
    ? Math.round(((totalEnds.length - totalFailures) / totalEnds.length) * 1000) / 10
    : 100;

  // recent feed: last 60 events, newest first
  const feed = events.slice(-60).reverse().map((e) => ({
    iso: e.iso,
    date: e.date,
    time: e.time,
    kind: e.kind,
    agent: e.agent,
    exit: e.exit,
  }));

  const lastEvent = events.length ? events[events.length - 1] : null;

  return {
    perAgent,
    summary: {
      totalRuns,
      runsToday,
      uptime,
      activeAgents: Object.keys(perAgent).length,
      totalFailures,
      lastActivityIso: lastEvent ? lastEvent.iso : null,
    },
    feed,
    heatmap,
  };
}
