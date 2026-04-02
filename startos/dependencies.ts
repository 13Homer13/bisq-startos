import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(
  async ({ effects }) => ({
    bitcoind: {
      kind: 'running' as const,
      healthChecks: [],
      versionRange: '*',
    },
  }),
)
