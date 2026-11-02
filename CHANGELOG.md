# Jurnal de modificări — Frequency Laboratory (generator-frecvente)

Format: [SemVer](https://semver.org/lang/ro/) MAJOR.MINOR.PATCH.

## 3.2.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 3.2.0 — 2026-11-01

- Corectat: adaptorul «Trimite la…» nu mai aruncă eroare când kitul FFF lipsește (gardian pe fiecare bloc; găsit de testul «fără kit» din CI).

Nou: «Trimite la…» (fff-kit, modulul FFF.bridge) — după orice export de fișier (GPX, ICS, CSV, Markdown) apare butonul «Trimite la…» către aplicațiile compatibile, iar importul de fișiere al aplicației primește plicuri .fff.json trimise de ele, cu confirmare înainte de import. Fără rețea, fără telemetrie.

## 3.1.0 — 2026-10-27 (anterior: v3.0.0)

Stare: stabil · Offline: complet

Aplicat după mini-recenzia din 2026-10-27 (funcții noi → versiune minoră).

### Adăugat
- **Avertizare de protecție a auzului la pornire, cu confirmare înainte de primul sunet.** Dialog modal (8 limbi, accesibil, axe 0 violări). Până la confirmare, ieșirea audio este mută (câștig 0 pe lanțul de ieșire), indiferent de ce pornește aplicația. Confirmarea se păstrează doar pe sesiune (`sessionStorage`), deci reapare la următoarea deschidere.
- **Limitator de volum (plafon) pe ieșire.** Toate `AudioContext`-urile paginii sunt trecute printr-un lanț intrare → WaveShaper (taie la ±1) → câștig-plafon → difuzoare/căști; implicit −6 dB, reglabil de la −30 dB la 0 dB din pastila „LIMITĂ … dB” din antet sau din dialog. Limita se păstrează în `localStorage` (`generator-frecvente.volcap`). Se aplică și testului auditiv și generatoarelor de test; nu afectează fișierele WAV înregistrate. Fără rețea, fără biblioteci.
- Notă „vezi și” FrequencyLaboratory în README (8 limbi), cu explicația diferenței dintre cele două aplicații. Aplicațiile NU au fost fuzionate.
- README (8 limbi): linii „Stare: stabil” și „Offline: complet”; secțiuni noi; istoric.
- Test nou `tests/hearing-guard.test.mjs` (30 verificări: mut înainte de confirmare, plafon măsurat cu AnalyserNode, persistență, 8 limbi, axe, fără rețea).

### Modificat
- Testele existente deschid aplicația cu avertizarea deja confirmată (`sessionStorage`), altfel dialogul modal le blochează clicurile.

### Neimplementat
- Fuziunea cu FrequencyLaboratory (recomandarea din recenzie): omisă intenționat, conform regulilor lotului; doar notă „vezi și”.
- Limitatorul nu poate controla volumul hardware al dispozitivului/căștilor; avertizarea îl recomandă la minim.

## 3.0.0
- Versiunea anterioară (vezi istoricul din README).
