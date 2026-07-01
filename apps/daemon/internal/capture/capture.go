// Package capture builds a capture manifest describing the current agent
// session: git state, working-tree changes, environment, and cwd. The manifest
// schema mirrors @offlid/manifest; this package fills it in on macOS.
package capture

import "context"

// Manifest is the on-device capture manifest handed to redaction and transport.
// It is the schema only — it carries no file contents, just what to capture.
type Manifest struct {
	// Cwd is the agent's working directory.
	Cwd string
	// GitHead is the resolved HEAD commit, if the tree is a git repo.
	GitHead string
	// Dirty lists paths with uncommitted or untracked changes.
	Dirty []string
	// Env is the captured environment (post-redaction before transport).
	Env map[string]string
}

// Builder assembles manifests for a working tree.
type Builder struct {
	root string
}

// NewBuilder returns a Builder rooted at the agent working directory.
func NewBuilder(root string) *Builder {
	return &Builder{root: root}
}

// Build snapshots the current session state into a Manifest.
func (b *Builder) Build(ctx context.Context) (*Manifest, error) {
	// TODO: read git HEAD/index, diff for dirty + untracked paths, capture env.
	return &Manifest{Cwd: b.root, Env: map[string]string{}}, nil
}
