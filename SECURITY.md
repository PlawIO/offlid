# Security Policy

## Reporting a vulnerability

Please report security issues privately to **security@veto.so**. Do not open a
public issue for anything security-sensitive.

Include a description of the issue, affected version, reproduction steps, and any
proof-of-concept. We aim to acknowledge reports within 3 business days and will
keep you updated as we investigate.

## Supported versions

We support the latest released minor version of the `offlid` launcher and the
`offlidd` daemon. Security fixes are backported to the previous minor version on
a best-effort basis.

| Version | Supported |
| ------- | --------- |
| latest  | yes       |
| latest-1| best effort |
| older   | no        |

## Release integrity

- The macOS daemon (`offlidd`) is **code-signed and notarized** by Apple.
- Every release artifact ships with a **SHA-256 checksum** and a **cosign
  signature**. The `npx offlid` launcher verifies both before executing a
  downloaded binary (see `apps/cli/src/verify.ts`).
- Downloaded binaries are cached under `~/.offlid` and re-verified on each run.

If verification fails, the launcher refuses to run the binary.
