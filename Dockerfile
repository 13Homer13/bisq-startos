# Stage 1: Install Bisq in Ubuntu where the .deb works
FROM ubuntu:jammy AS builder

ARG BISQ_VERSION=1.9.22
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

# Stage 2: Final image with webtop
FROM ghcr.io/linuxserver/baseimage-kasmvnc:debianbookworm

# Install GTK3, X11 libraries for JavaFX, and wmctrl for window management
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
      xdg-utils \
      wmctrl && \
    rm -rf /var/lib/apt/lists/*

# Copy Bisq from builder
COPY --from=builder /opt/bisq /opt/bisq
RUN ln -s /opt/bisq/bin/Bisq /usr/local/bin/bisq

# Branding, window config — maximize ALL windows by default
RUN echo "Bisq for StartOS is loading ..." > \
      /etc/s6-overlay/s6-rc.d/init-adduser/branding && \
    sed -i '/run_branding() {/,/}/d' /docker-mods && \
    sed -i 's|</applications>|  <application type="normal">\n    <maximized>yes</maximized>\n    <decor>no</decor>\n  </application>\n</applications>|' \
      /etc/xdg/openbox/rc.xml && \
    rm -f /etc/cont-init.d/99-deprecation 2>/dev/null || true

# Cleanup
RUN apt-get autoclean && \
    rm -rf /config/.cache /var/lib/apt/lists/* /var/tmp/* /tmp/*

# Add local files
COPY root/ /

EXPOSE 3000
VOLUME /config

ENTRYPOINT ["/init"]
