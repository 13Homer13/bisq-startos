<p align="center">
  <img src="icon.png" alt="Bisq Logo" width="21%">
</p>

# Bisq on StartOS

> Everything not listed in this document should behave the same as upstream
> Bisq. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation
> section of `instructions.md` for links.

[Bisq](https://github.com/bisq-network/bisq) is a decentralized peer-to-peer Bitcoin exchange — fiat and altcoin trades with no intermediary, no KYC, and no central server. It is a JavaFX **desktop** application, so this package runs it inside a browser-accessible Linux desktop rather than serving a web app, and wires its Bitcoin connection to the node on the same server.

- **Upstream repo:** <https://github.com/bisq-network/bisq>
- **Wrapper repo:** <https://github.com/Start9-Community/bisq-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built here in three stages: an Ubuntu builder that produces the Bisq tree, a digest-pinned LinuxServer Selkies webtop that supplies the desktop, and a `FROM scratch` flatten that collapses the result into a single layer.

| Property      | Value                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| Image         | Built from this repo's `Dockerfile`                                      |
| Architectures | x86_64 only                                                              |
| Entrypoint    | The base image's `/init`, via `sdk.useEntrypoint()` + `runAsInit`        |
| Memory        | Requires a machine of 8 GB or better; Bisq's JVM heap is capped at 4 GiB |

| Subcontainer | Purpose                                                       |
| ------------ | ------------------------------------------------------------- |
| `bisq-sub`   | Both the startup oneshot and the desktop daemon — attach here |

The stack is `browser → Selkies (port 3000) → Openbox → Bisq`. Selkies starts Openbox through its own D-Bus session wrapper, and a package-owned autostart hook launches Bisq inside that session. **`runAsInit: true` is required**, not stylistic: the base image is s6-overlay, which must be PID 1.

Selkies carries video, audio, input, clipboard, and file transfers over WebSockets through the same interface. Video codec availability depends on the browser and server; JPEG provides a fallback. The flattened image restores the base image's runtime environment explicitly, with nested Docker disabled.

The autostart hook is copied over the persisted Openbox autostart file on **every** launch, so an upgrade can never leave an obsolete startup script behind on a volume that predates it.

**The desktop is deliberately locked down.** Passwordless sudo, terminal binaries, the remote command channel, external open helpers, and the unrelated applications sidebar are all disabled through the base image's environment. File upload and download are the one capability kept, because Bisq users need to move wallet and trade-history exports on and off the machine. Treat the webtop as a window onto Bisq, not as a general-purpose Linux desktop.

## Volume and Data Layout

Two volumes, of which only `main` is mounted.

| Volume | Mount Point | Purpose                                                                    |
| ------ | ----------- | -------------------------------------------------------------------------- |
| `main` | `/config`   | Webtop home, Bisq's data directory, and `store.json`                       |
| `bisq` | not mounted | Where a 0.3.5.1 install kept Bisq's data directory; empty once it migrates |

| Path                                    | Holds                                                         |
| --------------------------------------- | ------------------------------------------------------------- |
| `store.json`                            | Package state: the desktop password and the Bitcoin mode      |
| `.local/share/Bisq/`                    | Upstream's data directory — wallet, trades, offers, DAO state |
| `.local/share/Bisq/bisq.properties`     | Generated on every launch; see [File Models](#file-models)    |
| `.local/share/Bisq-superseded-<stamp>/` | A data directory the 0.3.5.1 migration set aside              |

**A Bisq carried over from StartOS 0.3.5.1** arrives with its data directory in `bisq`. The `1.10.9:1` migration copies it to `main/.local/share/Bisq/`, owned by the desktop user (`1000:1000`), then empties `bisq`. A data directory already at that path, which a Bisq started on an earlier 0.4.0 release created, is first renamed to `Bisq-superseded-<UTC timestamp>/` and never deleted. If the migration is interrupted, the next attempt finishes it; `.local/share/.bisq-0.3.5.1` and `.bisq-0.3.5.1.partial` are its staging copies. The move runs once, on the update into `1.10.9:1`, so **a new, empty wallet on such an install, with data still in `bisq`, means Bisq is on a release before `1.10.9:1`, and updating runs the move.**

**Your wallet is in `main`.** There is nothing kept outside it, which makes the backup the whole of your recovery story for anything Bisq holds.

## File Models

One model, plus one generated file that is deliberately **not** modelled.

| File                                | Format | Modelled                | Written by                          |
| ----------------------------------- | ------ | ----------------------- | ----------------------------------- |
| `store.json`                        | JSON   | Yes — `FileHelper.json` | Init and both actions               |
| `.local/share/Bisq/bisq.properties` | props  | No                      | The autostart hook, on every launch |

`store.json` holds exactly two things: `PASSWORD`, generated by [Set Admin Password](#actions) and passed to Selkies as the desktop credential, and `bitcoinConnectionMode`, one of `local-only` or `bisq-network`. The username is not stored — it is always `bisq`.

Both fields are read through `.const()`, so writing either re-runs `main` and the service picks the change up without a manual restart.

**`bisq.properties` is rewritten from scratch every time the desktop starts**, from the connection mode and the resolved Bitcoin address. A hand edit does not survive a restart — this is the file that decides whether Bisq talks to your node or to the network, and letting a stale copy win would silently change where your wallet gets its chain data. The same hook also clears Bisq's lock and PID files, so a crash does not leave the application refusing to start.

Everything else — trading preferences, wallet settings, account details — belongs to Bisq's own UI and is untouched by the package.

## Dependencies

Bitcoin, and **whether it is required depends on the connection mode**. `startos/dependencies.ts` declares it optional, enabled while the mode is `local-only`.

| Mode                   | Bitcoin                                              |
| ---------------------- | ---------------------------------------------------- |
| `local-only` (default) | Required, `kind: 'running'`, health check `bitcoind` |
| `bisq-network`         | Not a dependency at all                              |

The accepted versions are `28.4:29`, `29.4:16`, `30.3:16` or `31.1:16` and later within each major line, or Bitcoin Knots (pre-RDTS) `29.3:29` and later. Every accepted build has the bridge-only peer listener (`peer-local`, port 58334).

In local-only mode Bisq connects to Bitcoin's private, whitelisted peer listener over the internal bridge — a trusted connection to your own node, which is the point of running Bisq at home. That listener also requires Bitcoin to serve **bloom filters**, which is not on by default, so the package raises a task on Bitcoin's own page to turn it on (see [Tasks](#tasks)).

In fallback mode Bisq uses the remote Bitcoin peers shipped with the Bisq release, over Tor. The peer list is supplied explicitly by the package rather than left to Bisq's defaults, so switching away from a previously configured local node takes effect reliably.

Refer to the dependency as **Bitcoin**: either Bitcoin Core or Bitcoin Knots satisfies it.

## Network Access and Interfaces

One interface, and what it serves is a remote desktop rather than a web application.

| Interface    | Id   | Type | Port | Description                                   |
| ------------ | ---- | ---- | ---- | --------------------------------------------- |
| Bisq Desktop | `ui` | ui   | 3000 | The Bisq application, streamed to the browser |

Bound on the `ui-multi` MultiHost over HTTP and not masked.

The StartOS 0.3.5 package exposed a host named `main` (Tor 80→3000 and 3389→3389, LAN 443→3000 and 3389→3389). The `1.10.9:2` migration retires it, freeing its ports; its onion and any domain on it are not moved to `ui-multi`.

The interface is password-protected by Selkies itself, using the credential in `store.json` — so unlike most packages here, the service has its own login independent of StartOS. That login is what stands between anyone who can reach the address and your Bisq wallet.

Bisq's own outbound Tor connections are made by Bisq, not by StartOS, and are unaffected by how this interface is reached.

## Installation and First-Run Flow

Install seeds an empty `store.json` and raises a `critical` task to set the desktop password. There is no default credential, so nothing can be reached until that task is done.

Startup then runs in two steps. A oneshot checks that Bitcoin's peer listener is actually reachable — polling for roughly a minute in local-only mode, and doing nothing at all in fallback mode — and the desktop daemon only starts if it succeeds. **Local-only mode fails closed:** if your node cannot be reached, Bisq refuses to start rather than quietly falling back to strangers' Bitcoin peers.

Once the desktop opens, Bisq's own first-run wizard runs inside it. The first connection to the P2P trading network takes several minutes and is not something the package can shorten.

The recommended order is therefore: install and sync Bitcoin, accept the bloom-filter task, install Bisq, run Set Admin Password, then start.

## Actions

Two actions, both available at any status and neither grouped.

### Set Admin Password

Generates a new random password for the desktop login and shows it once. Run it when its task appears, and any time you need to rotate or recover the credential. When a password already exists, it asks for confirmation first.

- **What it changes:** `PASSWORD` in `store.json`, which becomes Selkies' password on the next start.
- **Cost:** the write re-runs `main`, so the desktop restarts and any open browser session must log in again.
- **Repeat safety:** idempotent in effect, but each run produces a **new** password and invalidates the old one.
- **Outputs:** the username (always `bisq`) and the new password, shown once.

### Configure Bitcoin Connection

Chooses between your own node and the Bisq network's Bitcoin peers. Run it if you do not run Bitcoin on this server, or to move back to your node once you do.

- **What it changes:** `bitcoinConnectionMode` in `store.json`. That single value drives three things at once: whether Bitcoin is a StartOS dependency, whether the bloom-filter task exists, and what `bisq.properties` is regenerated as.
- **Cost:** the service restarts, and Bisq reconnects to a different Bitcoin source.
- **Repeat safety:** idempotent; the last choice wins.
- **What to know before switching to fallback:** you gain the ability to run without a local node, and you give up the trusted, private chain source. Bisq will be asking remote peers about your wallet's addresses, over Tor.

## Tasks

Two, and one of them appears on a **different service's** page.

| Task                    | Severity   | Raised when                                            | Cleared when                         |
| ----------------------- | ---------- | ------------------------------------------------------ | ------------------------------------ |
| Set your admin password | `critical` | At install                                             | Set Admin Password runs              |
| Enable bloom filters    | `critical` | While in local-only mode and Bitcoin lacks the setting | Bitcoin's config is changed to match |

The first is raised on install only, so a restore does not re-prompt for a password that came back with the backup.

The second is a **dependency task**: it is created against Bitcoin's `autoconfig` action, so the user sees it on **Bitcoin's** page with no indication there that Bisq asked for it. It is declared `once: false`, which means it comes back if the setting is ever turned off again — it is a standing requirement, not a one-time setup step. Switching to fallback mode hides it and stops it blocking anything; switching back brings it back.

`critical` blocks the service it belongs to from starting and suspends the ordinary controls.

## Health Checks

One check, on the desktop.

| Check     | Displayed as   | Method                 | Grace Period |
| --------- | -------------- | ---------------------- | ------------ |
| `primary` | "Bisq Desktop" | Port 3000 is listening | default      |

The check reports whether Selkies is serving, which is not the same as Bisq being usable: the desktop can be up while Bisq is still starting inside it, and the JavaFX window can take a while to appear. A green check with a blank desktop is a normal early state, not a fault.

Nothing here reports on Bisq's connection to Bitcoin or to the P2P network. The Bitcoin connection is checked once, by the startup oneshot, and after that Bisq's own UI is the place to see it.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. That is the webtop home, Bisq's entire data directory, `store.json`, and any `Bisq-superseded-*` directory. `bisq` is not backed up: it is empty once the 0.3.5.1 migration has run.

**This backup contains your wallet.** Everything Bisq holds — keys, trade history, offers, and the DAO state — is in `main`, so a restore brings back a working, funded instance with the same desktop password.

That also means the backup is sensitive in a way most packages' are not. Bisq's own seed-phrase backup remains the thing to keep independently: it is what recovers funds if the StartOS backup is lost, and it is much smaller.

A restored instance does not re-raise the password task, since the password came back with it. The Bitcoin connection is re-resolved on the new box.

## Limitations and Differences

1. **x86_64 only.** Bisq ships no official ARM build.
2. **It is a desktop application in a browser, not a web app.** Latency, clipboard behavior, and window management are Selkies' rather than Bisq's, and the experience differs from a native install.
3. **`bisq.properties` is regenerated on every start.** Hand edits to the Bitcoin connection do not persist; use the action.
4. **Local-only mode fails closed.** An unreachable local node stops the service instead of silently using remote peers.
5. **The desktop is not a general-purpose one.** Terminals, sudo, and the applications sidebar are disabled; file transfer is not.
6. **A machine of 8 GB or better is required.** Bisq's heap is capped at 4 GiB and DAO state can consume it, with the desktop stack on top.
7. **First launch is slow** — joining the P2P trading network takes several minutes, every time on a fresh install.
8. **A `Bisq-superseded-*` directory is never reaped.** Nothing removes it and it is copied into every backup. It is a complete Bisq data directory, wallet included, so deleting it is the operator's call, once they are sure nothing in it is still needed.

---

## Quick Reference for AI Consumers

```yaml
package_id: bisq
image: built from ./Dockerfile # ubuntu builder + linuxserver selkies webtop, flattened
architectures:
  - x86_64
subcontainers:
  - bisq-sub # the oneshot and the desktop daemon
volumes:
  main: /config
  bisq: null # not mounted; a 0.3.5.1 install's data directory until the 1.10.9:1 migration moves it into main
file_models:
  - store.json
  # .local/share/Bisq/bisq.properties is generated each launch, not modelled
startos_managed_env_vars:
  - CUSTOM_USER
  - PASSWORD
  - JAVA_TOOL_OPTIONS
  - BITCOIN_CONNECTION_MODE
  - BITCOIND_PEER_ADDR
  - BISQ_NETWORK_FALLBACK_NODES
  - PUID
  - PGID
  - TZ
  - TITLE
  - S6_CMD_WAIT_FOR_SERVICES_MAXTIME
  - S6_VERBOSITY
  - NO_DECOR
  - DISABLE_OPEN_TOOLS
  - DISABLE_SUDO
  - DISABLE_TERMINALS
  - SELKIES_COMMAND_ENABLED
  - SELKIES_UI_SIDEBAR_SHOW_APPS
  - SELKIES_UI_SIDEBAR_SHOW_FILES
  - SELKIES_FILE_TRANSFERS
dependencies:
  - bitcoind # required only in local-only mode; kind: running
interfaces:
  ui: { type: ui, port: 3000 }
actions:
  - set-password
  - configure-bitcoin-connection
tasks:
  - { action: set-password, severity: critical }
  - { action: bitcoind:autoconfig, severity: critical } # on Bitcoin's page, recurring
health_checks:
  - primary # displayed "Bisq Desktop"
```
