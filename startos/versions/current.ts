import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.10.9:3',
  releaseNotes: {
    en_US: `Updated the browser desktop to Selkies 2.0.0 with a refreshed LinuxServer base image. The new streaming backend supports additional video codecs and improves clipboard and file transfers. Updated start-sdk to 3.0.6.

[Full Selkies release notes](https://github.com/selkies-project/selkies/releases/tag/2.0.0)`,
    es_ES: `Se actualizó el escritorio del navegador a Selkies 2.0.0 con una imagen base de LinuxServer renovada. El nuevo motor de transmisión admite códecs de vídeo adicionales y mejora el portapapeles y las transferencias de archivos. Se actualizó start-sdk a 3.0.6.

[Notas completas de Selkies](https://github.com/selkies-project/selkies/releases/tag/2.0.0)`,
    de_DE: `Der Browser-Desktop wurde auf Selkies 2.0.0 mit einem aktualisierten LinuxServer-Basisimage umgestellt. Das neue Streaming-Backend unterstützt zusätzliche Video-Codecs und verbessert die Zwischenablage und Dateiübertragungen. start-sdk wurde auf 3.0.6 aktualisiert.

[Vollständige Selkies-Versionshinweise](https://github.com/selkies-project/selkies/releases/tag/2.0.0)`,
    pl_PL: `Zaktualizowano pulpit w przeglądarce do Selkies 2.0.0 z odświeżonym obrazem bazowym LinuxServer. Nowy mechanizm strumieniowania obsługuje dodatkowe kodeki wideo oraz ulepsza schowek i przesyłanie plików. Zaktualizowano start-sdk do 3.0.6.

[Pełne informacje o wydaniu Selkies](https://github.com/selkies-project/selkies/releases/tag/2.0.0)`,
    fr_FR: `Le bureau dans le navigateur passe à Selkies 2.0.0 avec une image de base LinuxServer actualisée. Le nouveau moteur de diffusion prend en charge des codecs vidéo supplémentaires et améliore le presse-papiers et les transferts de fichiers. start-sdk a été mis à jour vers la version 3.0.6.

[Notes de version complètes de Selkies](https://github.com/selkies-project/selkies/releases/tag/2.0.0)`,
  },
  migrations: {},
})
