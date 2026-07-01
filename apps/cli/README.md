# offlid (CLI)

The `npx offlid` launcher. Published to npm as the unscoped package **`offlid`**.

```sh
npx offlid
```

## What it does

1. **Resolve** the daemon binary for the current platform (`src/resolve.ts`).
   Platform builds ship as `optionalDependencies`
   (`@offlid/daemon-darwin-arm64`, `-darwin-x64`, `-linux-x64`, `-linux-arm64`),
   resolved by `os`/`cpu` the way esbuild does. If no optional dependency is
   installed, the launcher downloads the binary from the release CDN (R2).
2. **Verify** the binary (`src/verify.ts`): SHA-256 checksum plus a cosign
   signature. A binary that fails verification is never executed.
3. **Cache** verified binaries under `~/.offlid` (`src/cache.ts`).
4. **Nudge** first-run users through onboarding (`src/nudge.ts`).
5. **Launch** the daemon (`src/index.ts`).

## Layout

| File            | Responsibility                                      |
| --------------- | --------------------------------------------------- |
| `src/index.ts`  | entry point; wires resolve → verify → launch        |
| `src/resolve.ts`| platform resolution + CDN fallback                  |
| `src/verify.ts` | SHA-256 + cosign verification                       |
| `src/cache.ts`  | `~/.offlid` cache management                         |
| `src/nudge.ts`  | first-run onboarding output                         |

The daemon itself lives in [`apps/daemon`](../daemon).
