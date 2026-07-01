// Command offlidd is the offlid daemon. It registers with launchd and wires
// together the power, watch, capture, creds, supervise, transport, and redact
// subsystems that keep a coding-agent session checkpointed and synced.
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	if err := run(ctx); err != nil {
		log.Printf("offlidd: %v", err)
		os.Exit(1)
	}
}

// run boots the daemon subsystems and blocks until the context is canceled.
func run(ctx context.Context) error {
	// TODO: load config; register launchd job on first run.
	// TODO: start internal/power hook, internal/watch trigger.
	// TODO: on capture events, build a manifest (internal/capture),
	//       redact it (internal/redact), and ship it (internal/transport).
	// TODO: supervise the agent process (internal/supervise) and inject
	//       ephemeral creds (internal/creds).
	<-ctx.Done()
	return nil
}
