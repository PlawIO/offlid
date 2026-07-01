# @offlid/config

Config loading and defaults for offlid. Resolves settings from (in order)
built-in defaults, `~/.offlid/config.json`, and `OFFLID_*` environment
variables. Shared by the CLI and adapters so they agree on a single source of
truth.
