/**
 * The offlid capture-manifest schema.
 *
 * This describes WHAT a single session checkpoint captures — not how it is
 * transported, stored, or merged. Those belong to the commercial cloud service.
 */

/** Manifest schema version. Bump on any breaking field change. */
export const MANIFEST_VERSION = 1 as const;

/** Git state at capture time. Absent when the tree is not a git repository. */
export interface GitState {
  /** Resolved HEAD commit SHA. */
  head: string;
  /** Current branch, or null when detached. */
  branch: string | null;
  /** Whether the index or working tree has uncommitted changes. */
  dirty: boolean;
}

/** A single changed path in the working tree. */
export interface ChangedPath {
  /** Path relative to the capture root. */
  path: string;
  /** Change kind. */
  status: "modified" | "added" | "deleted" | "untracked";
}

/** Reference to the captured agent transcript (content lives out of band). */
export interface TranscriptRef {
  /** Adapter id that produced the transcript (e.g. "codex"). */
  adapter: string;
  /** Opaque handle the daemon uses to locate the transcript stream. */
  handle: string;
}

/** A complete capture manifest for one checkpoint. */
export interface CaptureManifest {
  /** Schema version; equals MANIFEST_VERSION. */
  version: typeof MANIFEST_VERSION;
  /** RFC 3339 capture timestamp. */
  capturedAt: string;
  /** Absolute working directory of the session. */
  cwd: string;
  /** Git state, when applicable. */
  git: GitState | null;
  /** Changed and untracked paths under cwd (post-redaction). */
  changed: ChangedPath[];
  /** Environment variable keys present at capture time (values redacted). */
  envKeys: string[];
  /** Reference to the live agent transcript. */
  transcript: TranscriptRef | null;
}

/**
 * Zod-style shape describing the manifest without a runtime dependency. Each
 * field maps to its expected JavaScript type for lightweight edge validation.
 */
export const captureManifestShape = {
  version: "number",
  capturedAt: "string",
  cwd: "string",
  git: "object|null",
  changed: "array",
  envKeys: "array",
  transcript: "object|null",
} as const;
