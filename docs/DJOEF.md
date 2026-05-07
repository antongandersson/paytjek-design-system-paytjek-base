# Djøf — Brand Specification for PayTjek Demo

## Organisation
- **Fuldt navn:** Djøf – Danmarks Jurist- og Økonomforbund
- **Medlemmer:** ~110.000
- **Primær sektor:** Stat, kommuner, regioner, privat erhvervsliv (jura, økonomi, politik, ledelse)
- **Nøglefaggrupper:** Jurister, økonomer, politologer, samfundsvidenskabelige kandidater, civiløkonomer, ledere i offentlig/privat sektor
- **Website:** djoef.dk

---

## Farver

> Kilde: Djøf rebrandede i 2022 med Boye & Spellerberg. Det nye logo er **sort/hvidt** med en bred farvepalet af jordfarver + accent af gul og pink. Brandfetch rapporterer en historisk blå (#0054CE) som digital primærfarve, men det nye brand bruger jordtoner.

| Rolle | Navn | HEX | RGB | Bemærkning |
|-------|------|-----|-----|------------|
| **Logo (sort)** | Djøf Sort | `#1D1D1B` | 29, 29, 27 | Logoets primære farve — sort tekst |
| **Digital accent** | Djøf Blå | `#0054CE` | 0, 84, 206 | Digital primærfarve (web/app UI) |
| **Mørk base** | Djøf Deep | `#06235F` | 6, 35, 95 | Mørke sektioner, nav-baggrund |
| **Jordtone varm** | Djøf Terracotta | `#C4704B` | 196, 112, 75 | Varm jordfarve accent |
| **Jordtone sand** | Djøf Sand | `#E8D5C0` | 232, 213, 192 | Lys baggrund, cards |
| **Accent gul** | Djøf Gul | `#F2C94C` | 242, 201, 76 | Pop-accent, highlights |
| **Accent pink** | Djøf Pink | `#E8588C` | 232, 88, 140 | Pop-accent, sekundær |
| **Tekst primær** | Mørk | `#1D1D1B` | 29, 29, 27 | Brødtekst |
| **Hvid** | Hvid | `#FFFFFF` | 255, 255, 255 | Baggrund |

### Farveprincip:
- Logoet er **sort/hvidt** — det giver frihed til at bruge enhver baggrundsfarve
- Jordfarver + gul/pink pop = "kulturinstitution snarere end fagforening"
- Til appen bruger vi **Djøf Blå (#0054CE)** som accent-farve og **Djøf Deep (#06235F)** som mørk base

---

## Typografi

| Brug | Skrifttype | Vægt | Web-fallback |
|------|-----------|------|--------------|
| **Primær / Logo** | Galano Classic | Regular, Medium, Bold | `"Plus Jakarta Sans", sans-serif` |
| **Brødtekst** | Galano Classic | Regular, Light | `"Plus Jakarta Sans", sans-serif` |

> Galano Classic (tegnet i Berlin) er Djøfs nye brandskrift. Den har "varme og menneskelighed." Til demo-appen bruger vi **Plus Jakarta Sans** (Google Fonts) som fallback — lignende geometrisk sans med personlighed.

---

## Logo
- **Fil i repo:** Mangler ❌ — skal tilføjes som `src/assets/djoef-logo.png`
- **Format:** "Djøf" i sort tekst, stort D, ingen prik over j, f'ets tværstamme forlænget
- **Positiv:** Sort på lys baggrund (primær)
- **Negativ:** Hvid på farvet/mørk baggrund
- **Ingen ikon-version:** Logoet er kun typografi

---

## Demo-persona

| Felt | Værdi |
|------|-------|
| **Navn** | Jakob Lund |
| **Stilling** | Specialkonsulent / Jurist |
| **Arbejdsgiver** | Justitsministeriet |
| **Overenskomst** | AC-overenskomsten (statsligt) |
| **Anciennitet** | 9 år |
| **Lønforhandling** | Individuel med tillæg |

---

## Demo-fejl i lønseddel

| Felt | Værdi |
|------|-------|
| **Fejltype** | Pensionsprocent forkert |
| **Beskrivelse** | Pensionsbidrag beregnet med 15,2% i stedet for 17,1% (korrekt sats efter 6+ års anciennitet). Difference: 1,9% af 42.350 kr. = **804,65 kr./md mangler i pensionsindbetaling** |
| **Overenskomstref.** | AC-overenskomsten §10 — Pensionsprocent stiger til 17,1% efter 6 års anciennitet |
| **Kontekst** | Pensionsfejl er usynlige: man opdager dem først ved pension. Over et 30-årigt karriereforløb koster 1,9% forskel ca. **200.000 kr.** inkl. afkast |

---

## Lønseddel-data (demo)

### Grunddata
- Bruttoløn: 42.350 kr./md
- Kvalifikationstillæg: 4.200 kr.
- Funktionstillæg: 2.800 kr.
- ~~Pension (arbejdsgiver 2/3 af 17,1%): 4.828 kr.~~ → Udbetalt: 4.303 kr. (15,2%) **← FORKERT**
- Pension (eget bidrag 1/3 af 17,1%): 2.414 kr. → Udbetalt: 2.151 kr. (15,2%) **← FORKERT**
- ATP: 99,00 kr.
- A-skat: 13.872 kr.
- AM-bidrag: 3.388 kr.
- Udbetalt: 21.703 kr.

---

## USP / Pitch-vinkel til Djøf

### Primær pain: "Selv jurister tjekker ikke"
Djøf-medlemmer er akademikere — de *kan* læse en lønseddel, men de *gør* det ikke. Og pension er den stille tyv.

### PayTjek-framing for Djøf:
> "Selv jurister tjekker ikke deres egen pension. Det koster dem 200.000 kr. over et karriereforløb. PayTjek er finansiel compliance for din karriere."

### Nøglepunkter:
1. **Pension er nøglen:** Djøf-medlemmer har høje lønninger → små procentfejl = store beløb over tid
2. **Individuelle tillæg:** Mange Djøf-medlemmer har forhandlede tillæg der skal afspejles korrekt
3. **Kontrakt-tjek er centralt:** Djøf-medlemmer forhandler individuelle lønpakker — kontraktens vilkår vs. faktisk udbetaling er den vigtigste søjle
4. **Sofistikeret tone:** Demoen skal føles mere "financial advisor" end "fejl-finder"

### Demo-fokus (3 søjler):
| Søjle | Djøf-specifik vinkel |
|-------|---------------------|
| **Lønseddel** | Pensionsprocent, tillægsberegning, skatteoptimering — de skjulte fejl der koster mest |
| **Kontrakt** | ⭐ **Primær:** Kontraktens individuelle vilkår vs. faktisk udbetaling — er din forhandlede pakke korrekt implementeret? |
| **Vagtplan** | Mindre relevant for kontorfolk — kan evt. erstattes med "arbejdstidsregistrering" for dem med flextid |

> **Note:** For Djøf-demoen bør kontrakt-flowet fremhæves markant — det er her den unikke værdi ligger for akademikere med individuelle lønpakker.
