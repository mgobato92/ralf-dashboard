// Push a fresh snapshot to GitHub so the Lovable-connected repo stays current.
//
// First-time setup (run once, manually):
//   1. Create a repo on GitHub: https://github.com/new
//      Suggested name: ralf-dashboard   (can be private)
//   2. Run:  git remote add origin git@github.com:YOUR_USERNAME/ralf-dashboard.git
//
// After that, just run:
//   npm run push
//
// That will:
//   1. Bake a fresh public/data.json from runner.log
//   2. Commit only public/data.json + any source changes
//   3. Push to main
//
// The export-data step already ran before this script (see package.json "push" script).

import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

function run(cmd) {
  return execSync(cmd, { cwd: root, stdio: "pipe" }).toString().trim();
}

function runLive(cmd) {
  execSync(cmd, { cwd: root, stdio: "inherit" });
}

// Verify we're inside a git repo with a remote.
try {
  run("git rev-parse --git-dir");
} catch {
  console.error(
    "❌  Not a git repo yet.\n\n" +
    "Run these once to set it up:\n" +
    "  cd ~/Documents/Claude/ralf-dashboard\n" +
    "  git init\n" +
    "  git remote add origin git@github.com:YOUR_USERNAME/ralf-dashboard.git\n" +
    "  git add .\n" +
    "  git commit -m 'initial commit'\n" +
    "  git push -u origin main\n"
  );
  process.exit(1);
}

const remotes = run("git remote");
if (!remotes.includes("origin")) {
  console.error(
    "❌  No 'origin' remote found.\n" +
    "Add one with:\n" +
    "  git remote add origin git@github.com:YOUR_USERNAME/ralf-dashboard.git\n"
  );
  process.exit(1);
}

// Read the just-baked snapshot to confirm it exists.
const dataPath = join(root, "public", "data.json");
const { generatedAt, summary } = JSON.parse(readFileSync(dataPath, "utf8"));

const status = run("git status --porcelain");
if (!status) {
  console.log("✓ Nothing changed since last push — already up to date.");
  process.exit(0);
}

const msg = `refresh: ${summary.totalRuns} runs · ${summary.runsToday} today · ${generatedAt.slice(0, 16)}`;

console.log(`\n📦 Committing snapshot: ${msg}`);
runLive("git add -A");
runLive(`git commit -m "${msg}"`);

console.log("🚀 Pushing to origin/main…");
runLive("git push origin main");

console.log("\n✅ Done! Your Lovable-connected repo is now up to date.");
console.log("   Lovable will pick up the changes automatically on next open.");
