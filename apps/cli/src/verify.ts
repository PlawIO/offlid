import type { ResolvedDaemon } from "./resolve.js";

/** Expected integrity metadata for a release artifact. */
export interface Integrity {
  /** Lowercase hex SHA-256 of the binary. */
  sha256: string;
  /** Detached cosign signature (base64). */
  cosignSignature: string;
}

/**
 * Verify a resolved daemon binary before it is executed. Checks the SHA-256
 * checksum and the cosign signature against the pinned release key. Returns
 * false on any mismatch; the caller must not run an unverified binary.
 */
export async function verifyBinary(_resolved: ResolvedDaemon): Promise<boolean> {
  // TODO: read the binary, compute SHA-256, compare against the published
  // checksum for this version.

  // TODO: verify the detached cosign signature with the pinned offlid release
  // public key (keyless/OIDC or embedded key).

  // Fail closed until verification is implemented.
  return false;
}
