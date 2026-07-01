/** Release channels the launcher can pull daemon builds from. */
export type Channel = "stable" | "beta";

/** Resolved launch environment shared across launcher steps. */
export interface LaunchEnv {
  /** `${os}-${cpu}` platform key. */
  platform: string;
  /** Selected release channel. */
  channel: Channel;
}

/** Compute the platform key for the current process. */
export function platformKey(): string {
  return `${process.platform}-${process.arch}`;
}

/** Build the default launch environment. */
export function defaultLaunchEnv(): LaunchEnv {
  return { platform: platformKey(), channel: "stable" };
}
