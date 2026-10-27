# Laborator de Frecvențe (generator-frecvente)

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versiune:** 3.1.0 · **Ultima actualizare:** 2026-10-27

**Stare:** stabil · **Offline:** complet

Limbile interfeței: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

**Live / demo:** https://chiuta.github.io/generator-frecvente/

![generator-frecvente — captură de ecran / screenshot](screenshot.ro.png)

Instrument audio într-un singur fișier HTML (`index.html`), rulat în browser prin Web Audio API: oscilatoare A/B (inclusiv mod binaural), secvențiator, EQ, sunete ambientale, preseturi de frecvențe, înregistrare, măsurători cu microfonul și un test auditiv orientativ.

**Conținut informativ/educațional; nu înlocuiește sfatul medical.** Categoriile „Solfeggio” și „Schumann” provin din tradiții moderne (New Age) și nu au validare științifică; nu se promit efecte terapeutice. Testul auditiv arată un prag relativ, nu este audiogramă medicală. Presetările cu nume de tip „eliberarea fricii” sau similar nu au efect medical dovedit. Pentru tinitus sau probleme de auz consultă un medic ORL. Ține volumul scăzut și folosește căști cu prudență.

## Utilizare
Deschide `index.html` într-un browser modern (sau varianta publicată prin GitHub Pages). Apasă „Start” pentru a porni sunetul; scurtăturile sunt descrise în pagină (tasta `?`).


## Novități v3.0.0

- **Bibliotecă de scene**: șase secvențe de etape (bătăi binaurale programate) gata făcute, plus scenele proprii; căutare după nume, bandă (Delta, Theta, Alpha, Beta, Gamma) sau etapă; „Încarcă” / „Rulează” folosesc sesiunile programabile existente.
- **Salvare și partajare**: salvezi sesiunea curentă ca scenă (localStorage), exporți/imporți pachete JSON (`gf-scenes`), copiezi un cod scurt `GF1.…` și exporți planul sesiunii ca CSV.
- Informativ și experimental: scenele sunt doar secvențe de frecvențe, nu tratament medical. Nu sunt implementate încă modul de profil auditiv personal și pachetele de presetări din surse externe.

## Date și confidențialitate
Verificat prin audit: pagina nu face cereri de rețea (nu există `fetch`, CDN sau fonturi externe; fonturile sunt încorporate). Microfonul este folosit doar dacă îl activezi explicit, iar semnalul este procesat local. Setările pot fi păstrate în `localStorage`. Singurele link-uri externe sunt cele de sprijin voluntar și site-ul autorului.

## Limitări
Comportamentul depinde de browser (Web Audio, MIDI, AudioWorklet). Există o versiune mai nouă a instrumentului în același portofoliu: [FrequencyLaboratory](https://chiuta.github.io/FrequencyLaboratory/) (linkul apare și în bannerul din pagină).

## Protecția auzului și limitator de volum (3.1.0)

La pornire apare o avertizare cu confirmare („Am înțeles — activează sunetul”): până atunci ieșirea audio este mută. Există un **limitator de volum** (plafon pentru tot sunetul trimis la difuzoare/căști, inclusiv testul auditiv): implicit −6 dB, reglabil de la −30 dB la 0 dB din pastila „LIMITĂ … dB” din antet; limita se păstrează în `localStorage` (`generator-frecvente.volcap`), iar confirmarea doar pe sesiune. Volumul „Master” rămâne în interiorul limitei; fișierele înregistrate (WAV) nu sunt afectate. Nu este dispozitiv medical și nu garantează siguranța auzului: începe cu volumul dispozitivului la minim.

## Vezi și: FrequencyLaboratory

**Generator de frecvențe** (această aplicație) și **FrequencyLaboratory** pornesc din aceeași bază de cod și se suprapun mult. FrequencyLaboratory este versiunea mai nouă și mai completă (sistem modular, profiluri, mai multe instrumente de analiză); Generator de frecvențe păstrează interfața clasică într-un singur panou și adaugă biblioteca de scene (secvențe de etape binaurale). Cele două aplicații NU au fost fuzionate; au chei de stocare separate (prefix propriu) și își pot transfera configurația printr-un link (`#state=`). Alege FrequencyLaboratory pentru funcții complete și acesta pentru scene și o interfață mai simplă.

## Istoric / Changelog

- **3.1.0 — 2026-10-27:** avertizare de protecție a auzului cu confirmare înainte de primul sunet + limitator de volum (plafon, −6 dB implicit, reglabil); notă „vezi și” FrequencyLaboratory; linii Stare/Offline; CHANGELOG.md (anterior: v3.0.0).
- **2.2.9 — 2026-10-23:** fff-kit 1.2.0: ultimele apeluri native `alert`/`confirm`/`prompt` au dispărut: mesajele apar ca notificări accesibile (aria-live, în limba interfeței), iar ștergerea unui favorit prin apăsare lungă cere confirmarea în dialogul `FFF.dialog` al kitului. Etichetele „Mode m / Mode n” sunt acum traduse în toate cele 8 limbi.
- **2.2.7 — 2026-10-22:** Ținte tactile: caseta „arată armonice pe spectrum” stă într-o etichetă de cel puțin 24 px înălțime. Re-audit la 360 și 1366 px (stare inițială, secțiuni extinse, panouri ascunse): nu mai rămâne nicio țintă sub 24 px și niciun text sub 12 px.

### 2.2.6 — 2026-10-22
- fff-kit 1.1.4: ținte tactile și text minim; ținte tactile/text corectate

### 2.2.5 — 2026-10-22
- fff-kit 1.1.2: PBKDF2 600 000 de iterații, protecție anti-clickjacking.

### 2.2.4 — 2026-10-22

chei `localStorage` proprii cu prefixul `generator-frecvente.`, migrate automat din vechile chei `lab_frecv_` (care intrau în coliziune cu FrequencyLaboratory pe aceeași origine: presetările și tema se suprascriau reciproc); eticheta tehnică listează acum cele 8 limbi ale interfeței; câmpurile ascunse pentru fișiere au etichetă în toate limbile; focus de tastatură vizibil; linkul din banner trece pe rând nou pe ecrane înguste. finisaje pentru mobil și accesibilitate: text de cel puțin 12 px și ținte tactile de cel puțin 24 px.

### 2.2.3 — 2026-10-22
- Circa 50 de atribute aria-label/title rămase în engleză (inclusiv în română) sunt traduse în toate cele 8 limbi; numele implicite ale etapelor („Etapa 1/4”) urmează limba interfeței și se actualizează imediat la schimbarea ei.

### 2.2.2 — 2026-10-22
- Titlul panoului „temă · share” este acum tradus în română („partajare”).

- 2.1.1 — 2026-10-19: în banner, link „Deschide configurația curentă în FrequencyLaboratory” (starea curentă în fragmentul `#state=`, filă nouă; fără cereri de rețea).
- 2.1.0 — 2026-10-14: Copie de rezervă și etichetare date (fff-kit).

- 2.0.4 — 2026-10-12: versiunea și data ultimei actualizări sunt afișate în aplicație
- La pornire nu mai apar cele 6 notificări „v2.0: …” (note de versiune care se suprapuneau peste interfață ~10 s, mai ales pe mobil); a rămas doar sugestia unică de primul start. Stiva de notificări este limitată la 3 (cea mai veche se elimină).
- Bibliotecă de presetări: câmp de căutare în toate cele 6 categorii (nume, descriere, frecvență; fără diacritice, mai mulți termeni), cu contor și mesaj pentru zero rezultate; apăsarea unei etichete de categorie golește căutarea. CSP: `script-src` pe hash SHA-256, fără `'unsafe-inline'` (blob: rămâne permis pentru AudioWorklet/worker).
- Conținutul este acum încadrat în `<main>`, bannerul „versiune mai nouă” este `aside`, iar titlurile din panoul de notițe sunt h2 (ordinea h1 → h2 corectă); câmpul BPM al metronomului are etichetă accesibilă. axe-core: 0 violări la 1280 și 360 px.
- Pe ecrane înguste (360 px) panoul de notițe nu mai provoacă derulare orizontală a paginii.
- Notificările (toast) sunt acum regiune `status` pentru cititoare de ecran.
- Numărul de versiune a fost ridicat în titlu, antet și subsol (v2.0 → v2.0.1 → v2.0.2). Versiunea mai nouă rămâne [FrequencyLaboratory](https://chiuta.github.io/FrequencyLaboratory/).

## Licență
MIT, conform antetului din `index.html`; vezi `LICENSE`.

Audit: 2026-10-10
