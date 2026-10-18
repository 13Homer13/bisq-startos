import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.10.9:4',
  releaseNotes: {
    en_US: `Bisq's memory limit now grows with the server's RAM: it stays at 4 GiB on servers with up to 16 GB and rises to as much as 8 GiB on larger ones.`,
    es_ES: `El límite de memoria de Bisq ahora crece con la RAM del servidor: se mantiene en 4 GiB en servidores de hasta 16 GB y sube hasta 8 GiB en los más grandes.`,
    de_DE: `Das Speicherlimit von Bisq wächst jetzt mit dem Arbeitsspeicher des Servers: Es bleibt bei Servern mit bis zu 16 GB bei 4 GiB und steigt bei größeren auf bis zu 8 GiB.`,
    pl_PL: `Limit pamięci Bisq rośnie teraz wraz z pamięcią RAM serwera: pozostaje na poziomie 4 GiB na serwerach do 16 GB i wzrasta do 8 GiB na większych.`,
    fr_FR: `La limite de mémoire de Bisq suit désormais la RAM du serveur : elle reste à 4 Gio sur les serveurs jusqu’à 16 Go et monte jusqu’à 8 Gio sur les plus grands.`,
  },
  migrations: {},
})
