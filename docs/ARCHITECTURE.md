# Architecture

offlid has three parts. Only the first two live in this repository; the cloud
gateway and everything behind it are a separate commercial service.

```
        your Mac                          |        offlid cloud (commercial)
                                          |
  +-------------------+                   |
  |   npx offlid CLI  |  resolve+verify   |
  |  (apps/cli)       |  the daemon       |
  +---------+---------+                   |
            | launches                    |
            v                             |
  +-------------------+   redacted        |     +---------------------+
  |  offlidd daemon   |   manifests       |     |   cloud gateway     |
  |  (apps/daemon)    +-------- TLS ------>+---->+  (not in this repo) |
  |                   |                   |     +----------+----------+
  |  power  watch     |                   |                |
  |  capture creds    |                   |                v
  |  supervise redact |                   |     checkpoint store, sync/
  +---------+---------+                   |     merge, orchestration,
            | supervises                  |     runner adapters, billing
            v                             |
  +-------------------+                   |
  |   coding agent    |                   |
  |   (via adapter)   |                   |
  +-------------------+                   |
```

## Client (`apps/cli`)

`npx offlid` resolves the signed daemon for the platform, verifies it (SHA-256 +
cosign), and launches it. See [`apps/cli/README.md`](../apps/cli/README.md).

## Daemon (`apps/daemon`)

`offlidd` registers with launchd and runs always-on. It hooks IOKit power state
(lid close/open), watches the working tree via FSEvents, builds capture
manifests, reads and ephemerally injects Keychain credentials, supervises the
agent process, redacts secrets, and ships redacted manifests to the gateway.

## Cloud gateway (not in this repo)

The gateway terminates the client connection and hands off to the checkpoint
store, sync/merge engine, and runner orchestration. The wire protocol, storage,
merge algorithm, and orchestration are part of the commercial service and are
intentionally not published here. The client is inert without it — by design.

## Trust boundary

The dashed TLS line is the trust boundary. Everything left of it runs as the
local user on the developer's machine. Secrets are redacted **before** they
cross that line. Approvals are surfaced as `veto://` deep links and carry no
policy logic on the client. See [THREAT_MODEL.md](../THREAT_MODEL.md).
