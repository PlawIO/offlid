# Contributing to offlid

Thanks for your interest in offlid. Contributions are welcome.

## Developer Certificate of Origin (DCO)

We use the [DCO](https://developercertificate.org/), not a CLA. Every commit
must be signed off, certifying you have the right to submit it under the
project's license:

```sh
git commit -s -m "your message"
```

The `-s` flag appends a `Signed-off-by` trailer with your name and email. Pull
requests with unsigned commits will be asked to amend.

## Building

Requirements: Node >= 18, pnpm 9, Go 1.22 (for the daemon).

```sh
pnpm install
pnpm build        # turbo run build across all packages
pnpm lint         # biome
pnpm typecheck
pnpm test
```

The Go daemon builds separately:

```sh
cd apps/daemon
go build ./...
```

## Pull request expectations

- One logical change per PR; keep diffs focused.
- Add a changeset for any user-facing change: `pnpm changeset`.
- Run `pnpm lint && pnpm typecheck && pnpm test` before pushing.
- Follow the open/closed boundary in [CLAUDE.md](./CLAUDE.md): never contribute
  anything that belongs in the commercial cloud repo.
- Be excellent to each other: see [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Reporting bugs

Open an issue with clear reproduction steps. For security issues, follow
[SECURITY.md](./SECURITY.md) instead of filing a public issue.
