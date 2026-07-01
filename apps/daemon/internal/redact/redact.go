// Package redact strips secrets from capture manifests and transcripts before
// anything leaves the device: API keys, tokens, private keys, and .env values.
package redact

import "github.com/PlawIO/offlid/apps/daemon/internal/capture"

// Placeholder substituted for any redacted value.
const Placeholder = "[REDACTED]"

// Redactor removes secret-shaped values from captured data.
type Redactor struct {
	// TODO: hold compiled secret-shape patterns and an allowlist.
}

// NewRedactor returns a Redactor with the default secret-shape patterns.
func NewRedactor() *Redactor {
	return &Redactor{}
}

// Manifest returns a copy of m with secret-shaped env values and dirty-path
// contents redacted. The original is not mutated.
func (r *Redactor) Manifest(m *capture.Manifest) *capture.Manifest {
	// TODO: match env values + known secret files against patterns; replace
	//       hits with Placeholder before the manifest is handed to transport.
	return m
}

// Line redacts secret-shaped substrings from a single transcript line.
func (r *Redactor) Line(line string) string {
	// TODO: scan for token/key shapes; replace with Placeholder.
	return line
}
