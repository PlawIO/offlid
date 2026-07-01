# offlid

**Your Mac goes Offlid. Your agent stays online.**

offlid is a macOS dev tool. A local daemon takes always-on background
checkpoints of your coding-agent session — git HEAD/index, uncommitted and
untracked files, environment, working directory, and the live agent transcript.
When you close your laptop lid and it sleeps, your coding agent keeps running on
a cloud runner. When you reopen, it syncs back.

> Status: **pre-launch.**

## Quickstart

```sh
npx offlid
```

The launcher resolves the signed daemon for your platform, verifies it, and
walks you through first-run setup (Keychain access, agent adapter selection,
opt-in telemetry).

## Open client, commercial cloud

This repository is the **open** half of offlid, licensed Apache-2.0. It contains
the `npx offlid` launcher, the Go daemon, the agent adapters, the capture
manifest schema, and the client-side pieces that run on your laptop.

The checkpoint store, sync/merge engine, cloud orchestration, and runner
adapters are a **separate commercial service** operated by PlawIO. The client is
intentionally inert without it — that separation is by design. Approvals shown
by the client are **Powered by Veto** ([veto.so](https://veto.so)).

## Repo layout

```
apps/
  cli/            npx offlid launcher (TypeScript)
  daemon/         offlidd — the Go daemon
packages/
  launcher-core/  shared launcher logic
  manifest/       capture-manifest schema (schema only)
  adapter-sdk/    AgentAdapter interface + SDK
  adapters/       first-party agent adapters (codex, claude-code)
  config/         config loading + defaults
  telemetry/      opt-in client telemetry
  approvals/      approval-relay client (deep link render only)
engine-stub/      placeholder; the engine runs in offlid's cloud
docs/             architecture + install docs
```

## Links

- Product: [offlid.com](https://offlid.com)
- Approvals: [veto.so](https://veto.so)

## License

Apache-2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
