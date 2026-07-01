import {
  type AdapterContext,
  type AgentAdapter,
  type LaunchSpec,
  defineAdapter,
} from "@offlid/adapter-sdk";
import type { TranscriptRef } from "@offlid/manifest";

/** Adapter for the Codex CLI. */
export const codexAdapter: AgentAdapter = defineAdapter({
  id: "codex",
  displayName: "Codex CLI",

  async detect(_ctx: AdapterContext): Promise<boolean> {
    // TODO: check that the `codex` binary is on PATH.
    return false;
  },

  async launchSpec(ctx: AdapterContext): Promise<LaunchSpec> {
    // TODO: build the real Codex invocation.
    return { argv: ["codex", ...ctx.args] };
  },

  async transcript(_ctx: AdapterContext): Promise<TranscriptRef> {
    // TODO: locate the active Codex session transcript.
    return { adapter: "codex", handle: "" };
  },
});

export default codexAdapter;
