import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const res = spawnSync("python", ["scripts/build_static_bundle.py"], {
  cwd: rootDir,
  stdio: "inherit",
});

if (res.status !== 0) {
  process.exit(res.status || 1);
}
