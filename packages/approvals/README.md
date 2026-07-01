# @offlid/approvals

The approval-relay **client**. When the daemon needs a human decision, this
package renders a `veto://` deep link and hands it to the user. That is all it
does.

**Zero policy logic lives here.** No rules, no classifiers, no allow/deny
decisions: those are evaluated by the approval service. Approvals are
**Powered by Veto** ([veto.so](https://veto.so)). This client only builds and
opens the link.
