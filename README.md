# Laborator de Frecvențe (generator-frecvente)

Instrument audio într-un singur fișier HTML (`index.html`), rulat în browser prin Web Audio API: oscilatoare A/B (inclusiv mod binaural), secvențiator, EQ, sunete ambientale, preseturi de frecvențe, înregistrare, măsurători cu microfonul și un test auditiv orientativ.

**Conținut informativ/educațional; nu înlocuiește sfatul medical.** Categoriile „Solfeggio” și „Schumann” provin din tradiții moderne (New Age) și nu au validare științifică; nu se promit efecte terapeutice. Testul auditiv arată un prag relativ, nu este audiogramă medicală. Pentru tinitus sau probleme de auz consultă un medic ORL. Ține volumul scăzut și folosește căști cu prudență.

## Utilizare
Deschide `index.html` într-un browser modern (sau varianta publicată prin GitHub Pages). Apasă „Start” pentru a porni sunetul; scurtăturile sunt descrise în pagină (tasta `?`).

## Date și confidențialitate
Verificat prin audit: pagina nu face cereri de rețea (nu există `fetch`, CDN sau fonturi externe; fonturile sunt încorporate). Microfonul este folosit doar dacă îl activezi explicit, iar semnalul este procesat local. Setările pot fi păstrate în `localStorage`. Singurele link-uri externe sunt cele de sprijin voluntar și site-ul autorului.

## Limitări
Comportamentul depinde de browser (Web Audio, MIDI, AudioWorklet). Există o versiune mai nouă a instrumentului în același portofoliu (FrequencyLaboratory).

## Licență
CC0 1.0 (domeniu public), conform antetului din `index.html`; vezi `LICENSE`.

Audit: 2026-10-10
