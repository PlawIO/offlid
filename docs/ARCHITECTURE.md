# Architecture

offlid has three parts. Only the first two live in this repository; the cloud
gateway and everything behind it are a separate commercial service.

```
        your Mac                          |        offlid cloud (commercial)
                                          |
  +-------------------+                   |
  |   npx offlid CLI  |                   |
  |  (apps/cli)       |                   |
  +---------+---------+                   |
            | discovers                   |
            v                             |
  +-------------------+      TLS          |     +---------------------+
  |   Offlid Home     +------------------->+---->+   cloud gateway     |
  |  private beta     |                   |     |  (not in this repo) |
  +---------+---------+                   |     +----------+----------+
            | opens agents                |                |
            v                             |                v
  +-------------------+                   |     checkpoint store, sync/
  |   coding agents   |                   |     merge, orchestration,
  |   and editors     |                   |     runner adapters, billing
  +-------------------+                   |

  offlidd daemon: pre-release ambient capture infrastructure
```

## Client (`apps/cli`)

`npx offlid` is the public, self-contained Home launcher. It discovers the user-space Home installation,
opens it in the chosen workspace, passes other commands to the installed Home CLI as exact argument arrays,
and reports local readiness. It has no install lifecycle hook or implicit download path. See
[`apps/cli/README.md`](../apps/cli/README.md).

## Daemon (`apps/daemon`)

`offlidd` is pre-release infrastructure. It will register with launchd and run always-on. It hooks IOKit power state
(lid close/open), watches the working tree via FSEvents, builds capture
manifests, reads and ephemerally injects Keychain credentials, supervises the
agent process, redacts secrets, and ships redacted manifests to the gateway.

## Cloud gateway (not in this repo)

The gateway terminates the client connection and hands off to the checkpoint
store, sync/merge engine, and runner orchestration. The wire protocol, storage,
merge algorithm, and orchestration are part of the commercial service and are
intentionally not published here. The client is inert without it: by design.

## Trust boundary

The dashed TLS line is the trust boundary. Everything left of it runs as the
local user on the developer's machine. Secrets are redacted **before** they
cross that line. Approvals are surfaced as `veto://` deep links and carry no
policy logic on the client. See [THREAT_MODEL.md](../THREAT_MODEL.md).
