"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Constellation from "@/components/Constellation";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function relTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function clock(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Page() {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState("ralf");

  // Always reads from /public/data.json — a snapshot baked from runner.log.
  // Refresh it locally anytime with: npm run export:data
  const load = useCallback(async () => {
    const s = await fetch("/data.json", { cache: "no-store" }).then((r) => r.json());
    setData(s);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = useMemo(
    () => data?.agents.find((a) => a.id === selectedId) || null,
    [data, selectedId]
  );

  const heatMax = useMemo(() => {
    if (!data) return 1;
    let m = 1;
    for (const row of data.heatmap) for (const v of row) if (v > m) m = v;
    return m;
  }, [data]);

  if (!data) {
    return (
      <div className="shell">
        <div className="loading">Loading…</div>
      </div>
    );
  }

  const { summary, agents, feed, heatmap } = data;

  return (
    <div className="shell">
      {/* header */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-dot" />
          <div>
            <h1>Constelação Ralf</h1>
            <p>Marcelo's Chief-of-Staff agents</p>
          </div>
        </div>
        <div className="topbar-right">
          <span className="refresh-note">snapshot · {clock(data.generatedAt)}</span>
          <span className="live-pill">
            <span className="blip" /> LIVE
          </span>
        </div>
      </div>

      {/* stat cards */}
      <div className="stats">
        <div className="stat">
          <div className="label">Agents</div>
          <div className="value">{agents.length}</div>
          <div className="sub">{summary.activeAgents} with run history</div>
        </div>
        <div className="stat">
          <div className="label">Runs today</div>
          <div className="value">{summary.runsToday}</div>
          <div className="sub">across all routines</div>
        </div>
        <div className="stat">
          <div className="label">Total runs logged</div>
          <div className="value">{summary.totalRuns.toLocaleString()}</div>
          <div className="sub">all-time in runner.log</div>
        </div>
        <div className="stat">
          <div className="label">Uptime</div>
          <div className="value">
            {summary.uptime}<span className="unit">%</span>
          </div>
          <div className="sub">{summary.totalFailures} failed runs</div>
        </div>
        <div className="stat">
          <div className="label">Last activity</div>
          <div className="value" style={{ fontSize: 20 }}>
            {relTime(summary.lastActivityIso)}
          </div>
          <div className="sub">most recent log event</div>
        </div>
      </div>

      {/* main grid */}
      <div className="grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="card-head">
              <h2>Constellation</h2>
              <span className="hint">Ralf at the center · click any node</span>
            </div>
            <Constellation agents={agents} selectedId={selectedId} onSelect={setSelectedId} />
          </div>

          <div className="card">
            <div className="card-head">
              <h2>Activity heatmap</h2>
              <span className="hint">runs by day &amp; hour (all-time)</span>
            </div>
            <div className="heatmap">
              {heatmap.map((row, dow) => (
                <div className="heat-grid" key={dow} style={{ marginBottom: 3 }}>
                  <div className="heat-rowlabel">{DOW[dow]}</div>
                  {row.map((v, h) => {
                    const intensity = v / heatMax;
                    return (
                      <div
                        key={h}
                        className="heat-cell"
                        title={`${DOW[dow]} ${h}:00 — ${v} runs`}
                        style={{
                          background:
                            v === 0
                              ? "rgba(124,140,255,0.06)"
                              : `rgba(124,140,255,${0.18 + intensity * 0.72})`,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
              <div className="heat-axis">
                <span />
                {Array.from({ length: 24 }, (_, h) => (
                  <span key={h}>{h % 6 === 0 ? h : ""}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* side column */}
        <div className="side">
          {selected && (
            <div className="card">
              <div className="card-head">
                <h2>Agent</h2>
                <span className={`status-tag ${selected.status}`}>{selected.status}</span>
              </div>
              <div className="detail">
                <div className="role">{selected.role}</div>
                <h3>{selected.name}</h3>
                <div className="desc">{selected.description}</div>
                <div className="kv">
                  <div>
                    <div className="k">Schedule</div>
                    <div className="v" style={{ fontSize: 12.5 }}>{selected.schedule}</div>
                  </div>
                  <div>
                    <div className="k">Last run</div>
                    <div className="v" style={{ fontSize: 12.5 }}>{relTime(selected.lastStartIso)}</div>
                  </div>
                  <div>
                    <div className="k">Runs today</div>
                    <div className="v">{selected.runsToday}</div>
                  </div>
                  <div>
                    <div className="k">Total runs</div>
                    <div className="v">{selected.runs.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="k">Success rate</div>
                    <div className="v">
                      {selected.successRate === null ? "—" : `${selected.successRate}%`}
                    </div>
                  </div>
                  <div>
                    <div className="k">Failures</div>
                    <div className="v">{selected.failures}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-head">
              <h2>Activity feed</h2>
              <span className="hint">last {feed.length} events</span>
            </div>
            <div className="feed">
              {feed.map((e, i) => {
                const cls =
                  e.kind === "START" ? "start"
                  : e.exit === 0 || e.exit === null ? "ok"
                  : "err";
                return (
                  <div className="feed-row" key={i}>
                    <span className={`fdot ${cls}`} />
                    <span className="fagent">{e.agent}</span>
                    <span className="fkind">
                      {e.kind === "START" ? "started" : `ended${e.exit ? ` (exit ${e.exit})` : ""}`}
                    </span>
                    <span className="ftime">{e.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
