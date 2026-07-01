# Repo conventions

Conventions for contributors and agents working in this repository.

## Toolchain

- **Package manager:** pnpm 9 (`packageManager` is pinned in the root
  `package.json`). Do not use npm or yarn.
- **Monorepo build:** Turborepo (`turbo.json`) with `build`, `lint`, `test`, and
  `typecheck` pipelines. Prefer `pnpm build` / `pnpm lint` etc. at the root.
- **Language:** TypeScript-first. Every package extends `tsconfig.base.json`. The
  Go daemon under `apps/daemon` is the one documented exception.
- **Lint/format:** Biome (`biome.json`). No ESLint, no Prettier.
- **Versioning/release:** Changesets (`.changeset/`). Add a changeset for any
  user-facing change.
- **Workspaces:** `apps/*` and `packages/*` via `pnpm-workspace.yaml`.
- **Node:** engines `>=18`. TypeScript `~5.x`. Keep dependency versions as caret
  ranges.

## Open/closed boundary

This is the **open** half of offlid (Apache-2.0): the `npx offlid` launcher, the
Go daemon, agent adapters and the adapter SDK, the capture-manifest schema, the
BYO-API-key flow, opt-in telemetry, and an approval-relay client that only
renders a deep link. The checkpoint/dedup store, sync and merge engine, cloud
orchestration and runner adapters, the full wire protocol and server, billing,
and all approval policy live in the separate commercial `offlid-cloud` repo. The
client is intentionally inert without that service.

**Never commit anything that belongs in `offlid-cloud`.** No wire-protocol spec,
no server code, no policy logic, no business strategy in committed files. Keep
this repo clean, technical, and welcoming to outside contributors.
