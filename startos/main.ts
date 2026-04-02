import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Bisq!'))

  const username =
    (await storeJson.read((s) => s.username).const(effects)) || 'bisq'
  const password =
    (await storeJson.read((s) => s.password).const(effects)) || ''

  const mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/config',
    readonly: false,
  })

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    mounts,
    'bisq-sub',
  )

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: {
      // Run /init in its own PID namespace so s6 sees itself as PID 1
      command: ['unshare', '--pid', '--fork', '--mount-proc', '/init'],
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        TITLE: 'Bisq',
        CUSTOM_USER: username,
        PASSWORD: password,
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
