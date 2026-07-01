// Package watch triggers captures from filesystem changes in the working tree
// using the macOS FSEvents API.
package watch

import "context"

// Event is a coalesced filesystem change under a watched root.
type Event struct {
	// Paths are the changed paths reported in this batch.
	Paths []string
}

// Watcher observes a source tree and emits coalesced change events.
type Watcher struct {
	root string
	// TODO: hold the FSEventStreamRef.
}

// NewWatcher returns a Watcher rooted at the given working directory.
func NewWatcher(root string) *Watcher {
	return &Watcher{root: root}
}

// Watch streams coalesced FSEvents batches until the context is canceled.
func (w *Watcher) Watch(ctx context.Context) (<-chan Event, error) {
	// TODO: FSEventStreamCreate on w.root with a small latency; forward batches.
	ch := make(chan Event)
	go func() {
		<-ctx.Done()
		close(ch)
	}()
	return ch, nil
}
