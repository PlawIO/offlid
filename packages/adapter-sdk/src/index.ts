import type { CaptureManifest, TranscriptRef } from "@offlid/manifest";

/** How to launch the underlying agent process. */
export interface LaunchSpec {
  /** Command and arguments to spawn. */
  argv: string[];
  /** Extra environment for the process. */
  env?: Record<string, string>;
}

/** Context passed to adapters for one supervised session. */
export interface AdapterContext {
  /** Working directory of the session. */
  cwd: string;
  /** User arguments forwarded from the CLI. */
  args: string[];
}

/**
 * An AgentAdapter teaches offlid how to run one coding agent and how to surface
 * its transcript for capture. Adapters carry no transport or policy logic.
 */
export interface AgentAdapter {
  /** Stable adapter id, e.g. "codex" or "claude-code". */
  readonly id: string;
  /** Human-readable display name. */
  readonly displayName: string;

  /** Return true if this adapter can handle the given context. */
  detect(ctx: AdapterContext): Promise<boolean>;

  /** Produce the launch spec for the agent process. */
  launchSpec(ctx: AdapterContext): Promise<LaunchSpec>;

  /** Return a reference to the live transcript for capture. */
  transcript(ctx: AdapterContext): Promise<TranscriptRef>;

  /**
   * Optionally contribute adapter-specific fields to a capture manifest.
   * Returns a partial manifest merged by the daemon.
   */
  annotate?(ctx: AdapterContext): Promise<Partial<CaptureManifest>>;
}

/** Helper to define an adapter with inferred types. */
export function defineAdapter(adapter: AgentAdapter): AgentAdapter {
  return adapter;
}
