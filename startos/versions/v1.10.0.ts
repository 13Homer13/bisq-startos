import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { storeJson } from '../fileModels/store.json'
import { getDefaultPassword } from '../utils'

export const v_1_10_0 = VersionInfo.of({
  version: '1.10.0:0',
  releaseNotes: {
    en_US: 'Bumps Bisq → 1.10.0 (upstream security hardening release).',
    es_ES:
      'Actualiza Bisq → 1.10.0 (versión upstream de endurecimiento de seguridad).',
    de_DE:
      'Aktualisiert Bisq → 1.10.0 (Upstream-Sicherheitshärtungs-Release).',
    pl_PL:
      'Aktualizuje Bisq → 1.10.0 (upstreamowe wydanie wzmacniające bezpieczeństwo).',
    fr_FR:
      'Passe Bisq → 1.10.0 (version amont de durcissement de sécurité).',
  },
  migrations: {
    up: async ({ effects }) => {
      // Migrate from old 0.3.x format — read old config if present
      const configYaml: { password?: string } | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        // Preserve old password if it existed, otherwise generate new
        await storeJson.merge(effects, {
          PASSWORD: configYaml.password || getDefaultPassword(),
        })
        // Remove old start9 config directory
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
