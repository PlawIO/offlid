import { cachePathFor } from "./cache.js";

/** A resolved daemon binary ready to be verified and launched. */
export interface ResolvedDaemon {
  /** Absolute path to the daemon binary on disk. */
  binaryPath: string;
  /** npm package the binary came from, or "cdn" when downloaded. */
  source: string;
  /** Release version string, e.g. "0.1.0". */
  version: string;
}

/** Supported platform keys, mapped to their daemon package names. */
const DAEMON_PACKAGES: Record<string, string> = {
  "darwin-arm64": "@offlid/daemon-darwin-arm64",
  "darwin-x64": "@offlid/daemon-darwin-x64",
  "linux-x64": "@offlid/daemon-linux-x64",
  "linux-arm64": "@offlid/daemon-linux-arm64",
};

/** Compute the `${os}-${cpu}` key for the current process. */
export function platformKey(): string {
  return `${process.platform}-${process.arch}`;
}

/**
 * Resolve the daemon binary for the current platform. Prefers the matching
 * optionalDependency (esbuild-style os/cpu resolution); falls back to a signed
 * download from the release CDN (R2) into `~/.offlid`.
 */
export async function resolveDaemon(): Promise<ResolvedDaemon> {
  const key = platformKey();
  const pkg = DAEMON_PACKAGES[key];
  if (!pkg) {
    throw new Error(`unsupported platform: ${key}`);
  }

  // TODO: attempt `require.resolve(`${pkg}/bin/offlidd`)` first and return it
  // when the optionalDependency is installed.

  // TODO: on miss, download from the R2 release bucket into cachePathFor(...)
  // and return that path. The download is always verified by verifyBinary.
  const binaryPath = cachePathFor(key, "offlidd");
  return { binaryPath, source: "cdn", version: "0.0.0" };
}
