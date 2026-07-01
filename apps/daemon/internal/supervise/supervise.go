// Package supervise runs and monitors the coding-agent process, restarting it
// per policy and capturing its live transcript.
package supervise

import "context"

// Spec describes an agent process to supervise.
type Spec struct {
	// Argv is the command and arguments to launch.
	Argv []string
	// Env is the environment for the process, including ephemeral creds.
	Env []string
	// Dir is the working directory.
	Dir string
}

// Supervisor owns the lifecycle of one agent process.
type Supervisor struct {
	spec Spec
	// TODO: hold the running *exec.Cmd and transcript reader.
}

// New returns a Supervisor for the given process spec.
func New(spec Spec) *Supervisor {
	return &Supervisor{spec: spec}
}

// Run starts the agent and blocks until it exits or the context is canceled.
func (s *Supervisor) Run(ctx context.Context) error {
	// TODO: start the process with a pty, tee the transcript to capture,
	//       apply restart policy on unexpected exit.
	<-ctx.Done()
	return ctx.Err()
}
