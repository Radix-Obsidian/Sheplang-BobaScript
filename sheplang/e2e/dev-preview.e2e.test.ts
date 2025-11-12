import { spawn, SpawnOptions, execSync } from "node:child_process";
import http from "node:http";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(__dirname, "../packages/cli/dist/index.js");
const EXAMPLE = resolve(__dirname, "../examples/todo.shep");

function waitFor(url: string, timeoutMs = 15000): Promise<string> {
  const start = Date.now();
  return new Promise((resolveP, rejectP) => {
    const tick = () => {
      http.get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolveP(data));
      }).on("error", () => {
        if (Date.now() - start > timeoutMs) return rejectP(new Error("timeout"));
        setTimeout(tick, 250);
      });
    };
    tick();
  });
}

test("dev preview serves deterministic H1", async () => {
  // Ensure builds exist (idempotent in CI/local)
  execSync("pnpm -w -r build", { stdio: "inherit" });

  const opts: SpawnOptions = { stdio: "pipe", shell: false };
  const child = spawn(process.execPath, [CLI, "dev", EXAMPLE, "--port", "8787"], opts);

  let childOutput = "";
  child.stdout?.on("data", (d) => (childOutput += String(d)));
  child.stderr?.on("data", (d) => (childOutput += String(d)));

  try {
    const html = await waitFor("http://localhost:8787/", 15000);
    expect(html).toContain("<h1>");
    // Your verify.ps1 checks for "MyTodos"; keep the same contract here
    expect(html).toContain("<h1>MyTodos</h1>");
  } finally {
    // Best-effort shutdown
    try { child.kill(); } catch {}
  }
});
