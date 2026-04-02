import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { getDefaultPassword } from '../utils'

export const resetPassword = sdk.Action.withoutInput(
  'reset-password',

  async ({ effects }) => ({
    name: i18n('Reset Password'),
    description: i18n('Generate a new random password for the Bisq desktop'),
    warning: i18n(
      'Your current password will be invalidated. The service will restart.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const newPassword = getDefaultPassword()
    await storeJson.merge(effects, { password: newPassword })

    return {
      version: '1',
      title: 'Password Reset',
      message: 'Your new password is shown below. The service will restart.',
      result: {
        type: 'single' as const,
        name: 'New Password',
        description: null,
        value: newPassword,
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
