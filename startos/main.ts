import { totalmem } from 'node:os'
import {
  defaultBitcoinConnectionMode,
  storeJson,
} from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  bisqNetworkFallbackNodes,
  getBitcoinPeerBridgeAddress,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Bisq!'))

  const PASSWORD = await storeJson.read((s) => s.PASSWORD).const(effects)
  if (!PASSWORD) {
    throw new Error('No password in store.json')
  }

  const bitcoinConnectionMode =
    (await storeJson
      .read((store) => store.bitcoinConnectionMode)
      .const(effects)) ?? defaultBitcoinConnectionMode
  const localOnly = bitcoinConnectionMode === 'local-only'

  // Local-only mode uses Bitcoin's whitelisted, bridge-only peer listener.
  // Resolve it reactively so installing Bitcoin later or moving the binding
  // heals Bisq without restarts for routine Bitcoin updates.
  const bitcoinPeerAddress = localOnly
    ? await getBitcoinPeerBridgeAddress(effects)
    : null

  if (localOnly && !bitcoinPeerAddress) {
    throw new Error(
      'Local Bitcoin node mode is enabled, but the Bitcoin peer interface is unavailable. Start Bitcoin or enable Bisq network fallback.',
    )
  }

  const heapMiB = Math.max(
    4096,
    Math.min(8192, Math.floor((totalmem() / 1024 ** 2 - 6144) / 4)),
  )

  const subcontainer = sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/config',
      readonly: false,
    }),
    'bisq-sub',
  )

  return sdk.Daemons.of(effects)
    .addOneshot('bitcoin-node-ready', {
      subcontainer,
      exec: {
        command: localOnly
          ? ['/usr/local/bin/check-bitcoin-node']
          : ['/usr/bin/true'],
        env: {
          ...(bitcoinPeerAddress && {
            BITCOIND_PEER_ADDR: bitcoinPeerAddress,
          }),
        },
      },
      requires: [],
    })
    .addDaemon('primary', {
      subcontainer,
      exec: {
        command: sdk.useEntrypoint(),
        runAsInit: true,
        env: {
          PUID: '1000',
          PGID: '1000',
          TZ: 'Etc/UTC',
          TITLE: 'Bisq',
          CUSTOM_USER: 'bisq',
          PASSWORD,
          JAVA_TOOL_OPTIONS: `-Xmx${heapMiB}m`,
          BITCOIN_CONNECTION_MODE: bitcoinConnectionMode,
          BISQ_NETWORK_FALLBACK_NODES: bisqNetworkFallbackNodes,
          ...(bitcoinPeerAddress && {
            BITCOIND_PEER_ADDR: bitcoinPeerAddress,
          }),
          S6_CMD_WAIT_FOR_SERVICES_MAXTIME: '0',
          S6_VERBOSITY: '1',
          NO_DECOR: 'true',
          DISABLE_OPEN_TOOLS: 'true',
          DISABLE_SUDO: 'true',
          DISABLE_TERMINALS: 'true',
          SELKIES_COMMAND_ENABLED: 'false',
          SELKIES_UI_SIDEBAR_SHOW_APPS: 'false',
          SELKIES_UI_SIDEBAR_SHOW_FILES: 'true',
          SELKIES_FILE_TRANSFERS: 'upload,download',
        },
      },
      ready: {
        display: i18n('Bisq Desktop'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('Bisq desktop is ready'),
            errorMessage: i18n('Bisq desktop is not ready'),
          }),
      },
      requires: ['bitcoin-node-ready'],
    })
})
