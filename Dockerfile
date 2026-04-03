# Stage 1: Install Bisq in Ubuntu where the .deb works
FROM ubuntu:jammy AS bisq-builder

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

# Stage 2: Webtop with bloat removed
FROM ghcr.io/linuxserver/baseimage-kasmvnc:debianbookworm AS buildstage

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
      wmctrl && \
    # Remove large unused packages from base image
    DEBIAN_FRONTEND=noninteractive \
    apt-get remove --purge --autoremove -y \
      containerd.io \
      cpp \
      cpp-12 \
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

# Branding, window config — maximize ALL windows, no decorations
RUN echo "Bisq for StartOS is loading ..." > \
      /etc/s6-overlay/s6-rc.d/init-adduser/branding && \
    sed -i '/run_branding() {/,/}/d' /docker-mods && \
    sed -i 's|</applications>|  <application type="normal">\n    <maximized>yes</maximized>\n    <decor>no</decor>\n  </application>\n</applications>|' \
      /etc/xdg/openbox/rc.xml && \
    rm -f /etc/cont-init.d/99-deprecation 2>/dev/null || true && \
    rm -f /kasmbins/kasm_webcam_server 2>/dev/null || true

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
  PATH="/lsiopy/bin:$PATH" \
  DISPLAY=:1 \
  PERL5LIB=/usr/local/bin \
  OMP_WAIT_POLICY=PASSIVE \
  GOMP_SPINCOUNT=0 \
  START_DOCKER=false \
  PULSE_RUNTIME_PATH=/defaults \
  NVIDIA_DRIVER_CAPABILITIES=all

# Add local files
COPY root/ /

EXPOSE 3000
VOLUME /config

ENTRYPOINT ["/init"]
