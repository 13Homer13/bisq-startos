import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const defaultBitcoinConnectionMode = 'local-only'
export const defaultUseTorSandbox = true

const shape = z.looseObject({
  PASSWORD: z.string().optional().catch(undefined),
  bitcoinConnectionMode: z
    .enum(['local-only', 'bisq-network'])
    .catch(defaultBitcoinConnectionMode),
  useTorSandbox: z.boolean().catch(defaultUseTorSandbox),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
