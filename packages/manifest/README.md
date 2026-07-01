# @offlid/manifest

The **capture-manifest schema**: the shape of the metadata the daemon collects
for one session checkpoint: git state, the set of changed and untracked paths,
environment keys, cwd, and transcript reference.

> This package is the **schema only**. It is *not* the offlid wire protocol.
> How manifests are serialized, chunked, content-addressed, deduplicated, and
> synced is defined by the commercial cloud service and is intentionally not
> published here. This schema exists so adapters and the daemon agree on the
> field names and types they exchange locally.

The types are expressed as plain TypeScript interfaces with a zod-style shape,
so they can be validated at the edges without pulling a runtime dependency.
