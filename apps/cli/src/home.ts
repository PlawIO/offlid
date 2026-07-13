import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access, realpath, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";

export interface SurfacePaths {
  home: string | null;
  companion: string | null;
  nvim: string | null;
  ghostty: string | null;
}

export interface DoctorCheck {
  id: "node" | "platform" | "home" | "nvim" | "ghostty" | "companion";
  label: string;
  status: "ready" | "missing" | "unsupported";
  required: boolean;
  detail: string;
}

export interface DoctorReport {
  ready: boolean;
  checks: DoctorCheck[];
}

async function executable(path: string | undefined): Promise<string | null> {
  if (!path) return null;
  try {
    await access(path, constants.X_OK);
    const metadata = await stat(path);
    return metadata.isFile() ? await realpath(path) : null;
  } catch {
    return null;
  }
}

async function directory(path: string): Promise<string | null> {
  try {
    return (await stat(path)).isDirectory() ? await realpath(path) : null;
  } catch {
    return null;
  }
}

function pathCandidates(name: string, env: NodeJS.ProcessEnv): string[] {
  return (env.PATH ?? "")
    .split(delimiter)
    .filter(Boolean)
    .map((entry) => join(entry, name));
}

async function firstExecutable(candidates: Array<string | undefined>): Promise<string | null> {
  const seen = new Set<string>();
  for (const candidate of candidates) {
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    const resolved = await executable(candidate);
    if (resolved) return resolved;
  }
  return null;
}

export async function resolveSurfaces(
  env: NodeJS.ProcessEnv = process.env,
  homeDirectory = homedir(),
  currentEntry = process.argv[1],
): Promise<SurfacePaths> {
  const home = await firstExecutable([
    env.OFFLID_HOME_BIN,
    join(homeDirectory, ".local", "bin", "home"),
  ]);
  const current = await executable(currentEntry);
  const companionCandidate = await firstExecutable([
    env.OFFLID_COMPANION_BIN,
    join(homeDirectory, ".local", "bin", "offlid"),
  ]);
  const companion =
    companionCandidate && companionCandidate !== current ? companionCandidate : null;
  const nvim = await firstExecutable(pathCandidates("nvim", env));
  const ghostty =
    (await firstExecutable([env.OFFLID_GHOSTTY_BIN, ...pathCandidates("ghostty", env)])) ??
    (await directory("/Applications/Ghostty.app"));
  return { home, companion, nvim, ghostty };
}

export async function doctor(
  env: NodeJS.ProcessEnv = process.env,
  options: { homeDirectory?: string; platform?: NodeJS.Platform; nodeVersion?: string } = {},
): Promise<DoctorReport> {
  const platform = options.platform ?? process.platform;
  const nodeVersion = options.nodeVersion ?? process.versions.node;
  const surfaces = await resolveSurfaces(env, options.homeDirectory ?? homedir());
  const nodeMajor = Number.parseInt(nodeVersion.split(".")[0] ?? "0", 10);
  const checks: DoctorCheck[] = [
    {
      id: "node",
      label: "Node.js",
      status: nodeMajor >= 18 ? "ready" : "unsupported",
      required: true,
      detail: nodeMajor >= 18 ? nodeVersion : `${nodeVersion}; version 18 or newer is required`,
    },
    {
      id: "platform",
      label: "macOS",
      status: platform === "darwin" ? "ready" : "unsupported",
      required: true,
      detail: platform === "darwin" ? "native Home surface" : `current platform is ${platform}`,
    },
    {
      id: "home",
      label: "Offlid Home",
      status: surfaces.home ? "ready" : "missing",
      required: true,
      detail: surfaces.home ?? "not installed for this user",
    },
    {
      id: "nvim",
      label: "Neovim",
      status: surfaces.nvim ? "ready" : "missing",
      required: true,
      detail: surfaces.nvim ?? "required by the Home surface",
    },
    {
      id: "ghostty",
      label: "Ghostty",
      status: surfaces.ghostty ? "ready" : "missing",
      required: false,
      detail: surfaces.ghostty ?? "recommended terminal",
    },
    {
      id: "companion",
      label: "Home CLI",
      status: surfaces.companion ? "ready" : "missing",
      required: false,
      detail: surfaces.companion ?? "installed with Offlid Home",
    },
  ];
  return {
    ready: checks.every((check) => !check.required || check.status === "ready"),
    checks,
  };
}

export async function run(binary: string, args: string[], env = process.env): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const child = spawn(binary, args, { env, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code !== null) resolve(code);
      else if (signal === "SIGINT") resolve(130);
      else if (signal === "SIGTERM") resolve(143);
      else resolve(1);
    });
  });
}
