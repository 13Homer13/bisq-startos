# Updating the upstream version

This package wraps the Bisq desktop application (from `bisq-network/bisq`), installing the upstream `.deb` published at `bisq.network/downloads/v<version>/` into a LinuxServer Selkies webtop image and verifying it against a pinned PGP key.

## Determining the upstream version

- **Bisq** (`bisq-network/bisq`, https://github.com/bisq-network/bisq):

  ```
  gh release view -R bisq-network/bisq --json tagName -q .tagName
  ```

  Pinned as `BISQ_VERSION` in `Dockerfile` (the tag is `v<version>`; the pin omits the `v`).

## Applying the bump

- **Bisq**: in `Dockerfile`, update the `ARG BISQ_VERSION=...` line to the new version (without the leading `v`). If upstream rotated signers, also update `ARG BISQ_PGP_KEY=...` to the new fingerprint.

- **Bisq-provided Bitcoin peers**: compare `startos/utils.ts`'
  `bisqNetworkFallbackNodes` with `BtcNodes.getProvidedBtcNodes()` in the
  matching upstream Bisq tag. The explicit list ensures that switching from a
  persisted local custom node to fallback mode takes effect.

- **Selkies base image**: `Dockerfile` pins the multi-architecture `ghcr.io/linuxserver/baseimage-selkies:debiantrixie` image by an immutable release tag and OCI index digest. Verify the current tag and architectures with:

  ```
  docker buildx imagetools inspect ghcr.io/linuxserver/baseimage-selkies:debiantrixie
  ```

  When intentionally updating the base, select the newest stable Debian Trixie release from `linuxserver/docker-baseimage-selkies` (skip `dev` tags), verify its bundled Selkies version, and replace both the release tag and digest in the `FROM` line. Inspect the image configuration and keep the flattened image's `ENV` block in sync with its runtime environment, retaining `START_DOCKER=false`. Check the Selkies release notes and the base startup scripts for renamed settings, codecs, authentication, and desktop startup changes. Increment the StartOS downstream revision while keeping the Bisq version unchanged. Preserve any migration in the outgoing `current.ts` as described in the packaging guide.
