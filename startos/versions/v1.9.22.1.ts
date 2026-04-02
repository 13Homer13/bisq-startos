import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { storeJson } from '../fileModels/store.json'
import { getDefaultPassword } from '../utils'

export const v_1_9_22_1 = VersionInfo.of({
  version: '1.9.22:1',
  releaseNotes: {
    en_US: 'Repackaged for StartOS 0.4.0',
    es_ES: 'Reempaquetado para StartOS 0.4.0',
    de_DE: 'Neu verpackt für StartOS 0.4.0',
    pl_PL: 'Przepakowano dla StartOS 0.4.0',
    fr_FR: 'Reconditionné pour StartOS 0.4.0',
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
          username: 'bisq',
          password: configYaml.password || getDefaultPassword(),
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
