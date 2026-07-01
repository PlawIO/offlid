/** Options for constructing a telemetry client. */
export interface TelemetryOptions {
  /** Master switch. When false, every method is a no-op. */
  enabled: boolean;
  /** PostHog project API key. Required only when enabled. */
  apiKey?: string;
  /** PostHog host. Defaults to the public cloud endpoint. */
  host?: string;
}

/** A coarse, non-sensitive usage event. */
export interface TelemetryEvent {
  /** Event name, e.g. "daemon_started". */
  name: string;
  /** Non-sensitive properties only. */
  props?: Record<string, string | number | boolean>;
}

/**
 * Opt-in telemetry client. Constructed disabled by default; when disabled it
 * initializes no PostHog client and drops every event.
 */
export class Telemetry {
  private readonly enabled: boolean;

  constructor(opts: TelemetryOptions) {
    this.enabled = opts.enabled && Boolean(opts.apiKey);
    // TODO: initialize the PostHog client only when this.enabled is true.
  }

  /** Capture an event. No-op when telemetry is disabled. */
  capture(_event: TelemetryEvent): void {
    if (!this.enabled) return;
    // TODO: forward to PostHog capture().
  }

  /** Flush and shut down. No-op when disabled. */
  async shutdown(): Promise<void> {
    if (!this.enabled) return;
    // TODO: flush the PostHog client.
  }
}
