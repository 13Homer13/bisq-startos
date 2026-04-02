import { sdk } from '../sdk'
import { getCredentials } from './getCredentials'
import { resetPassword } from './resetPassword'

export const actions = sdk.Actions.of()
  .addAction(getCredentials)
  .addAction(resetPassword)
