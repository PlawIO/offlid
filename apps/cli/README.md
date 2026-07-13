# offlid

The small public launcher for Offlid Home.

```sh
npx offlid
```

It opens the installed Home surface in the current workspace. Home is where unfinished work lives:
local and cloud workspaces, durable Threads, native agent CLIs, proof, return, and rewind.

## Commands

```sh
npx offlid                    # open Home here
npx offlid home ~/Repos/app   # open a specific workspace
npx offlid doctor             # inspect local readiness
npx offlid --version
```

Commands not owned by the launcher pass through as exact argument arrays to the user-installed Home CLI.
There is no shell interpolation.

## Trust contract

The npm package is deliberately boring:

- no `preinstall`, `install`, or `postinstall` hook;
- no administrator prompt;
- no credential collection or copying;
- no dependency graph or unpublished optional package;
- no hidden daemon download;
- an explicit file allowlist audited in CI;
- npm provenance enabled for releases.

The launcher only discovers Home at Offlid's user-space install path or through an explicit
`OFFLID_HOME_BIN` override. It never executes a generic `home` command found on `PATH`. Missing Home produces
a short diagnostic and the Offlid enrollment route rather than turning a placeholder into fake success.

The open package does not contain Offlid's proprietary protocol, cloud runner, orchestration, policy, or
metering implementation. Those stay behind the commercial cloud boundary.

## Development

From the public monorepo root:

```sh
pnpm install
pnpm --filter offlid build
pnpm --filter offlid test
pnpm --filter offlid pack:check
```

The package test creates an npm tarball, installs it offline with lifecycle scripts disabled, launches a
fake Home executable, and verifies the exact published file set.
