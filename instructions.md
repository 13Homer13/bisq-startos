# Bisq

Bisq is a JavaFX desktop application. This package runs it inside a browser-accessible Linux desktop streamed by Selkies, so the **Bisq Desktop** interface opens the full Bisq UI in your browser rather than a web app.

## Documentation

- [Bisq Wiki](https://bisq.wiki/) — the upstream documentation for trading, wallet management, and the Bisq protocol.

## What you get on StartOS

- A **Bisq Desktop** interface that streams the Bisq JavaFX application to your browser over Selkies.
- A single backed-up `main` volume that holds your Bisq wallet, trades, offers, and Selkies settings.
- A local-only Bitcoin connection by default, with an explicit Bisq network fallback mode when a local node is not available.
- Selkies upload and download support for moving Bisq wallet/history exports to or from another machine. Unrelated desktop applications are not exposed.
- A 4 GiB Bisq memory limit sized for DAO synchronization and monitoring.

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

The Selkies sidebar offers streaming settings and file transfers. Available video codecs depend on your browser and server; JPEG is available as a fallback.

Selkies file upload/download can be used to transfer wallet and history exports.
Keep exported wallet material secure because it may contain sensitive recovery
information.

## Limitations

- **x86_64 only.** Bisq does not ship official ARM builds.
- **The Bisq network profile is regenerated on every start.** Manual edits to `bisq.properties` inside the container do not persist.
- **Local-only mode fails closed.** If the local Bitcoin peer cannot be reached, Bisq fails to start instead of silently connecting to remote Bitcoin peers.
- **Fallback mode is explicit.** It uses remote Bisq Bitcoin peers over Tor and should be selected only when you do not want to require the local Bitcoin service.
- **8 GB of system memory is required.** This leaves room for Bisq's 4 GiB Java heap and the browser desktop processes used to display it.
