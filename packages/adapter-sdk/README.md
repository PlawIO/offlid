# @offlid/adapter-sdk

The SDK for building **agent adapters**. An adapter teaches offlid how to launch
a specific coding agent, locate its live transcript, and describe how its
session maps onto a capture manifest.

Implement the `AgentAdapter` interface and register your package. First-party
adapters live under [`packages/adapters`](../adapters); the codex and
claude-code adapters are the reference implementations.
