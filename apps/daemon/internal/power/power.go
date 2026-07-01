// Package power hooks macOS power-state transitions via IOKit so the daemon can
// react when the lid closes (sleep) or reopens (wake).
package power

import "context"

// State is a coarse power-state transition reported by the IOKit hook.
type State int

const (
	// Wake indicates the system is resuming from sleep.
	Wake State = iota
	// WillSleep indicates the system is about to sleep (lid closing).
	WillSleep
)

// Monitor delivers power-state transitions until the context is canceled.
type Monitor struct {
	// TODO: hold the IOKit root power-domain port and notifier refs.
}

// NewMonitor constructs a power Monitor bound to the IOKit power root domain.
func NewMonitor() *Monitor {
	return &Monitor{}
}

// Notify streams power-state transitions on the returned channel. It registers
// for IOKit system power notifications and unregisters when ctx is canceled.
func (m *Monitor) Notify(ctx context.Context) (<-chan State, error) {
	// TODO: IORegisterForSystemPower + run loop source; emit WillSleep/Wake.
	ch := make(chan State)
	go func() {
		<-ctx.Done()
		close(ch)
	}()
	return ch, nil
}
