import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const getCredentials = sdk.Action.withoutInput(
  'get-credentials',

  async ({ effects }) => ({
    name: i18n('Get Credentials'),
    description: i18n(
      'Retrieve the username and password for the Bisq desktop interface',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const store = await storeJson.read().once()

    return {
      version: '1',
      title: 'Bisq Credentials',
      message: 'Use these credentials to log into the Bisq desktop interface:',
      result: {
        type: 'group' as const,
        value: [
          {
            type: 'single' as const,
            name: 'Username',
            description: null,
            value: store?.username ?? 'bisq',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single' as const,
            name: 'Password',
            description: null,
            value: store?.password ?? 'UNKNOWN',
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
