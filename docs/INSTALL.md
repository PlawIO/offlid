# Install

> Status: pre-launch. Interfaces may change.

## Requirements

- macOS (Apple Silicon or Intel)
- Node.js >= 18 (for `npx`)
- A supported coding agent on PATH (see the adapters under `packages/adapters`)

## Run

```sh
npx offlid
```

On first run the launcher will:

1. Resolve the daemon build for your platform. Platform binaries ship as
   optional dependencies; if none is present, the launcher downloads a signed
   build from the release CDN.
2. Verify the binary (SHA-256 + cosign). A binary that fails verification is
   never executed.
3. Cache the verified binary under `~/.offlid`.
4. Walk you through onboarding: Keychain access for BYO API keys, adapter
   selection, and the opt-in telemetry choice (off by default).

## Bring your own API key

offlid reads provider API keys from the macOS Keychain, envelope-encrypts them
locally, and injects them ephemerally into the agent process. Keys are never
written to disk in plaintext. See [THREAT_MODEL.md](../THREAT_MODEL.md).

## Uninstall

Remove the launchd job and delete `~/.offlid`. A managed uninstall command will
land before general availability.
