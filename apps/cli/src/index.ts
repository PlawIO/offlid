#!/usr/bin/env node
import { spawn } from "node:child_process";
import { resolveDaemon } from "./resolve.js";
import { verifyBinary } from "./verify.js";
import { maybeNudge } from "./nudge.js";

/**
 * Entry point for `npx offlid`. Resolves the platform daemon, verifies it,
 * prints first-run onboarding, then hands off to the daemon process.
 */
export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  await maybeNudge();

  const resolved = await resolveDaemon();
  const ok = await verifyBinary(resolved);
  if (!ok) {
    process.stderr.write("offlid: daemon verification failed; refusing to run.\n");
    return 1;
  }

  // TODO: pass through config + adapter selection resolved from @offlid/config.
  const child = spawn(resolved.binaryPath, argv, { stdio: "inherit" });
  return await new Promise<number>((resolve) => {
    child.on("exit", (code) => resolve(code ?? 0));
  });
}

main().then(
  (code) => process.exit(code),
  (err) => {
    process.stderr.write(`offlid: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  },
);
