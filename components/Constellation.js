"use client";

import { useMemo } from "react";

// Radius (as % of half the square) and dot size per ring.
const RING = {
  0: { r: 0, size: 66 },
  1: { r: 20, size: 27 },
  2: { r: 33, size: 21 },
  3: { r: 45, size: 16 },
};

function dotClass(a) {
  if (a.type === "brain") return "brain";
  if (a.type === "watchdog") return "watchdog";
  return a.status; // ok | error | running | idle
}

export default function Constellation({ agents, selectedId, onSelect }) {
  const placed = useMemo(() => {
    const byRing = { 0: [], 1: [], 2: [], 3: [] };
    for (const a of agents) byRing[a.ring].push(a);

    const out = [];
    for (const ring of [0, 1, 2, 3]) {
      const list = byRing[ring];
      const { r, size } = RING[ring];
      if (ring === 0) {
        list.forEach((a) => out.push({ a, x: 50, y: 50, size }));
        continue;
      }
      const n = list.length;
      // small per-ring offset so rings don't line up radially
      const offset = ring === 1 ? -90 : ring === 2 ? -90 + 18 : -90 + 9;
      list.forEach((a, i) => {
        const ang = ((2 * Math.PI) / n) * i + (offset * Math.PI) / 180;
        const x = 50 + r * Math.cos(ang);
        const y = 50 + r * Math.sin(ang);
        out.push({ a, x, y, size });
      });
    }
    return out;
  }, [agents]);

  return (
    <div className="constellation-wrap">
      <svg
        className="constellation"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {[20, 33, 45].map((r) => (
          <circle key={r} className="orbit-ring" cx="50" cy="50" r={r} />
        ))}
        {placed.map(({ a, x, y }) =>
          a.ring === 0 ? null : (
            <line
              key={`e-${a.id}`}
              className={`edge ${a.status === "running" ? "flow" : ""}`}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
            />
          )
        )}
      </svg>

      {placed.map(({ a, x, y, size }) => (
        <div
          key={a.id}
          className={`node ${selectedId === a.id ? "selected" : ""}`}
          style={{ left: `${x}%`, top: `${y}%` }}
          onClick={() => onSelect(a.id)}
        >
          <div
            className={`dot ${dotClass(a)}`}
            style={{ width: size, height: size }}
          />
          <div className="label">{a.name}</div>
        </div>
      ))}

      <div className="center-meta">
        {agents.length} agents · click any node
      </div>
    </div>
  );
}
