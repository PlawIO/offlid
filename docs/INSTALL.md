# Install

> Status: private beta. The public npm package is a launcher, not an installer.

## Requirements

- macOS 13 or newer
- Node.js 18 or newer for `npx`
- Neovim
- Ghostty recommended
- an Offlid Home beta installation for the current user

## Open Home

```sh
npx offlid
npx offlid home ~/Repos/product
```

The launcher looks for Home at Offlid's current-user installation path. An explicit `OFFLID_HOME_BIN`
override supports development and managed installations. It never executes a generic `home` command from
`PATH`, runs a lifecycle install script, requests administrator access, copies credentials, or downloads an
unverified executable.

Check readiness without changing the machine:

```sh
npx offlid doctor
npx offlid doctor --json
```

If Home is absent, the launcher exits with one clear enrollment route. Private-beta installation is provided
through Offlid enrollment at [offlid.com](https://offlid.com). We do not document a fictional public installer.

## Trust and removal

The npm tarball contains two compiled JavaScript files, its README, and package metadata. CI audits that exact
allowlist, installs the tarball offline with lifecycle scripts disabled, and exercises the Home handoff.

Home is installed in user space under `~/.local/lib/offlid-home` with launchers in `~/.local/bin`. It does not
need a system-wide package or repeated administrator access. Managed removal will land before general
availability.
