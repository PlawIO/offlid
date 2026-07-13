import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execute = promisify(execFile);
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
const scratch = await mkdtemp(join(tmpdir(), "offlid-pack-"));

try {
  const packedResult = await execute(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", scratch],
    { cwd: packageRoot, maxBuffer: 1024 * 1024 },
  );
  const [packed] = JSON.parse(packedResult.stdout);
  const tarball = join(scratch, packed.filename);
  const installRoot = join(scratch, "install");
  await execute(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--offline",
      "--no-audit",
      "--no-fund",
      "--prefix",
      installRoot,
      tarball,
    ],
    { maxBuffer: 1024 * 1024 },
  );

  const binary = join(installRoot, "node_modules", ".bin", "offlid");
  const version = await execute(binary, ["--version"]);
  assert.equal(version.stdout.trim(), packageJson.version);

  const home = join(scratch, "home");
  const workspace = join(scratch, "workspace");
  const log = join(scratch, "home.log");
  await mkdir(workspace);
  await writeFile(home, ["#!/bin/sh", 'printf "%s\\n" "$@" > "$OFFLID_TEST_LOG"', ""].join("\n"));
  await chmod(home, 0o755);
  await execute(binary, ["home", workspace], {
    env: { ...process.env, HOME: scratch, OFFLID_HOME_BIN: home, OFFLID_TEST_LOG: log },
  });
  assert.equal((await readFile(log, "utf8")).trim(), workspace);
  process.stdout.write(`Packed install passed: ${packed.filename}.\n`);
} finally {
  await rm(scratch, { recursive: true, force: true });
}
