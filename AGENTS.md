# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes. This file restates neither:
whoever changes the package has both, so it carries only what they don't — repo mechanics,
a change that looks right and is not, where the next thing gets added, a naming trap, a
build or test invocation particular to this repo.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **Keep `runAsInit: true`.** The base image is s6-overlay, which must be PID 1; without it nothing in the desktop comes up.
- **Keep `root/defaults/autostart` unconditional.** It overwrites the persisted copy on every launch so an upgraded volume never keeps an obsolete startup script; generating `bisq.properties` and clearing Bisq's stale `.lock`/`.pid` files belong there, not in `main.ts`.
- **Don't relax the local-only failure path** (`check-bitcoin-node` and the throw in `main.ts`): Bisq must never reach remote Bitcoin peers with the user's wallet addresses when they chose their own node.
- **Don't loosen the Selkies hardening env** (`DISABLE_SUDO`, `DISABLE_TERMINALS`, `SELKIES_COMMAND_ENABLED=false`, the sidebar flags): it keeps the webtop from being a shell on the box. `SELKIES_FILE_TRANSFERS` stays on for wallet exports.
- **Keep `bisq` in the manifest's `volumes`, though nothing mounts it.** The `1.10.9:1` migration reads a 0.3.5.1 install's data from it, and a migration can read only a declared volume.
