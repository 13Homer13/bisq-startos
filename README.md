<p align="center">
  <img src="icon.png" alt="Bisq Logo" width="21%">
</p>

# Bisq on StartOS

> **Upstream docs:** <https://bisq.wiki/>
>
> Everything not listed in this document should behave the same as upstream
> Bisq. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable.

[Bisq](https://bisq.network/) is a decentralized peer-to-peer Bitcoin exchange. Trade Bitcoin for fiat currencies and other cryptocurrencies without intermediaries, KYC, or centralized servers.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)

---

## Image and Container Runtime

| Property      | Value                                                                 |
|---------------|-----------------------------------------------------------------------|
| Image source  | Custom multi-stage Dockerfile (Ubuntu Jammy builder + KasmVNC Debian Bookworm webtop, flattened via `FROM scratch`) |
| Architectures | x86_64 only                                                          |
| Entrypoint    | `unshare --pid --fork --mount-proc /init` (s6-overlay requires PID 1 in its own namespace) |

Bisq is a JavaFX desktop application with no web interface. This package runs it inside a browser-accessible Linux desktop (webtop) powered by KasmVNC:

```
Browser -> KasmVNC (port 3000) -> Openbox -> Bisq (JavaFX)
```

## Volume and Data Layout

| Volume | Mount point | Contents                                                  |
|--------|-------------|-----------------------------------------------------------|
| `main` | `/config`   | Webtop home, Bisq application data, `store.json`         |

- **`store.json`** — StartOS-managed file storing the admin username and password
- **`/config/.local/share/Bisq/`** — upstream Bisq data directory (wallet, trades, settings)
- **`/config/.local/share/Bisq/bisq.properties`** — generated at launch by `startwm.sh`

## Installation and First-Run Flow

1. On install, `store.json` is seeded with username `bisq` and no password.
2. A **critical task** prompts the user to run the **Set Admin Password** action, which generates a random password and displays the credentials.
3. The password is passed to KasmVNC via the `PASSWORD` environment variable.

There is no upstream setup wizard to skip — Bisq launches directly.

## Configuration Management

| StartOS-Managed                        | Upstream-Managed                              |
|----------------------------------------|-----------------------------------------------|
| Admin username and password            | All Bisq application settings via its own UI  |
| KasmVNC webtop settings (port, auth)   | Wallet, trades, offers                        |
| `bisq.properties` (Tor/network flags)  |                                               |

The `bisq.properties` file is regenerated on every launch by `startwm.sh` with:
- `useTorForBtc=false` (StartOS handles Tor at the network level)
- Empty banned node lists

## Network Access and Interfaces

| Interface      | Port | Protocol | Purpose                         |
|----------------|------|----------|---------------------------------|
| Bisq Desktop   | 3000 | HTTP     | KasmVNC web interface (full Bisq desktop in browser) |

Access via LAN (.local), Tor (.onion), or any other address type configured in StartOS. StartOS terminates TLS, so the interface is always available over HTTPS to the user.

## Actions (StartOS UI)

| Action               | Purpose                                              | Availability | Inputs | Outputs                    |
|----------------------|------------------------------------------------------|--------------|--------|----------------------------|
| **Set Admin Password** | Generate a new random password for the webtop interface | Any status   | None   | Username and new password  |

On first install, this action is triggered automatically as a critical task.

## Backups and Restore

- **Backed up:** The entire `main` volume (webtop config, Bisq data, wallet, trades, `store.json`)
- **Restore behavior:** Standard volume restore. On restore, `seedFiles` re-runs but does not create a password task (only on fresh install).

## Health Checks

| Check         | Method              | Success message           | Error message               |
|---------------|---------------------|---------------------------|-----------------------------|
| Bisq Desktop  | Port 3000 listening | "Bisq desktop is ready"   | "Bisq desktop is not ready" |

## Dependencies

| Dependency       | Required | Version     | Health check | Purpose                    |
|------------------|----------|-------------|--------------|----------------------------|
| Bitcoin (`bitcoind`) | Yes  | >= 28.3:5   | `bitcoind`   | Blockchain data            |

## Limitations and Differences

1. **x86_64 only** — Bisq does not provide official ARM builds.
2. **No direct desktop access** — Bisq runs inside a KasmVNC webtop, not as a native desktop app.
3. **`bisq.properties` is overwritten on every start** — manual edits to this file will not persist.
4. **Tor for BTC is disabled** — StartOS manages Tor at the network layer; Bisq's built-in Tor is bypassed.
5. **First launch is slow** — Bisq needs to connect to the P2P trading network and sync, which can take several minutes.

## What Is Unchanged from Upstream

- All trading functionality (offers, trades, disputes)
- Wallet management (send, receive, backup seed)
- All Bisq UI settings and preferences
- P2P network participation
- DAO functionality

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Quick Reference for AI Consumers

```yaml
package_id: bisq
upstream_version: 1.9.22
image: custom dockerBuild (multi-stage: ubuntu:jammy + baseimage-kasmvnc:debianbookworm, flattened via FROM scratch)
architectures: [x86_64]
volumes:
  main: /config
ports:
  ui: 3000
dependencies:
  - bitcoind (running, >= 28.3:5, health check: bitcoind)
startos_managed_env_vars:
  - CUSTOM_USER
  - PASSWORD
  - PUID
  - PGID
  - TZ
  - TITLE
  - S6_CMD_WAIT_FOR_SERVICES_MAXTIME
  - S6_VERBOSITY
actions:
  - setPassword
```
