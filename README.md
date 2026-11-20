# Civitech Planning: versione indipendente da Claude

App installabile (PWA) + piccolo server per i colleghi. Nessuna dipendenza da installare: serve solo **Node 18 o più recente** su un computer/server sempre acceso.

## 1. Avviare il server
```
cd standalone
node server.js adduser aurelio 1234     # un comando per ogni collega (nome + PIN di almeno 4 caratteri)
node server.js adduser marco 5678
PORT=8080 node server.js
```
Ogni collega ha il proprio archivio (data/store/<nome>/). Backup = copiare la cartella `data/`.

## 2. Metterlo su internet con HTTPS (necessario per installare l'app sul telefono)
Opzioni semplici: un piccolo hosting/VPS con Caddy (`caddy reverse-proxy --from planning.tuodominio.it --to localhost:8080`), oppure Cloudflare Tunnel, oppure Render/Railway/Fly.io (servizio Node con disco persistente, impostare `DATA_DIR`).

## 3. Aggiornamenti per tutti i colleghi
Sostituire i file in `public/` sul server: al successivo avvio l'app dei colleghi scarica la nuova versione da sola (il service worker prova prima la rete). Se serve forzare, cambiare `VERSION` in `public/sw.js`.

## 4. Telefono: "app" nella schermata Home
Aprire l'indirizzo in Chrome → menu ⋮ → **Installa app** (o "Aggiungi a schermata Home"). Su iPhone: Safari → Condividi → **Aggiungi alla schermata Home**.

## 5. APK vero e proprio
Non è stato possibile generarlo e firmarlo qui (manca l'Android SDK e la rete). Con il server già online con HTTPS, la strada più semplice:
- **PWABuilder** (pwabuilder.com): inserire l'indirizzo, scegliere "Android" → scarica il pacchetto con APK/AAB firmato.
- oppure **Bubblewrap**: `npm i -g @bubblewrap/cli && bubblewrap init --manifest https://TUO-DOMINIO/manifest.webmanifest && bubblewrap build` (richiede JDK e Android SDK, li scarica da solo).
L'APK è un contenitore dell'app online: gli aggiornamenti arrivano ai colleghi senza reinstallare.

## Limiti noti
- Le librerie (pdf.js, jsPDF, font) arrivano da CDN e vengono salvate dal service worker dopo il primo avvio. Per averle sul proprio server, scaricarle in `public/vendor/` e cambiare i link in `index.html`.
- Lettura di scansioni/foto con AI non disponibile fuori da Claude (i PDF con testo funzionano). Serve un servizio OCR/AI a scelta.
- Gli allarmi suonano solo con l'app aperta.
- Senza rete i dati restano sul telefono; si risincronizzano riaprendo l'app online.
