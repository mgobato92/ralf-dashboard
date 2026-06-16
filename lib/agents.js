// Curated metadata for every Ralf agent shown in the constellation.
// `id` matches the routine name in runner.log when a routine exists; on-demand
// skills have no log presence and are marked type: "ondemand".
//
// type:      brain | watchdog | scheduled | ondemand
// ring:      0 = center (brain), 1..3 = orbit distance
// schedule:  human-readable cadence (from the LaunchAgent table in ralf.md)

export const AGENTS = [
  {
    id: "ralf",
    name: "Ralf",
    role: "Orchestrator · Chief of Staff",
    type: "brain",
    ring: 0,
    category: "core",
    schedule: "Always on — entry point for every routine",
    description:
      "Marcelo's AI Chief of Staff. The single brain that runs every routine, drafts in his voice, and answers ad-hoc chief-of-staff questions.",
  },
  {
    id: "auth-watchdog",
    name: "Auth Watchdog",
    role: "Watchdog",
    type: "watchdog",
    ring: 1,
    category: "core",
    schedule: "Continuous health check",
    description:
      "Supervises auth/session health so the scheduled routines keep firing. Raises an alert when credentials need attention.",
  },

  // ---- Ring 1: high-frequency daily core ----
  {
    id: "morning-brief",
    name: "Morning Brief",
    role: "Daily kickoff",
    type: "scheduled",
    ring: 1,
    category: "daily",
    schedule: "Weekdays 7:57 BRT",
    description:
      "Today's calendar, open action items, and urgent inbox — synced against Projects memory first.",
  },
  {
    id: "pre-meeting",
    name: "Pre-Meeting",
    role: "Meeting prep",
    type: "scheduled",
    ring: 1,
    category: "daily",
    schedule: "Hourly :13 (8a–6p)",
    description:
      "Prepares a brief ahead of each upcoming meeting: who, context, recent threads, and what to land.",
  },
  {
    id: "post-meeting",
    name: "Post-Meeting",
    role: "Meeting capture",
    type: "scheduled",
    ring: 1,
    category: "daily",
    schedule: "Hourly :43 (8a–6p)",
    description:
      "Processes the last meeting: notes, decisions, and new action items into the Action Items DB.",
  },
  {
    id: "post-meeting-followup",
    name: "Post-Meeting Follow-up",
    role: "Capture sweep",
    type: "scheduled",
    ring: 1,
    category: "daily",
    schedule: "Follows each post-meeting run",
    description:
      "Second pass after post-meeting to chase loose ends and confirm captured items.",
  },
  {
    id: "evening-recap",
    name: "Evening Recap",
    role: "Daily wrap-up",
    type: "scheduled",
    ring: 1,
    category: "daily",
    schedule: "Weekdays 17:57 BRT",
    description:
      "Wraps the day: what got done, what slipped, and what's queued for tomorrow.",
  },

  // ---- Ring 2: weekly / periodic + lower-frequency scheduled ----
  {
    id: "whatsapp-digest",
    name: "WhatsApp Digest",
    role: "Messaging digest",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "Daily",
    description:
      "Summarizes WhatsApp activity so nothing important slips between threads.",
  },
  {
    id: "funds-followup",
    name: "Funds Follow-up",
    role: "LP / funds nudge",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "Recurring",
    description:
      "Tracks fund relationships and surfaces follow-ups that are due.",
  },
  {
    id: "todo-cleanup-followup",
    name: "To-do Cleanup Follow-up",
    role: "Action-item hygiene",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "Follows weekly cleanup",
    description:
      "Confirms the weekly to-do cleanup landed and de-dupes any stragglers.",
  },
  {
    id: "weekly-todo-cleanup",
    name: "Weekly To-do Cleanup",
    role: "Action-item hygiene",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "Fri 17:03 BRT",
    description:
      "De-dupes and closes stale action items; keeps the Action Items DB honest.",
  },
  {
    id: "weekly-projects-refresh",
    name: "Weekly Projects Refresh",
    role: "Projects memory",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "Fri 16:33 BRT",
    description:
      "Refreshes the Projects memory so briefs and recaps stay grounded.",
  },
  {
    id: "weekly-calendar-optimizer",
    name: "Weekly Calendar Optimizer",
    role: "Calendar hygiene",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "Sun 17:00 BRT",
    description:
      "Reviews next week's calendar for conflicts, gaps, and focus time.",
  },
  {
    id: "monthly-project-review",
    name: "Monthly Project Review",
    role: "Portfolio review",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "1st of month 9:03 BRT",
    description: "Monthly pass over active projects and their status.",
  },
  {
    id: "monthly-network-followup",
    name: "Monthly Network Follow-up",
    role: "Relationship nudge",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "Monthly",
    description:
      "Surfaces people in the network who are due for a touchpoint.",
  },
  {
    id: "monthly-funds-review",
    name: "Monthly Funds Review",
    role: "Funds review",
    type: "scheduled",
    ring: 2,
    category: "periodic",
    schedule: "Monthly",
    description: "Monthly review of fund relationships and commitments.",
  },

  // ---- Ring 3: on-demand skills (no scheduled runs) ----
  {
    id: "analyst",
    name: "Analyst",
    role: "Deal / thesis analysis",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description:
      "First-cut VC analysis of a document: classify, look up context, then bull/bear debate with a verdict.",
  },
  {
    id: "reply-email",
    name: "Reply Email",
    role: "Draft in voice",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description: "Drafts an email reply in Marcelo's voice for review.",
  },
  {
    id: "crm-capture",
    name: "CRM Capture",
    role: "CRM logging",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description: "Captures contacts and interactions into the CRM.",
  },
  {
    id: "network-relationship-manager",
    name: "Network RM",
    role: "Network",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description: "Manages relationships across the broader network.",
  },
  {
    id: "funds-relationship-manager",
    name: "Funds RM",
    role: "Funds",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description: "Manages LP and fund relationships.",
  },
  {
    id: "data-request",
    name: "Data Request",
    role: "Founder data",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description: "Sends a structured data request to a portfolio founder.",
  },
  {
    id: "build-fact-sheet",
    name: "Fact Sheet",
    role: "Company fact sheet",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description: "Builds a one-page fact sheet for a company.",
  },
  {
    id: "lp-memo",
    name: "LP Memo",
    role: "LP communication",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description: "Drafts an LP memo for a new investment or business update.",
  },
  {
    id: "cloud-deploy",
    name: "Cloud Deploy",
    role: "Infra",
    type: "ondemand",
    ring: 3,
    category: "ondemand",
    schedule: "On demand",
    description: "Deploys or runs something on GCP Cloud Run (sandbox).",
  },
];

export const AGENTS_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a]));
