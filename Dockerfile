# Stage 1: Install Bisq in Ubuntu where the .deb works
FROM ubuntu:jammy AS bisq-builder

ARG BISQ_VERSION=1.10.9
ARG BISQ_PGP_KEY=B493319106CC3D1F252E19CBF806F422E222AA02

RUN apt-get update && \
    apt-get install -y wget gnupg xdg-utils && \
    rm -rf /var/lib/apt/lists/*

RUN wget -qO /tmp/Bisq-64bit-${BISQ_VERSION}.deb \
      "https://bisq.network/downloads/v${BISQ_VERSION}/Bisq-64bit-${BISQ_VERSION}.deb" && \
    wget -qO /tmp/Bisq-64bit-${BISQ_VERSION}.deb.asc \
      "https://bisq.network/downloads/v${BISQ_VERSION}/Bisq-64bit-${BISQ_VERSION}.deb.asc" && \
    gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys "${BISQ_PGP_KEY}" && \
    gpg --digest-algo SHA256 --verify \
      /tmp/Bisq-64bit-${BISQ_VERSION}.deb.asc \
      /tmp/Bisq-64bit-${BISQ_VERSION}.deb && \
    dpkg -i /tmp/Bisq-64bit-${BISQ_VERSION}.deb || true && \
    test -d /opt/bisq && \
    rm -f /tmp/Bisq-64bit-${BISQ_VERSION}.deb*

# Stage 2: Selkies webtop with bloat removed
FROM ghcr.io/linuxserver/baseimage-selkies:debiantrixie-3900c0f0-ls140@sha256:c3f25149cf58957fcc4259904b02cf88b1e51fc8df2f9946bc64650701e527e7 AS buildstage

# Install GTK3, X11 libraries for JavaFX, and wmctrl
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y --no-install-recommends \
      libgtk-3-0 \
      libgdk-pixbuf-2.0-0 \
      libpango-1.0-0 \
      libcairo2 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libx11-6 \
      libxext6 \
      libxi6 \
      libxtst6 \
      libxrender1 \
      libgl1 \
      libglib2.0-0 \
      libfreetype6 \
      libfontconfig1 \
      libasound2 \
      fonts-dejavu-core \
      x11-xserver-utils \
      xcvt \
      wmctrl && \
    # Remove large unused packages from base image
    DEBIAN_FRONTEND=noninteractive \
    apt-get remove --purge --autoremove -y \
      containerd.io \
      docker-ce \
      docker-ce-cli \
      docker-buildx-plugin \
      docker-compose-plugin \
      fonts-noto-color-emoji \
      fonts-noto-core \
      perl \
      locales-all && \
    # Remove unused locales and regenerate default
    rm -rf $(ls -d /usr/share/locale/* | grep -vw /usr/share/locale/en) && \
    localedef -i en_US -f UTF-8 en_US.UTF-8 && \
    # Cleanup
    apt-get autoclean && \
    rm -rf /config/.cache /var/lib/apt/lists/* /var/tmp/* /tmp/*

# Copy Bisq from builder
COPY --from=bisq-builder /opt/bisq /opt/bisq
RUN ln -s /opt/bisq/bin/Bisq /usr/local/bin/bisq

# Branding
RUN echo "Bisq for StartOS is loading ..." > \
      /etc/s6-overlay/s6-rc.d/init-adduser/branding && \
    sed -i '/^run_branding() {$/,/^}$/c\run_branding() { :; }' /docker-mods

# Stage 3: Flatten into a single layer from scratch
FROM scratch

COPY --from=buildstage / .

# Re-set environment variables lost by FROM scratch
ENV \
  HOME="/config" \
  LANGUAGE="en_US.UTF-8" \
  LANG="en_US.UTF-8" \
  TERM="xterm" \
  S6_CMD_WAIT_FOR_SERVICES_MAXTIME="0" \
  S6_VERBOSITY=1 \
  S6_STAGE2_HOOK=/docker-mods \
  VIRTUAL_ENV=/lsiopy \
  PATH="/lsiopy/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
  DISPLAY=:1 \
  PERL5LIB=/usr/local/bin \
  START_DOCKER=false \
  PULSE_RUNTIME_PATH=/defaults \
  SELKIES_INTERPOSER=/usr/lib/selkies_input_interposer.so \
  SELKIES_WEBCAM_INTERPOSER=/usr/lib/selkies_v4l2_interposer.so \
  NVIDIA_DRIVER_CAPABILITIES=all \
  DISABLE_DRI3=false \
  SELKIES_ENCODER="h264enc,h265enc,vp8enc,vp9enc,av1enc,jpeg" \
  SELKIES_ENABLE_BASIC_AUTH=false \
  SELKIES_VIDEO_STREAMING_MODE=false \
  SELKIES_ALLOWED_ORIGINS="*" \
  SELKIES_RATE_CONTROL_MODE="crf,cbr" \
  SHELL=/bin/bash \
  __GL_SYNC_TO_VBLANK=0 \
  TITLE=Selkies

# Add local files
COPY --chmod=755 root/ /

EXPOSE 3000
VOLUME /config

ENTRYPOINT ["/init"]
