import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.10.12:0',
  releaseNotes: {
    en_US: `Back up Bisq from StartOS before updating. This update cannot be downgraded and is required to continue trading.

- Fixes Java4Shell (CVE-2026-114938) in the bundled Java runtime and updates Tor to 0.4.9.16 with security fixes.
- Adds stablecoin payments in USD markets and custom payment methods for fiat trades.
- Publishes mediated payouts automatically after both traders accept the result.

[Full Bisq 1.10.12 release notes](https://github.com/bisq-network/bisq/releases/tag/v1.10.12)`,
    es_ES: `Haz una copia de seguridad de Bisq desde StartOS antes de actualizar. Esta actualización no permite volver a una versión anterior y es necesaria para seguir operando.

- Corrige Java4Shell (CVE-2026-114938) en el entorno de Java incluido y actualiza Tor a la versión 0.4.9.16 con correcciones de seguridad.
- Añade pagos con monedas estables en los mercados en USD y métodos de pago personalizados para operaciones con moneda fiduciaria.
- Publica automáticamente los pagos de mediación cuando ambas partes aceptan el resultado.

[Notas completas de Bisq 1.10.12](https://github.com/bisq-network/bisq/releases/tag/v1.10.12)`,
    de_DE: `Sichern Sie Bisq vor dem Update über StartOS. Nach dem Update ist keine Rückkehr zu einer älteren Version möglich. Das Update ist erforderlich, um weiter zu handeln.

- Behebt Java4Shell (CVE-2026-114938) in der mitgelieferten Java-Laufzeit und aktualisiert Tor auf Version 0.4.9.16 mit Sicherheitskorrekturen.
- Ergänzt Stablecoin-Zahlungen auf USD-Märkten und benutzerdefinierte Zahlungsmethoden für den Handel mit Fiatwährungen.
- Veröffentlicht Auszahlungen nach einer Mediation automatisch, sobald beide Handelsparteien das Ergebnis akzeptiert haben.

[Vollständige Versionshinweise zu Bisq 1.10.12](https://github.com/bisq-network/bisq/releases/tag/v1.10.12)`,
    pl_PL: `Przed aktualizacją wykonaj kopię zapasową Bisq w StartOS. Po aktualizacji nie można wrócić do starszej wersji. Aktualizacja jest wymagana, aby nadal handlować.

- Usuwa podatność Java4Shell (CVE-2026-114938) w dołączonym środowisku Java i aktualizuje Tora do wersji 0.4.9.16 z poprawkami bezpieczeństwa.
- Dodaje płatności stablecoinami na rynkach USD i niestandardowe metody płatności w transakcjach w walutach fiducjarnych.
- Automatycznie publikuje wypłatę po mediacji, gdy obie strony zaakceptują jej wynik.

[Pełne informacje o wydaniu Bisq 1.10.12](https://github.com/bisq-network/bisq/releases/tag/v1.10.12)`,
    fr_FR: `Sauvegardez Bisq depuis StartOS avant la mise à jour. Le retour à une version antérieure est impossible après cette mise à jour, qui est nécessaire pour continuer à trader.

- Corrige Java4Shell (CVE-2026-114938) dans l’environnement Java fourni et met Tor à jour vers la version 0.4.9.16 avec des correctifs de sécurité.
- Ajoute les paiements en stablecoins sur les marchés en USD et des moyens de paiement personnalisés pour les transactions en monnaie fiduciaire.
- Publie automatiquement le paiement issu d’une médiation dès que les deux parties en acceptent le résultat.

[Notes de version complètes de Bisq 1.10.12](https://github.com/bisq-network/bisq/releases/tag/v1.10.12)`,
  },
  migrations: { down: IMPOSSIBLE },
})
