import {
  type AdapterContext,
  type AgentAdapter,
  type LaunchSpec,
  defineAdapter,
} from "@offlid/adapter-sdk";
import type { TranscriptRef } from "@offlid/manifest";

/** Adapter for the Claude Code CLI. */
export const claudeCodeAdapter: AgentAdapter = defineAdapter({
  id: "claude-code",
  displayName: "Claude Code CLI",

  async detect(_ctx: AdapterContext): Promise<boolean> {
    // TODO: check that the `claude` binary is on PATH.
    return false;
  },

  async launchSpec(ctx: AdapterContext): Promise<LaunchSpec> {
    // TODO: build the real Claude Code invocation.
    return { argv: ["claude", ...ctx.args] };
  },

  async transcript(_ctx: AdapterContext): Promise<TranscriptRef> {
    // TODO: locate the active session transcript.
    return { adapter: "claude-code", handle: "" };
  },
});

export default claudeCodeAdapter;
