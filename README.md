# offlid

**Your Mac goes Offlid. Your agent stays online.**

offlid keeps your coding agent running after you close your laptop. A small local daemon checkpoints the session in the background; when your Mac sleeps, the agent keeps working on a cloud runner; when you reopen, the work syncs back.

```bash
npx offlid
```

> Pre-launch. The client in this repo is open source. The cloud it connects to is a commercial service. More at [offlid.com](https://offlid.com).

## How it works

1. **Capture.** A local daemon (`offlidd`) records the session continuously: git HEAD and index, uncommitted and untracked files, environment, working directory, and the live agent transcript. Secrets are redacted before anything leaves your machine.
2. **Handoff.** When your Mac sleeps, the daemon hands the session to a cloud runner over the wire protocol, and your agent keeps running.
3. **Sync back.** When you reopen, the runner's work merges back into your local tree.

Capture runs continuously rather than firing once at lid close, because Apple Silicon does not let userspace reliably delay sleep. You bring your own API key: it is read from the macOS Keychain, encrypted locally, and injected only into the runner.

## Layout

| Path | What |
|------|------|
| `apps/cli` | the `npx offlid` launcher (TypeScript) |
| `apps/daemon` | `offlidd`, the macOS daemon (Go) |
| `packages/manifest` | the capture format the daemon produces |
| `packages/adapter-sdk`, `packages/adapters/*` | agent integrations (Claude Code, Codex) |
| `packages/approvals` | renders the Veto approval deep link |
| `packages/config`, `packages/telemetry` | config and opt-in telemetry |
| `docs/` | architecture and install notes |

## Open core

This repository holds everything that runs on your machine: the launcher, the daemon, the capture format, and the agent adapters. The checkpoint store, sync engine, orchestration, and the wire-protocol server run in offlid's commercial cloud and are not here. The client does nothing useful on its own; it needs the cloud.

The license is Apache-2.0 rather than source-available on purpose. The boundary is architectural, not legal: a fork gets a daemon that speaks a protocol with no server behind it. Approvals for risky actions are handled by [Veto](https://veto.so).

## Contributing

Sign your commits (`git commit -s`); we use the [DCO](CONTRIBUTING.md), not a CLA. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

The daemon touches your Keychain, source tree, and agent process; the [threat model](THREAT_MODEL.md) explains the trust boundaries. Report vulnerabilities per [SECURITY.md](SECURITY.md).

## License

[Apache-2.0](LICENSE).
