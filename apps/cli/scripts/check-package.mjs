import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execute = promisify(execFile);
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));

for (const lifecycle of ["preinstall", "install", "postinstall"]) {
  assert.equal(
    packageJson.scripts?.[lifecycle],
    undefined,
    `${lifecycle} must not execute on users' machines`,
  );
}
assert.equal(packageJson.private, undefined, "the offlid launcher must remain publishable");
assert.equal(packageJson.license, "Apache-2.0");
assert.equal(packageJson.repository?.url, "git+https://github.com/PlawIO/offlid.git");
assert.deepEqual(packageJson.dependencies ?? {}, {}, "the npx launcher must be self-contained");
assert.deepEqual(
  packageJson.optionalDependencies ?? {},
  {},
  "unpublished platform packages must not leak into npm",
);
assert.equal(packageJson.publishConfig?.access, "public");
assert.equal(packageJson.publishConfig?.provenance, true);

const { stdout } = await execute("npm", ["pack", "--dry-run", "--ignore-scripts", "--json"], {
  cwd: packageRoot,
  maxBuffer: 1024 * 1024,
});
const [packed] = JSON.parse(stdout);
const actual = packed.files.map((entry) => entry.path).sort();
const expected = ["README.md", "dist/home.js", "dist/index.js", "package.json"];
assert.deepEqual(actual, expected, `unexpected npm payload:\n${actual.join("\n")}`);
assert.ok(
  packed.unpackedSize < 40_000,
  `launcher payload is unexpectedly large: ${packed.unpackedSize}`,
);

const entry = await readFile(resolve(packageRoot, "dist", "index.js"), "utf8");
assert.ok(entry.startsWith("#!/usr/bin/env node\n"), "the npm bin is missing its portable shebang");

process.stdout.write(
  `Package audit passed: ${packed.filename}, ${packed.unpackedSize} bytes unpacked.\n`,
);
