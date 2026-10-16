import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_1_10_9_2 = VersionInfo.of({
  version: '1.10.9:2',
  releaseNotes: {
    en_US: `Security update required to continue trading. Includes the latest Tor release, fixes audited vulnerabilities, validates BSQ swaps and payment flows, and improves reliability.

A Bisq carried over from StartOS 0.3.5.1 opens with its original wallet, trades and accounts. If it had already started over with a new wallet, that wallet is kept on the server rather than deleted.

- The network interface left behind by the StartOS 0.3.5 version of this package is removed and its ports freed. A domain or .onion address you had added to it no longer reaches Bisq; add one to the Bisq Desktop interface instead.
- Set Admin Password asks for confirmation before it replaces an existing password.
- The Bitcoin Connection Mode setting explains each of its options.
- Local node only mode requires Bitcoin 28.4:29, 29.4:16, 30.3:16 or 31.1:16 or later, depending on which Bitcoin version you run, or Bitcoin Knots (pre-RDTS) 29.3:29 or later.`,
    es_ES: `Actualización de seguridad necesaria para seguir operando. Incluye la última versión de Tor, corrige vulnerabilidades auditadas, valida swaps de BSQ y flujos de pago, y mejora la fiabilidad.

Un Bisq traído desde StartOS 0.3.5.1 se abre con su monedero, sus operaciones y sus cuentas originales. Si ya había empezado de cero con un monedero nuevo, ese monedero se conserva en el servidor en lugar de eliminarse.

- Se elimina la interfaz de red que dejó la versión de este paquete para StartOS 0.3.5 y se liberan sus puertos. Un dominio o una dirección .onion que hubiera añadido a ella ya no lleva a Bisq; añada uno a la interfaz «Escritorio Bisq» en su lugar.
- «Establecer contraseña de administrador» pide confirmación antes de reemplazar una contraseña existente.
- El ajuste «Modo de conexión a Bitcoin» explica cada una de sus opciones.
- El modo «Solo nodo local» requiere Bitcoin 28.4:29, 29.4:16, 30.3:16 o 31.1:16 o posterior, según la versión de Bitcoin que use, o Bitcoin Knots (pre-RDTS) 29.3:29 o posterior.`,
    de_DE: `Sicherheitsupdate, das für den weiteren Handel erforderlich ist. Enthält die neueste Tor-Version, behebt geprüfte Schwachstellen, validiert BSQ-Swaps und Zahlungsabläufe und verbessert die Zuverlässigkeit.

Ein von StartOS 0.3.5.1 übernommenes Bisq startet mit seiner ursprünglichen Wallet, seinen Trades und seinen Konten. Hat es bereits mit einer neuen Wallet von vorn begonnen, bleibt diese auf dem Server erhalten, statt gelöscht zu werden.

- Die Netzwerkschnittstelle, die die StartOS-0.3.5-Version dieses Pakets hinterlassen hatte, wird entfernt und ihre Ports werden freigegeben. Eine Domain oder .onion-Adresse, die Sie ihr hinzugefügt hatten, führt nicht mehr zu Bisq; fügen Sie stattdessen eine der Schnittstelle „Bisq Desktop“ hinzu.
- „Admin-Passwort festlegen“ fragt nach einer Bestätigung, bevor ein vorhandenes Passwort ersetzt wird.
- Die Einstellung „Bitcoin-Verbindungsmodus“ erklärt jede ihrer Optionen.
- Der Modus „Nur lokaler Knoten“ erfordert Bitcoin 28.4:29, 29.4:16, 30.3:16 oder 31.1:16 oder neuer, je nachdem, welche Bitcoin-Version Sie betreiben, oder Bitcoin Knots (pre-RDTS) ab 29.3:29.`,
    pl_PL: `Aktualizacja zabezpieczeń wymagana do dalszego handlu. Zawiera najnowszą wersję Tora, naprawia podatności z audytu, weryfikuje swapy BSQ oraz przepływy płatności i poprawia niezawodność.

Bisq przeniesiony ze StartOS 0.3.5.1 otwiera się z pierwotnym portfelem, transakcjami i kontami. Jeśli zaczął już od nowa z nowym portfelem, ten portfel pozostaje na serwerze zamiast zostać usunięty.

- Interfejs sieciowy pozostawiony przez wersję tego pakietu dla StartOS 0.3.5 zostaje usunięty, a jego porty zwolnione. Domena lub adres .onion dodany do niego nie prowadzi już do Bisq; zamiast tego dodaj go do interfejsu „Pulpit Bisq”.
- „Ustaw hasło administratora” prosi o potwierdzenie przed zastąpieniem istniejącego hasła.
- Ustawienie „Tryb połączenia z Bitcoinem” wyjaśnia każdą ze swoich opcji.
- Tryb „Tylko lokalny węzeł” wymaga Bitcoin 28.4:29, 29.4:16, 30.3:16 lub 31.1:16 albo nowszego, zależnie od używanej wersji Bitcoin, albo Bitcoin Knots (pre-RDTS) 29.3:29 lub nowszego.`,
    fr_FR: `Mise à jour de sécurité requise pour continuer à trader. Inclut la dernière version de Tor, corrige les vulnérabilités auditées, valide les swaps BSQ et les flux de paiement, et améliore la fiabilité.

Un Bisq repris de StartOS 0.3.5.1 s’ouvre avec son portefeuille, ses échanges et ses comptes d’origine. S’il avait déjà recommencé avec un nouveau portefeuille, celui-ci est conservé sur le serveur au lieu d’être supprimé.

- L'interface réseau laissée par la version de ce paquet pour StartOS 0.3.5 est supprimée et ses ports libérés. Un domaine ou une adresse .onion que vous y aviez ajouté ne mène plus à Bisq ; ajoutez-en un à l'interface « Bureau Bisq » à la place.
- « Définir le mot de passe administrateur » demande une confirmation avant de remplacer un mot de passe existant.
- Le réglage « Mode de connexion Bitcoin » explique chacune de ses options.
- Le mode « Nœud local uniquement » nécessite Bitcoin 28.4:29, 29.4:16, 30.3:16 ou 31.1:16 ou plus récent, selon la version de Bitcoin que vous utilisez, ou Bitcoin Knots (pre-RDTS) 29.3:29 ou plus récent.`,
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.MultiHost.of(effects, 'main').retire()
    },
    down: IMPOSSIBLE,
  },
})
