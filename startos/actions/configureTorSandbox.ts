import { defaultUseTorSandbox, storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  useTorSandbox: Value.toggle({
    name: i18n('Enable Tor Sandbox'),
    description: i18n(
      'Keep enabled to isolate Tor from your wallet and keys. Disable only if the sandbox prevents Tor from starting or your bridges cannot run inside it.',
    ),
    default: defaultUseTorSandbox,
  }),
})

export const configureTorSandbox = sdk.Action.withInput(
  'configure-tor-sandbox',
  {
    name: i18n('Configure Tor Sandbox'),
    description: i18n(
      'Enable Tor isolation or turn it off to recover connectivity.',
    ),
    warning: i18n(
      'Changing this setting restarts Bisq. Disabling the sandbox lets a compromised Tor process access your wallet and keys. Re-enable it when the compatibility problem is resolved.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async () => ({
    useTorSandbox:
      (await storeJson.read((store) => store.useTorSandbox).once()) ??
      defaultUseTorSandbox,
  }),
  async ({ effects, input }) =>
    storeJson.merge(effects, { useTorSandbox: input.useTorSandbox }),
)
