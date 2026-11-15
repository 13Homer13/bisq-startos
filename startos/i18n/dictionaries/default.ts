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
  'Generate a new random password for signing in to the Bisq desktop': 6,

  // init/seedFiles.ts
  'Set your admin password': 7,

  // actions/setPassword.ts
  'Bisq Credentials': 8,
  'Use these credentials to log into the Bisq desktop interface:': 9,
  Username: 10,
  Password: 11,
  'Replaces the current Bisq desktop password. Bisq restarts, and the old password stops working.': 19,

  // actions/configureBitcoinConnection.ts
  'Bitcoin Connection Mode': 12,
  "- Local node only: Bisq connects only to the Bitcoin service on this server, and does not start while it is unreachable.\n- Bisq network fallback: Bisq uses remote Bitcoin peers provided by the Bisq network, over Tor. The Bitcoin service is not needed, but those peers are asked about your wallet's addresses.": 13,
  'Local node only (recommended)': 14,
  'Bisq network fallback': 15,
  'Configure Bitcoin Connection': 16,
  'Choose whether Bisq requires your local Bitcoin node or uses the Bisq network fallback.': 17,

  // actions/configureTorSandbox.ts
  'Enable Tor Sandbox': 20,
  'Keep enabled to isolate Tor from your wallet and keys. Disable only if the sandbox prevents Tor from starting or your bridges cannot run inside it.': 21,
  'Configure Tor Sandbox': 22,
  'Enable Tor isolation or turn it off to recover connectivity.': 23,
  'Changing this setting restarts Bisq. Disabling the sandbox lets a compromised Tor process access your wallet and keys. Re-enable it when the compatibility problem is resolved.': 24,

  // dependencies.ts
  'Enable bloom filters so Bisq can use your Bitcoin service': 18,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
