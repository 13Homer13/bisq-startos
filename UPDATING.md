# Updating the upstream version

This package wraps the Bisq desktop application (from `bisq-network/bisq`). It verifies the upstream `.deb` published at `bisq.network/downloads/v<version>/` against a pinned PGP key and extracts its Bisq files into a LinuxServer Selkies webtop image.

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

- **Selkies base image**: `Dockerfile` pins the multi-architecture `ghcr.io/linuxserver/baseimage-selkies:debiantrixie` image by a release tag and immutable OCI index digest. Verify the current tag and architectures with:

  ```
  docker buildx imagetools inspect ghcr.io/linuxserver/baseimage-selkies:debiantrixie
  ```

  When intentionally updating the base, select the newest Debian Trixie release from `linuxserver/docker-baseimage-selkies` that bundles stable Selkies (skip `dev` tags). LinuxServer marks its base-image GitHub releases as prereleases even when they bundle stable software; verify the bundled version and the linked CI results instead of using that flag to select a release. Replace both the release tag and digest in the `FROM` line. Inspect the image configuration and keep the flattened image's `ENV` block in sync with its runtime environment, retaining `START_DOCKER=false` and `SELKIES_RATE_CONTROL_MODE="cbr,crf"` so new sessions start with congestion-controlled CBR while CRF remains selectable. Check the Selkies release notes and the base startup scripts for renamed settings, codecs, authentication, and desktop startup changes. Verify that `root/etc/nginx/conf.d/bisq-frame-ancestors.conf` still adds the same-origin framing policy to the dashboard served by nginx, since it bypasses Selkies' HTTP server.
