# offlidd: the offlid daemon

`offlidd` is the always-on macOS daemon. It registers with launchd, watches the
working tree, listens for power-state transitions, supervises the coding-agent
process, and builds redacted capture manifests to hand to the cloud gateway.

## Build

```sh
go build ./cmd/offlidd
```

Output is not committed (`apps/daemon/bin/` is gitignored). Release builds are
code-signed and notarized by CI (see `.github/workflows/sign-notarize.yml`).

## Subsystems

| Package             | Responsibility                                         |
| ------------------- | ------------------------------------------------------ |
| `cmd/offlidd`       | process entry; wires subsystems together               |
| `internal/power`    | IOKit power-state hook (sleep/wake)                     |
| `internal/watch`    | FSEvents watch trigger on the source tree              |
| `internal/capture`  | build the capture manifest                             |
| `internal/creds`    | read Keychain creds, envelope-encrypt, inject ephemeral |
| `internal/supervise`| supervise the agent process                            |
| `internal/transport`| talk to the cloud gateway                              |
| `internal/redact`   | strip secrets before transport                         |

The checkpoint store, sync/merge, and orchestration are **not** here: they run
in the commercial cloud service. This daemon only captures and transports.
