import { join } from "node:path";
import { cacheRoot } from "./cache.js";

/** Path to the sentinel file that marks onboarding as shown. */
function firstRunMarker(): string {
  return join(cacheRoot(), ".onboarded");
}

/**
 * Print a short first-run onboarding message the first time offlid runs on this
 * machine, then record a marker so it is not shown again.
 */
export async function maybeNudge(): Promise<void> {
  // TODO: return early if firstRunMarker() exists.

  process.stdout.write(
    [
      "",
      "  offlid: your Mac goes Offlid, your agent stays online.",
      "",
      "  Next steps:",
      "    1. Grant Keychain access when prompted (BYO API key).",
      "    2. Pick your agent adapter (codex, claude-code).",
      "    3. Telemetry is opt-in: off by default.",
      "",
      "  Docs: https://offlid.com/docs",
      "",
    ].join("\n"),
  );

  // TODO: write firstRunMarker() so this prints only once.
}
