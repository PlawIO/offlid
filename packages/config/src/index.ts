/** Resolved offlid configuration. */
export interface OfflidConfig {
  /** Selected agent adapter id, e.g. "codex". */
  adapter: string | null;
  /** Cloud gateway endpoint, or null when unset. */
  gateway: string | null;
  /** Whether opt-in telemetry is enabled. Defaults to false. */
  telemetry: boolean;
}

/** Built-in defaults applied before any file or env overrides. */
export const defaultConfig: OfflidConfig = {
  adapter: null,
  gateway: null,
  telemetry: false,
};

/**
 * Load config by layering defaults, `~/.offlid/config.json`, then `OFFLID_*`
 * environment variables.
 */
export async function loadConfig(): Promise<OfflidConfig> {
  // TODO: read ~/.offlid/config.json when present and merge over defaults.
  // TODO: apply OFFLID_ADAPTER / OFFLID_GATEWAY / OFFLID_TELEMETRY overrides.
  return { ...defaultConfig };
}
