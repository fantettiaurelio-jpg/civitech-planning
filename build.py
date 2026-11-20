#!/usr/bin/env python3
"""Ricostruisce il file unico dist/civitech-planning.html a partire da src/.
Uso: python3 build.py   (nessuna dipendenza)
Il risultato e' identico al file pubblicato come Artifact."""
import os
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, "src")
rd = lambda n: open(os.path.join(src, n), encoding="utf-8").read()
html = rd("index.html")
link = '<link rel="stylesheet" href="styles.css">'
scr = '<script src="app.js"></script>'
assert html.count(link) == 1 and html.count(scr) == 1, "segnaposto non trovati in src/index.html"
out = html.replace(link, "<style>" + rd("styles.css") + "</style>").replace(scr, "<script>" + rd("app.js") + "</script>")
os.makedirs(os.path.join(here, "dist"), exist_ok=True)
open(os.path.join(here, "dist", "civitech-planning.html"), "w", encoding="utf-8").write(out)
print("scritto dist/civitech-planning.html (%d byte)" % len(out.encode("utf-8")))
