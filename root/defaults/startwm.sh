#!/usr/bin/env bash
export NO_AT_BRIDGE=1

# Clean up stale lock files from previous crashes
rm -f /config/.local/share/Bisq/.lock 2>/dev/null
rm -f /config/.local/share/Bisq/bisq.pid 2>/dev/null
find /config/.local/share/Bisq -name "*.tmp" -delete 2>/dev/null
find /config/.local/share/Bisq -name "*.lck" -delete 2>/dev/null

# Write bisq.properties
BISQ_PROPS="/config/.local/share/Bisq/bisq.properties"
mkdir -p "$(dirname "$BISQ_PROPS")"

cat > "$BISQ_PROPS" << PROPS
useTorForBtc=false
btcNodes=
bannedSeedNodes=
bannedBtcNodes=
bannedPriceRelayNodes=
PROPS

# Kill any leftover Bisq processes
pkill -f "/opt/bisq" 2>/dev/null
sleep 1

# Launch Bisq
/opt/bisq/bin/Bisq &

# Background loop: keep trying to maximize the Bisq window
(
  for i in $(seq 1 60); do
    sleep 2
    # Find and maximize any Bisq window
    wmctrl -l 2>/dev/null | grep -i -E "bisq|Bisq" | while read -r wid rest; do
      wmctrl -i -r "$wid" -b add,maximized_vert,maximized_horz
      wmctrl -i -r "$wid" -b remove,above
    done
    # Also try maximizing by window class
    wmctrl -r "Bisq" -b add,maximized_vert,maximized_horz 2>/dev/null
  done
) &

# Start the window manager
/usr/bin/openbox-session
