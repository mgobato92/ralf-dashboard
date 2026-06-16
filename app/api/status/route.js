import { NextResponse } from "next/server";
import { readEvents, buildStats } from "@/lib/logparser";
import { AGENTS } from "@/lib/agents";

export const dynamic = "force-dynamic";

// Local-dev helper: reads runner.log off disk and returns live stats.
// The client no longer calls this — it reads /public/data.json which is baked
// by `npm run refresh`. This route stays so you can curl it for debugging.
export async function GET() {
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

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    summary: stats.summary,
    agents,
    feed: stats.feed,
    heatmap: stats.heatmap,
  });
}
