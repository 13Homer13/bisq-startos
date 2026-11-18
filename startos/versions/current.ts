import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.10.11:2',
  releaseNotes: {
    en_US:
      'Mitigates the Java4Shell vulnerability (CVE-2026-114938) in the Java runtime bundled with Bisq. Details: https://calif.io/java4shell/',
    es_ES:
      'Mitiga la vulnerabilidad Java4Shell (CVE-2026-114938) en el entorno de ejecución de Java incluido con Bisq. Detalles: https://calif.io/java4shell/',
    de_DE:
      'Entschärft die Sicherheitslücke Java4Shell (CVE-2026-114938) in der mit Bisq ausgelieferten Java-Laufzeitumgebung. Details: https://calif.io/java4shell/',
    pl_PL:
      'Ogranicza podatność Java4Shell (CVE-2026-114938) w środowisku uruchomieniowym Javy dołączonym do Bisq. Szczegóły: https://calif.io/java4shell/',
    fr_FR:
      'Atténue la vulnérabilité Java4Shell (CVE-2026-114938) dans l’environnement d’exécution Java fourni avec Bisq. Détails : https://calif.io/java4shell/',
  },
  migrations: { down: IMPOSSIBLE },
})
