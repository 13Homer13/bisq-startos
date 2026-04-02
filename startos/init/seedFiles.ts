import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { getDefaultPassword } from '../utils'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.write(effects, {
    username: 'bisq',
    password: getDefaultPassword(),
  })
})
