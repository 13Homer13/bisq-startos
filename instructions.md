# Bisq

Bisq is a JavaFX desktop application. This package runs it inside a browser-accessible Linux desktop streamed by Selkies, so the **Bisq Desktop** interface opens the full Bisq UI in your browser rather than a web app.

## Documentation

- [Bisq Wiki](https://bisq.wiki/) — the upstream documentation for trading, wallet management, and the Bisq protocol.

## What you get on StartOS

- A **Bisq Desktop** interface that streams the Bisq JavaFX application to your browser over Selkies.
- A single backed-up `main` volume that holds your Bisq wallet, trades, offers, and Selkies settings.
- A local-only Bitcoin connection by default, with an explicit Bisq network fallback mode when a local node is not available.
- Selkies upload and download support for moving Bisq wallet/history exports to or from another machine. Unrelated desktop applications are not exposed.
- A Bisq memory limit of 4 GiB, rising to as much as 8 GiB on servers with more RAM, sized for DAO synchronization and monitoring.

## Getting set up

1. Make sure your StartOS server has at least 8 GB of memory. Bisq needs this capacity to synchronize and monitor DAO state reliably.
2. Install **Bitcoin** first if you have not already. The default local-only mode requires it to be installed, running, and configured to serve Bloom filters. StartOS presents a critical task that applies this Bitcoin setting.
3. If you cannot use a local Bitcoin node, run **Configure Bitcoin Connection** and select **Bisq network fallback**. This mode uses remote Bisq Bitcoin peers over Tor and does not require the Bitcoin service.
4. After install, StartOS posts a critical task **Set your admin password**. Run it and copy the generated `bisq` username and password to a password manager — you'll need them to log into the desktop.
5. Start the service and open the **Bisq Desktop** interface. Enter the `bisq` username and the password from step 4 when your browser prompts for credentials.
6. Bisq's own first-run wizard appears in the desktop. Walk through it to create or restore a wallet. The first connection to the P2P trading network can take several minutes.

## Using Bisq

### Bisq Desktop

The **Bisq Desktop** interface is the full Bisq application rendered in your browser. Everything you would do on a native Bisq install — make and take offers, manage your wallet, participate in disputes, vote in the DAO — happens here. Selkies handles keyboard, mouse, audio, and clipboard between your browser and the Bisq desktop.

### Actions

- **Set Admin Password** — generate a new random password for the Selkies login and display the credentials. Run this if you lose the password or want to rotate it. Once a password exists, it asks you to confirm before replacing it, and Bisq restarts.
- **Configure Bitcoin Connection** — choose **Local node only** (the default and recommended mode) or **Bisq network fallback**. Changing this setting restarts Bisq.
- **Configure Tor Sandbox** — keep Tor isolated from your wallet and keys (enabled by default), or disable isolation explicitly if it prevents Tor from starting or your bridges cannot work inside it. Changing this setting restarts Bisq. This does not change your Bitcoin connection mode.

The Selkies sidebar offers streaming settings and file transfers. Available video codecs depend on your browser and server; JPEG is available as a fallback.

New sessions use constant bitrate (CBR) with congestion control to adapt streaming to your connection. You can select constant quality (CRF) in the sidebar instead; saved streaming settings take precedence. Open the Bisq Desktop interface directly, as embedding it in another site's page is blocked.

Selkies file upload/download can be used to transfer wallet and history exports.
Keep exported wallet material secure because it may contain sensitive recovery
information.

### Tor sandbox and connection problems

Bisq normally runs Tor in a sandbox to keep a compromised Tor process away from your wallet and keys. A **Weaker Tor sandbox** popup means your server supports a reduced level of isolation; read the popup to see which protections are unavailable. It does not mean the sandbox is off.

If Tor cannot start:

1. Read Bisq's Tor error. If you use bridges with pluggable transports, enable **Allow pluggable transports in the Tor sandbox** in Bisq's Tor network settings. This choice survives service restarts. This is the English label shown by Bisq, including when another language is selected. The provided bridge choices are obfs4, snowflake, and meek.
2. If Bisq reports that the sandbox cannot run, or your bridges require it to be off, open **Configure Tor Sandbox** in StartOS and turn off **Enable Tor Sandbox**. This removes Tor's isolation from your wallet and keys; use it only to recover from that compatibility problem.
3. Re-enable the sandbox when the problem is resolved.

Advanced troubleshooting: Bisq stores Tor state under `.local/share/Bisq/btc_mainnet/tor/data/` within the backed-up data volume. Its log reports `Tor runs in the level base of its sandbox` when the strongest Linux sandbox is active. The sandbox choice is saved by StartOS and survives restarts; editing `bisq.properties` is not a way to change it.

## Limitations

- **x86_64 only.** This package includes the upstream x86_64 Debian build.
- **The Bisq network profile is regenerated on every start.** Bitcoin connection changes must use **Configure Bitcoin Connection**. Bisq's bridge-transport permission is preserved; other manual edits to `bisq.properties` do not persist.
- **Local-only mode fails closed.** If the local Bitcoin peer cannot be reached, Bisq fails to start instead of silently connecting to remote Bitcoin peers.
- **Fallback mode is explicit.** It uses remote Bisq Bitcoin peers over Tor and should be selected only when you do not want to require the local Bitcoin service.
- **8 GB of system memory is required.** This leaves room for Bisq's Java heap, 4 GiB on an 8 GB server, and the browser desktop processes used to display it.
