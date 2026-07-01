// Package creds reads provider API keys from the macOS Keychain, envelope-
// encrypts them at rest, and injects the plaintext ephemerally into the agent
// process. Plaintext never touches disk and lives only for the injection.
package creds

import "context"

// Sealed is an envelope-encrypted credential: a wrapped data key plus the
// ciphertext it protects. The unwrapping key never leaves the Keychain.
type Sealed struct {
	// WrappedKey is the data key wrapped by a Keychain-resident key.
	WrappedKey []byte
	// Ciphertext is the AEAD-encrypted secret.
	Ciphertext []byte
	// Nonce is the AEAD nonce.
	Nonce []byte
}

// Store reads and seals credentials for injection.
type Store struct {
	// TODO: hold Keychain service/account identifiers.
}

// NewStore returns a credential Store bound to the offlid Keychain items.
func NewStore() *Store {
	return &Store{}
}

// Seal reads the named Keychain item and envelope-encrypts it.
func (s *Store) Seal(ctx context.Context, account string) (*Sealed, error) {
	// TODO: SecItemCopyMatching for account; generate data key; AEAD-seal;
	//       wrap the data key with a Keychain-resident wrapping key.
	return nil, nil
}

// InjectEphemeral unwraps a sealed credential and returns the plaintext for
// immediate injection into the agent environment. Callers must zero it after
// use; it is never written to disk.
func (s *Store) InjectEphemeral(ctx context.Context, sealed *Sealed) ([]byte, error) {
	// TODO: unwrap data key via Keychain; AEAD-open; return plaintext.
	return nil, nil
}
