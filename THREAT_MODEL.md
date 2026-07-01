# Threat Model

This is a short, public-facing threat model for the offlid client. It describes
what the on-laptop components touch and the trust boundaries between them.

## What the daemon touches

- **Keychain credentials.** With BYO-API-key, the daemon reads provider API keys
  from the macOS Keychain. Keys are never written to disk in plaintext.
- **Source tree.** The daemon watches the working directory to build capture
  manifests (git state, uncommitted and untracked files, cwd, environment).
- **Agent process.** The daemon supervises the coding-agent process and captures
  its live transcript.

## Trust boundaries

1. **Laptop ↔ user.** The daemon runs as the local user via launchd. It has the
   user's filesystem and Keychain access, nothing more.
2. **Laptop ↔ cloud gateway.** All transport to the cloud crosses a TLS
   boundary. The client authenticates to the gateway; the gateway is operated by
   the commercial service and is out of scope for this repo.
3. **Client ↔ approvals.** Approval prompts are rendered as `veto://` deep links.
   The client carries **no policy logic** — it only renders the link.

## Credential handling

- API keys are read from Keychain, **envelope-encrypted** locally, and
  **injected ephemerally** into the agent process environment. The plaintext key
  exists only for the lifetime of injection and is never persisted.
- Envelope encryption uses a data key wrapped by a key that never leaves the
  device Keychain.

## Redaction before transport

Before any capture manifest or transcript leaves the device, the redaction pass
(`apps/daemon/internal/redact`) strips known secret shapes — API keys, tokens,
private keys, `.env` values — so they are not transmitted to the cloud gateway.

## Out of scope

Server-side storage, the wire protocol, sync/merge, and approval policy live in
the commercial cloud service and are not covered here.
