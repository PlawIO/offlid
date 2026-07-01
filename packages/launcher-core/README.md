# @offlid/launcher-core

Shared logic used by the `offlid` CLI: platform detection, release channel
resolution, and the common launch state machine. Kept separate from the CLI
entry point so it can be unit-tested in isolation and reused by other launchers.
