#!/usr/bin/env node
import { createRequire } from "node:module";
import { type DoctorReport, doctor, resolveSurfaces, run } from "./home.js";

const packageJson = createRequire(import.meta.url)("../package.json") as { version: string };

const help = `Offlid ${packageJson.version}

  offlid                         Open Home in the current workspace.
  offlid home [PATH]             Open Home in a workspace.
  offlid doctor [--json]         Check the local Home and Ghostty setup.
  offlid COMMAND [ARGS]          Use the installed Home CLI.
  offlid --version               Print this launcher's version.

The npx package is a small, inspectable launcher. It has no install hook and never
requests administrator access. Home and cloud access are installed through Offlid.`;

function write(value: string, stream: NodeJS.WriteStream = process.stdout): void {
  stream.write(value.endsWith("\n") ? value : `${value}\n`);
}

function doctorText(report: DoctorReport): string {
  const lines = ["Offlid", report.ready ? "Ready." : "Needs attention.", ""];
  for (const check of report.checks) {
    lines.push(`${check.status.padEnd(11)} ${check.label}: ${check.detail}`);
  }
  return lines.join("\n");
}

function missingHome(): number {
  write(
    [
      "Offlid Home is not installed for this user.",
      "The public npx package is a launcher, not a privileged installer.",
      "Run `npx offlid doctor` or visit https://offlid.com.",
    ].join("\n"),
    process.stderr,
  );
  return 1;
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  const command = argv[0];
  if (command === "--version" || command === "-v" || command === "version") {
    write(packageJson.version);
    return 0;
  }
  if (command === "--help" || command === "-h" || command === "help") {
    write(help);
    return 0;
  }
  if (command === "doctor") {
    const report = await doctor();
    if (argv.includes("--json")) write(JSON.stringify(report));
    else write(doctorText(report));
    return report.ready ? 0 : 1;
  }

  const surfaces = await resolveSurfaces();
  if (!command || command === "home" || command === "studio") {
    if (!surfaces.home) return missingHome();
    return await run(surfaces.home, command ? argv.slice(1) : [], process.env);
  }
  if (!surfaces.companion) return missingHome();
  return await run(surfaces.companion, argv, process.env);
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    write(`offlid: ${error instanceof Error ? error.message : String(error)}`, process.stderr);
    process.exitCode = 1;
  },
);
