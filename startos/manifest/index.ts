import { setupManifest } from '@start9labs/start-sdk'
import { long, short, alertInstall } from './i18n'

export const manifest = setupManifest({
  id: 'bisq',
  title: 'Bisq',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/bisq-startos',
  upstreamRepo: 'https://github.com/bisq-network/bisq',
  marketingUrl: 'https://bisq.network/',
  donationUrl: 'https://bisq.network/contribute/',
  docsUrls: ['https://bisq.wiki/'],
  description: { short, long },
  volumes: ['main'],
  images: {
    main: {
      source: { dockerBuild: {} },
      arch: ['x86_64'],
    },
  },
  alerts: {
    install: alertInstall,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: 'Bisq requires a Bitcoin Core full node for blockchain data',
      optional: false,
      s9pk: null,
    },
  },
})
