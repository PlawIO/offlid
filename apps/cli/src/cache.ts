import { homedir } from "node:os";
import { join } from "node:path";

/** Root of the offlid on-disk cache: `~/.offlid`. */
export function cacheRoot(): string {
  return process.env.OFFLID_CACHE_DIR ?? join(homedir(), ".offlid");
}

/**
 * Absolute path for a cached artifact, namespaced by platform key so binaries
 * for different platforms never collide.
 */
export function cachePathFor(platformKey: string, name: string): string {
  return join(cacheRoot(), "bin", platformKey, name);
}

/** Ensure the cache directory tree exists. */
export async function ensureCache(): Promise<void> {
  // TODO: mkdir -p cacheRoot()/bin with mode 0700.
}
