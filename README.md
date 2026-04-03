<p align="center">
  <img src="icon.png" alt="Bisq Logo" width="100">
</p>

# Bisq for StartOS

[Bisq](https://bisq.network/) is a decentralized peer-to-peer Bitcoin exchange. Trade Bitcoin for fiat currencies and other cryptocurrencies without intermediaries, KYC, or centralized servers. By running Bisq on StartOS, your trades continue 24/7 — no need to keep your laptop open.

This repository packages Bisq for [StartOS](https://start9.com/).

## How It Works

Bisq is a JavaFX desktop application with no web interface. This package runs Bisq inside a browser-accessible Linux desktop (webtop) powered by KasmVNC. You access the full Bisq desktop through your web browser.
```
Browser → KasmVNC (port 3000) → Openbox → Bisq (JavaFX)
```

## Features

- **Always-on trading** — trades complete even when your laptop is off
- **Browser access** — full Bisq desktop accessible from any device
- **Auto-generated credentials** — secure login for the webtop interface
- **Password management** — get credentials and reset password via StartOS actions
- **Persistent data** — wallet, trades, and settings survive restarts and updates
- **Backup support** — included in StartOS encrypted backups

## Actions

| Action | Description |
|--------|-------------|
| **Get Credentials** | Retrieve username and password for the webtop interface |
| **Reset Password** | Generate a new random password (service restarts) |

## Dependencies

- **Bitcoin Core / Bitcoin Knots** (`bitcoind`) — required for blockchain data

## Building from Source

### Prerequisites

- Docker
- Make
- Node.js v22
- SquashFS tools (`squashfs-tools`, `squashfs-tools-ng`)
- [start-cli](https://github.com/Start9Labs/start-cli)

See the [StartOS Packaging Guide](https://docs.start9.com/packaging/0.4.0.x/environment-setup.html) for detailed setup instructions.

### Build
```bash
git clone https://github.com/13Homer13/bisq-startos.git
cd bisq-startos
npm install
start-cli init-key  # first time only
make x86            # for x86_64
make arm            # for aarch64
make                # for all architectures
```

### Install

Configure your StartOS server address:
```bash
mkdir -p ~/.startos
echo "host: https://your-server.local" > ~/.startos/config.yaml
start-cli auth login
make install
```

Or sideload the `.s9pk` file via **StartOS > System > Sideload**.

## Architecture

- **x86_64** only (Bisq does not provide official ARM builds)

## Notes

- First launch takes a few minutes as Bisq connects to the Tor network and syncs with the P2P trading network
- The webtop uses HTTPS Basic Authentication — your browser will prompt for credentials on first connect
- Bisq data is stored in `/config/.local/share/Bisq/` inside the container, which maps to the `main` volume

## Upstream

- **Project:** https://bisq.network/
- **Source:** https://github.com/bisq-network/bisq
- **Docs:** https://bisq.wiki/
- **Version:** 1.9.22

## License

Bisq is licensed under [AGPL-3.0](https://github.com/bisq-network/bisq/blob/master/LICENSE).


---

## Quick Reference for AI Consumers

```
package_id: bisq
version: 1.9.22:1
image: custom dockerBuild (multi-stage: ubuntu:jammy + baseimage-kasmvnc:debianbookworm)
architectures: [x86_64]
pattern: webtop (desktop app in browser via KasmVNC)
volumes:
  main: /config
ports:
  ui: 3000 (KasmVNC web interface)
dependencies:
  bitcoind:
    kind: running
    optional: false
startos_sdk: 0.4.0
exec_command: [unshare, --pid, --fork, --mount-proc, /init]
auth: CUSTOM_USER + PASSWORD env vars (KasmVNC basic auth)
app_data: /config/.local/share/Bisq/
app_config: /config/.local/share/Bisq/bisq.properties
app_launch: /opt/bisq/bin/Bisq (from startwm.sh)
window_manager: openbox-session
actions:
  - get-credentials (retrieve username/password)
  - reset-password (generate new random password)
key_patterns:
  - Multi-stage Dockerfile: install .deb in Ubuntu, copy to Debian
  - FROM scratch: flatten layers, remove Docker/fonts/bloat
  - unshare --pid: gives /init its own PID namespace (s6 requires PID 1)
  - wmctrl: force maximize app window after launch
  - pkill + lock cleanup: prevent double instance errors
  - dpkg -i ... || true: ignore post-install desktop menu errors
known_issues:
  - JavaFX needs GTK3+X11 libs installed in final stage
  - s6-overlay-suexec crashes without PID namespace isolation
  - baseimage-kasmvnc shows deprecation warning (remove 99-deprecation)
  - App must launch from startwm.sh, not autostart alone
```
