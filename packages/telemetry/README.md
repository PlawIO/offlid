# @offlid/telemetry

**Opt-in** client-side telemetry (PostHog). Off by default.

Nothing is sent unless the user explicitly enables telemetry (via
`@offlid/config` or the `OFFLID_TELEMETRY` environment variable). When disabled,
every call in this package is a no-op and no client is initialized. Events are
limited to coarse, non-sensitive usage signals; source, credentials, and
transcript content are never included.
