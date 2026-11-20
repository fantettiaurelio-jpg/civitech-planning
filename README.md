# Civitech Planning: pacchetto di consegna

App web (una sola pagina HTML/CSS/JavaScript, senza framework) per un tecnico caldaie. Carica il planning giornaliero in PDF, mostra le schede cliente, permette di annotare lavoro fatto e pagamenti, tiene l'archivio dei giorni passati, avvisa prima di ogni intervento e stampa il planning aggiornato con la stessa impostazione dell'originale.

Stato: versione **v14** (etichetta visibile in alto a destra nell'app). Questo pacchetto è una copia: l'app originale pubblicata non è stata modificata.

## Contenuto

```
README.md                       questo file
build.py                        ricostruisce dist/civitech-planning.html da src/
src/
  index.html                    struttura della pagina (head con librerie esterne + body)
  styles.css                    tutti gli stili (token colore in :root)
  app.js                        tutta la logica (circa 820 righe, un unico blocco IIFE)
dist/
  civitech-planning.html        file unico, identico a quello pubblicato (CSS e JS inclusi)
config/
  artifact.json                 titolo, capabilities, librerie esterne con versione, percorsi database, chiavi localStorage
data/
  export/                       esportazione reale del database al 18/11/2026 (DATI PERSONALI DEI CLIENTI)
    plannings/<id>.json         planning del 18/11/2026 con note, pagamenti, stato fatta
    meta/rubrica.json           rubrica clienti
  sample/                       esempi anonimi degli stessi documenti
  schema/                       JSON Schema di planning, rubrica, impostazioni
  sample-input/                 il PDF originale del planning usato per i test del lettore (DATI PERSONALI)
docs/
  FUNZIONALITA.md               elenco di tutte le funzioni implementate, con i nomi delle funzioni nel codice
  ARCHITETTURA.md               come è fatta l'app, stato, salvataggio, lettura PDF, stampa, allarmi, punti da sostituire per portarla fuori da Claude
tests/
  parse-planning.mjs            prova del lettore PDF sul planning di esempio
  smoke-save.js                 prova nel browser: nota, pagamento, Salva, con dati del database in sola lettura
```

## Come si usa

- **Aprire l'app in locale**: aprire `dist/civitech-planning.html` in un browser. Fuori da Claude l'app parte, ma senza database né lettura automatica di scansioni né dettatura né scaricamento del PDF: salva solo nel browser (localStorage). Il lettore del planning in PDF con testo funziona (usa pdf.js da internet).
- **Modificare**: lavorare su `src/` e lanciare `python3 build.py` (nessuna dipendenza) per rigenerare `dist/civitech-planning.html`.
- **Pubblicare di nuovo come app Claude**: il file di `dist/` è esattamente quello che la piattaforma Artifact di Claude ha ricevuto. Il file inizia con `<title>`, senza `<html>`/`<head>`/`<body>`: la piattaforma aggiunge lo scheletro. Le capabilities da dichiarare sono in `config/artifact.json`.
- **Portare l'app fuori da Claude**: leggere `docs/ARCHITETTURA.md`, sezione "Punti da sostituire". Le dipendenze dalla piattaforma sono poche e isolate.

## Avvertenze

- `data/export/` e `data/sample-input/` contengono nomi, indirizzi e telefoni di clienti reali. Prima di condividere il pacchetto con terzi, valutare se eliminare quelle due cartelle e usare `data/sample/`.
- Le librerie esterne (pdf.js, jsPDF, Google Fonts) sono caricate da internet; le versioni sono fissate in `config/artifact.json`.
- Non ci sono immagini né altri file: le icone sono SVG scritti nel codice (oggetto `ICON` in `app.js`).

## Richieste dell'utente non ancora realizzate

1. **Menu a tendina in alto a sinistra** con dentro: Nuovo planning, Stampa e il timer di avvertimento dell'orario. È stato chiesto il 18/11/2026 alle 10:32. Oggi quelle tre funzioni sono: pulsanti "Nuovo planning" e "Stampa" sopra l'elenco delle schede (`oggiHTML`) e il pannello "Allarme prima dell'intervento" (`alarmPanel`). Da fare: spostarli in un menu (suggerimento: `<details>` o pulsante hamburger in `hdrHTML`).
2. **Allarmi a app chiusa**: oggi suonano solo con l'app aperta. Servirebbero notifiche push (PWA con service worker) o un'app nativa.

## Cronologia sintetica delle versioni

- Creazione: lettura planning con AI su scansione, schede, Maps/telefono, note, contanti/POS, totali, stampa, schermata d'ingresso.
- Planning nuovo sostituisce quello attuale; archivio con ricerca e "Riprendi"; avvisi di dati cliente cambiati; nuova scheda; "annullata da ufficio".
- Tema bianco; stampa con impostazione dell'originale (riquadri, intestazione, colonne), note e pagamento stampati.
- Note sempre visibili sulla scheda; colori rosso (da fare) e verde (fatta) con Salva; controllo orari e allarmi regolabili.
- Salvataggio locale prima, poi online con indicatore di stato e diagnostica; corretto il bug dei dati del database in sola lettura (v14).
- Lettura diretta del PDF con testo senza AI (v11).
