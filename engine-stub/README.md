# engine-stub

The checkpoint, sync, and orchestration engine runs in offlid's cloud, not on
your laptop. This directory is intentionally a stub — it exists so the repo
layout makes the boundary obvious. The client in this repo captures and
transports; the engine that stores, deduplicates, merges, and orchestrates
runner state is a separate commercial service.
