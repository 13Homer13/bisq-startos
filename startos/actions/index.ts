import { sdk } from '../sdk'
import { configureBitcoinConnection } from './configureBitcoinConnection'
import { configureTorSandbox } from './configureTorSandbox'
import { setPassword } from './setPassword'

export const actions = sdk.Actions.of()
  .addAction(setPassword)
  .addAction(configureBitcoinConnection)
  .addAction(configureTorSandbox)
