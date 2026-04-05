import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Bisq!'))

  const PASSWORD = await storeJson.read((s) => s.PASSWORD).const(effects)
  if (!PASSWORD) {
    throw new Error('No password in store.json')
  }

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'main' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/config',
        readonly: false,
      }),
      'bisq-sub',
    ),
    exec: {
      command: ['/init'],
      runAsInit: true,
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        TITLE: 'Bisq',
        CUSTOM_USER: 'bisq',
        PASSWORD,
        S6_CMD_WAIT_FOR_SERVICES_MAXTIME: '0',
        S6_VERBOSITY: '1',
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
    requires: [],
  })
})
