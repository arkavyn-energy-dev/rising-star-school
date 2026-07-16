/**
 * Frees a TCP port on Windows before starting the dev server.
 * Usage: node scripts/killPort.js 5000
 */
const { execSync } = require("child_process");

const port = process.argv[2] || "5000";

try {
  const out = execSync(`netstat -ano | findstr ":${port}"`, { encoding: "utf8" });
  const pids = [
    ...new Set(
      out
        .split("\n")
        .map((line) => line.trim().split(/\s+/).pop())
        .filter((pid) => pid && /^\d+$/.test(pid))
    ),
  ];

  if (pids.length === 0) {
    console.log(`Port ${port} is already free.`);
    process.exit(0);
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      console.log(`Stopped process ${pid} on port ${port}`);
    } catch {
      // Process may have already exited.
    }
  }
} catch {
  console.log(`Port ${port} is already free.`);
}
