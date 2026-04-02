export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Bisq!': 0,
  'Bisq Desktop': 1,
  'Bisq desktop is ready': 2,
  'Bisq desktop is not ready': 3,

  // interfaces.ts
  'Access the Bisq desktop application through your web browser': 4,

  // actions/getCredentials.ts
  'Get Credentials': 5,
  'Retrieve the username and password for the Bisq desktop interface': 6,

  // actions/resetPassword.ts
  'Reset Password': 7,
  'Generate a new random password for the Bisq desktop': 8,
  'Your current password will be invalidated. The service will restart.': 9,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
