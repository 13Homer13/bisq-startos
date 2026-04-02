import { utils } from '@start9labs/start-sdk'

export const uiPort = 3000

export function getDefaultPassword(): string {
  return utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 })
}
