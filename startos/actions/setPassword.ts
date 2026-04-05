import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getDefaultPassword } from '../utils'

export const setPassword = sdk.Action.withoutInput(
  'setPassword',

  async ({ effects }) => {
    return {
      name: i18n('Set Admin Password'),
      description: i18n(
        'Generate a new random password for the Bisq admin user desktop',
      ),
      warning: null,
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
      title: 'Bisq Credentials',
      message: 'Use these credentials to log into the Bisq desktop interface:',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: 'bisq',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: null,
            value: PASSWORD,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
