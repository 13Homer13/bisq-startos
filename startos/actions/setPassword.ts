import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getDefaultPassword } from '../utils'

export const setPassword = sdk.Action.withoutInput(
  'set-password',

  async ({ effects }) => {
    return {
      name: i18n('Set Admin Password'),
      description: i18n(
        'Generate a new random password for signing in to the Bisq desktop',
      ),
      warning: (await storeJson.read((s) => s.PASSWORD).const(effects))
        ? i18n(
            'Replaces the current Bisq desktop password. Bisq restarts, and the old password stops working.',
          )
        : null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  async ({ effects }) => {
    const PASSWORD = getDefaultPassword()
    await storeJson.merge(effects, { PASSWORD })

    return {
      version: '1',
      title: i18n('Bisq Credentials'),
      message: i18n(
        'Use these credentials to log into the Bisq desktop interface:',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: 'bisq',
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: PASSWORD,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
