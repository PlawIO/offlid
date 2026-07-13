import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chmod, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { doctor, resolveSurfaces } from "./home.js";

const cli = join(dirname(fileURLToPath(import.meta.url)), "index.js");
const packageVersion = (createRequire(import.meta.url)("../package.json") as { version: string })
  .version;

interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

async function runCli(args: string[], env: NodeJS.ProcessEnv): Promise<CliResult> {
  return await new Promise<CliResult>((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { env, stdio: "pipe" });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (value: string) => {
      stdout += value;
    });
    child.stderr.on("data", (value: string) => {
      stderr += value;
    });
    child.once("error", reject);
    child.once("exit", (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

async function fakeExecutable(path: string): Promise<void> {
  await writeFile(path, ["#!/bin/sh", 'printf "%s\\n" "$@" > "$OFFLID_TEST_LOG"', ""].join("\n"));
  await chmod(path, 0o755);
}

test("surface discovery accepts explicit executables and ignores the current launcher", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "offlid-surface-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const home = join(root, "home");
  const companion = join(root, "offlid");
  await Promise.all([fakeExecutable(home), fakeExecutable(companion)]);
  const surfaces = await resolveSurfaces(
    { OFFLID_HOME_BIN: home, OFFLID_COMPANION_BIN: companion, PATH: "" },
    root,
    companion,
  );
  assert.equal(surfaces.home, await realpath(home));
  assert.equal(surfaces.companion, null);
});

test("the packed entry opens Home and preserves the selected workspace", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "offlid-home-launch-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const bin = join(root, "bin");
  const home = join(bin, "home");
  const workspace = join(root, "product");
  const log = join(root, "home.log");
  await Promise.all([mkdir(bin, { recursive: true }), mkdir(workspace, { recursive: true })]);
  await fakeExecutable(home);
  const result = await runCli(["home", workspace], {
    ...process.env,
    HOME: root,
    PATH: bin,
    OFFLID_HOME_BIN: home,
    OFFLID_TEST_LOG: log,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await readFile(log, "utf8")).trim(), workspace);
});

test("unknown commands pass to the installed Home CLI without shell interpolation", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "offlid-command-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const companion = join(root, "offlid-home-cli");
  const log = join(root, "command.log");
  await fakeExecutable(companion);
  const result = await runCli(["threads", "value with spaces", "$(touch nope)"], {
    ...process.env,
    HOME: root,
    PATH: "",
    OFFLID_COMPANION_BIN: companion,
    OFFLID_TEST_LOG: log,
  });
  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual((await readFile(log, "utf8")).trim().split("\n"), [
    "threads",
    "value with spaces",
    "$(touch nope)",
  ]);
});

test("doctor reports exact readiness without changing the machine", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "offlid-doctor-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const home = join(root, "home");
  const nvim = join(root, "nvim");
  await Promise.all([fakeExecutable(home), fakeExecutable(nvim)]);
  const report = await doctor(
    { OFFLID_HOME_BIN: home, HOME: root, PATH: root },
    { homeDirectory: root, nodeVersion: "20.19.0", platform: "darwin" },
  );
  assert.equal(report.ready, true);
  assert.equal(report.checks.find((check) => check.id === "home")?.status, "ready");
  assert.equal(report.checks.find((check) => check.id === "ghostty")?.required, false);
});

test("missing Home fails clearly instead of pretending the placeholder works", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "offlid-missing-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const result = await runCli([], { HOME: root, PATH: "" });
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Home is not installed/);
  assert.match(result.stderr, /not a privileged installer/);
  assert.doesNotMatch(result.stderr, /stack|ENOENT/);
});

test("a generic home executable on PATH is never trusted", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "offlid-path-home-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const bin = join(root, "bin");
  const untrustedHome = join(bin, "home");
  const log = join(root, "path-home.log");
  await mkdir(bin);
  await fakeExecutable(untrustedHome);
  const result = await runCli([], {
    HOME: root,
    PATH: bin,
    OFFLID_TEST_LOG: log,
  });
  assert.equal(result.code, 1);
  await assert.rejects(readFile(log), { code: "ENOENT" });
});

test("version comes from the package installed by npx", async () => {
  const result = await runCli(["--version"], process.env);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout.trim(), packageVersion);
});
