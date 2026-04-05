export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Bisq!': 0,
  'Bisq Desktop': 1,
  'Bisq desktop is ready': 2,
  'Bisq desktop is not ready': 3,

  // interfaces.ts
  'Access the Bisq desktop application through your web browser': 4,

  // actions/setPassword.ts
  'Set Admin Password': 5,
  'Generate a new random password for the Bisq admin user desktop': 6,

  // init/seedFiles.ts
  'Set your admin password': 7,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
