# FOA — Brand Specification for PayTjek Demo

## Organisation
- **Fuldt navn:** FOA – Fag og Arbejde
- **Medlemmer:** ~163.000
- **Primær sektor:** Kommunalt og regionalt ansatte (offentlig velfærd)
- **Nøglefaggrupper:** SOSU-hjælpere, SOSU-assistenter, pædagogmedhjælpere, dagplejere, ambulancepersonale, køkken/kantine, brand/redning, rengøring
- **Tagline:** "Sammen gør vi forskellen"
- **Website:** foa.dk

---

## Farver

| Rolle | Navn | HEX | RGB | Bemærkning |
|-------|------|-----|-----|------------|
| **Primær** | FOA Rød | `#E2001A` | 226, 0, 26 | Logofarve, CTA-knapper, accent |
| **Sekundær mørk** | FOA Mørkerød | `#B3001A` | 179, 0, 26 | Hover-states, mørke sektioner |
| **Baggrund lys** | FOA Lys rosa | `#FFF0F1` | 255, 240, 241 | Baggrund, cards |
| **Tekst primær** | Mørk | `#1A1A1A` | 26, 26, 26 | Brødtekst |
| **Tekst sekundær** | Grå | `#666666` | 102, 102, 102 | Labels, meta |
| **Hvid** | Hvid | `#FFFFFF` | 255, 255, 255 | Baggrund |

> FOA's røde farve er deres identitetsfarve og bruges konsekvent i logo, overskrifter og vigtige budskaber. Den røde farve signalerer kraft, fællesskab og handlekraft.

---

## Typografi

| Brug | Skrifttype | Vægt | Web-fallback |
|------|-----------|------|--------------|
| **Overskrifter** | FOA's custom font (proprietær) | Bold / Black | `"Source Sans Pro", "Segoe UI", sans-serif` |
| **Brødtekst** | FOA's custom font | Regular / Light | `"Source Sans Pro", "Segoe UI", sans-serif` |

> FOA har to dedikerede skrifttyper i deres designguide. Til demo-appen bruger vi en tilnærmelse: **Source Sans Pro** (Google Fonts) som fallback — den har tilsvarende klarhed og professionelt udtryk.

---

## Logo
- **Fil i repo:** `src/assets/foa-logo.png` ✅ (allerede til stede)
- **Format:** Hvid tekst "FOA" i rød rund cirkel med "Fag og Arbejde" undertekst
- **Positiv version:** Rød cirkel + hvid tekst (primær)
- **Negativ version:** Hvid cirkel + rød tekst (til mørke baggrunde)
- **SVG tilgængelig:** Via foa.dk (`foa_logo_mobile.svg`, `foa_logo_desktop.svg`)

---

## Demo-persona

| Felt | Værdi |
|------|-------|
| **Navn** | Maria Sørensen |
| **Stilling** | Social- og sundhedshjælper |
| **Arbejdsgiver** | Odense Kommune, Hjemmeplejen Vest |
| **Overenskomst** | KL/FOA overenskomst for SOSU-personale |
| **Anciennitet** | 7 år |
| **Trin** | Løntrin 23 |

---

## Demo-fejl i lønseddel

| Felt | Værdi |
|------|-------|
| **Fejltype** | Manglende nattillæg |
| **Beskrivelse** | Nattevagt 23:00–07:00 d. 14. oktober er registreret som aftenvagt. Nattillæg á 32,56 kr./time for 8 timer = **260,48 kr. mangler** |
| **Overenskomstref.** | KL/FOA SOSU-overenskomst §15, stk. 2 — Natarbejde (kl. 23:00–06:00) |
| **Kontekst** | Vagtskifte-fejl er den mest typiske lønfejl for SOSU'er — vagter der strækker sig over kl. 23 bliver ofte registreret som rene aftenvagter i vagtplansystemet |

---

## Lønseddel-data (demo)

### Grunddata
- Bruttoløn: 28.942 kr./md
- Pension (arbejdsgiver 13,56%): 3.924 kr.
- Pension (eget bidrag 5,44%): 1.574 kr.
- ATP: 99,00 kr.
- A-skat: 8.214 kr.
- AM-bidrag: 2.315 kr.
- Udbetalt: 16.840 kr.

### Tillæg (oktober 2025)
- Kvalifikationstillæg: 1.247 kr.
- Aftentillæg (kl. 17-23): 4 vagter × 6 timer × 27,13 kr. = 651,12 kr.
- Weekendtillæg: 2 vagter × 8 timer × 42,37 kr. = 677,92 kr.
- ~~Nattillæg (kl. 23-07): 1 vagt × 8 timer × 32,56 kr. = 260,48 kr.~~ **← MANGLER**

---

## USP / Pitch-vinkel til FOA

### Primær pain: Medlemsrelevans
FOA bløder medlemmer til billigere alternativer. De har brug for at demonstrere konkret, håndgribelig værdi af medlemskabet.

### PayTjek-framing for FOA:
> "Dine medlemmer har Danmarks mest komplicerede lønsedler — og ingen værktøjer til at forstå dem. PayTjek gør FOA-medlemskabet til noget der betaler sig selv tilbage."

### Nøglepunkter:
1. **Kompleksitet:** En SOSU'er kan have 8-10 tillægslinjer per lønseddel (aften, nat, weekend, helligdag, kvalifikation, funktion, anciennitet, overarbejde, forskudt tid)
2. **Vagtplan-integration:** FOA-medlemmer arbejder i skift — automatisk krydstjek mellem planlagte vagter og faktisk udbetaling er en game-changer
3. **Kontrakttjek:** Mange SOSU'er er usikre på om de er indplaceret på det rigtige løntrin efter videreuddannelse
4. **Volumen:** 163.000 medlemmer × typisk lønfejl-rate = massiv potentiel værdi

### Demo-fokus (3 søjler):
| Søjle | FOA-specifik vinkel |
|-------|---------------------|
| **Lønseddel** | Tillægs-jungle: nat, aften, weekend, helligdag — fanger den fejl der koster mest |
| **Kontrakt** | Løntrin og kvalifikationstillæg — er du indplaceret korrekt efter din uddannelse? |
| **Vagtplan** | ICS-sync fra vagtplansystemet → automatisk tjek: stemmer dine vagter med din løn? |
