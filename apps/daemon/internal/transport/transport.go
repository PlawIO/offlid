// Package transport ships redacted capture manifests to the offlid cloud
// gateway over TLS. It speaks only to the gateway; the checkpoint store, sync,
// and orchestration live server-side and are out of scope for this daemon.
package transport

import (
	"context"

	"github.com/PlawIO/offlid/apps/daemon/internal/capture"
)

// Client sends manifests to the cloud gateway.
type Client struct {
	endpoint string
	// TODO: hold the authenticated HTTP client + session token.
}

// NewClient returns a transport Client for the given gateway endpoint.
func NewClient(endpoint string) *Client {
	return &Client{endpoint: endpoint}
}

// Send transmits a redacted manifest to the gateway. The manifest must already
// have passed through internal/redact before reaching this call.
func (c *Client) Send(ctx context.Context, m *capture.Manifest) error {
	// TODO: authenticate to the gateway; POST the manifest envelope over TLS.
	return nil
}
