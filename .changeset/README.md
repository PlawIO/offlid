# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).

Add a changeset for any user-facing change:

```sh
pnpm changeset
```

Pick the affected packages and a semver bump (patch/minor/major), then write a
short summary. The changeset is committed with your PR; release automation
consumes it to version packages and generate changelogs.

See the [common questions](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)
for more.
