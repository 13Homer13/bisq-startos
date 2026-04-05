## How the upstream version is pulled

- `Dockerfile` ARG: `BISQ_VERSION=<version>`
- Downloads `.deb` from `bisq.network/downloads/v<version>/`
- Image is `dockerBuild` (no dockerTag in manifest to update)
