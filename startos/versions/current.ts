import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.10.11:1',
  releaseNotes: {
    en_US: `Back up Bisq from StartOS before updating; this update cannot be downgraded.

New Configure Tor Sandbox action: turn off Tor isolation if it stops Tor from starting or your bridges from working.

Permission to use bridge transports in the Tor sandbox survives service restarts.`,
    es_ES: `Haz una copia de seguridad de Bisq desde StartOS antes de actualizar; esta actualización no permite volver a una versión anterior.

Nueva acción Configurar aislamiento de Tor: desactiva el aislamiento si impide iniciar Tor o usar tus puentes.

El permiso para usar transportes de puentes en el aislamiento de Tor se conserva al reiniciar el servicio.`,
    de_DE: `Vor dem Update Bisq über StartOS sichern; nach diesem Update ist keine Rückkehr zu einer älteren Version möglich.

Neue Aktion Tor-Sandbox konfigurieren: Deaktivieren Sie die Isolation, wenn sie den Start von Tor oder die Nutzung Ihrer Bridges verhindert.

Die Erlaubnis, Bridge-Transporte in der Tor-Sandbox zu verwenden, bleibt nach einem Dienstneustart erhalten.`,
    pl_PL: `Przed aktualizacją wykonaj kopię zapasową Bisq w StartOS; po tej aktualizacji powrót do starszej wersji jest niemożliwy.

Nowa akcja Skonfiguruj izolację Tora: wyłącz izolację, jeśli uniemożliwia uruchomienie Tora lub działanie mostów.

Zgoda na używanie transportów mostów w izolacji Tora pozostaje zachowana po ponownym uruchomieniu usługi.`,
    fr_FR: `Sauvegardez Bisq depuis StartOS avant la mise à jour ; après cette mise à jour, le retour à une version antérieure est impossible.

Nouvelle action Configurer l’isolation de Tor : désactivez l’isolation si elle empêche Tor de démarrer ou vos ponts de fonctionner.

L’autorisation d’utiliser les transports des ponts dans l’isolation de Tor est conservée après le redémarrage du service.`,
  },
  migrations: { down: IMPOSSIBLE },
})
