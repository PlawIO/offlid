// This package is an approval-relay CLIENT. Zero policy logic lives here:
// no rules, no classification, no allow/deny decisions. It only renders a
// veto:// deep link for the user. Policy is evaluated by the approval service.

/** An approval request handle issued by the approval service. */
export interface ApprovalRequest {
  /** Opaque request id issued upstream. */
  id: string;
  /** Short, human-readable summary to show alongside the link. */
  summary: string;
}

/**
 * Build the `veto://` deep link for an approval request. This is pure string
 * construction: it makes no decision and applies no policy.
 */
export function buildDeepLink(req: ApprovalRequest): string {
  const params = new URLSearchParams({ id: req.id });
  return `veto://approve?${params.toString()}`;
}

/**
 * Render an approval request to the user by printing its deep link. Opening the
 * link is delegated to the OS handler; the decision happens in the Veto app.
 */
export function renderApproval(req: ApprovalRequest): string {
  const link = buildDeepLink(req);
  // TODO: optionally hand the link to the OS `open` handler.
  return link;
}
