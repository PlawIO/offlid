# offlid

**Your Mac goes Offlid. Your agent stays online.**

offlid keeps the thread when you leave. Home is a compact operating surface for local workspaces,
cloud continuation, native coding agents, proof, return, and rewind.

```bash
npx offlid
```

The npm launcher is ready for private-beta Home installations. It has no install hook, does not request
administrator access, and never downloads or executes a daemon implicitly. Home enrollment remains private
beta. More at [offlid.com](https://offlid.com).

## Product contract

1. **Keep the thread.** Home understands the workspace, current commitment, boundaries, and proof.
2. **Continue safely.** Explicitly sealed work can continue on an isolated cloud runner while the Mac sleeps.
3. **Return with proof.** Home presents the verified diff, evidence, preview, unresolved risk, and rewind.

The Go daemon in this repository is pre-release infrastructure for ambient capture. The current public npm
package launches an already installed Home and fails clearly when Home is absent. It does not pretend the
unfinished daemon distribution path works.

## Layout

| Path | What |
|------|------|
| `apps/cli` | the self-contained `npx offlid` Home launcher (TypeScript) |
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
