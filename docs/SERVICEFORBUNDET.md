# Serviceforbundet / VSL — Brand Specification for PayTjek Demo

## Organisation
- **Fuldt navn:** Serviceforbundet / VSL (Vagt- og Sikkerhedsfunktionærernes Fagforening)
- **Medlemmer:** ~15.000 (via 20 tilsluttede fagforeninger)
- **Primær sektor:** Privat service — vagtvirksomhed, sikkerhed, kontrolcentraler
- **Nøglefaggrupper:** Vagtassistenter, sikkerhedsfolk, kontrolcentraloperatører
- **Paraply:** Serviceforbundet er paraplyorganisation for 20 specialiserede fagforeninger, herunder VSL
- **Website:** serviceforbundet.dk

---

## Farver

| Rolle | Navn | HEX | RGB | Bemærkning |
|-------|------|-----|-----|------------|
| **Primær** | SEF Petrol | `#005F73` | 0, 95, 115 | Logofarve "SERVICE", nav, primær UI |
| **Sekundær mørk** | SEF Deep Petrol | `#003D4D` | 0, 61, 77 | Hover-states, mørke sektioner |
| **Accent** | SEF Rød | `#C8102E` | 200, 16, 46 | Logofarve "FORBUNDET", CTA, accent |
| **Baggrund lys** | SEF Lys | `#F0F6F7` | 240, 246, 247 | Baggrund, cards |
| **Tekst primær** | Mørk | `#1A1A1A` | 26, 26, 26 | Brødtekst |
| **Tekst sekundær** | Grå | `#666666` | 102, 102, 102 | Labels, meta |
| **Hvid** | Hvid | `#FFFFFF` | 255, 255, 255 | Baggrund |

### Farveprincip:
- Petrolblå signalerer **tillid, autoritet og professionalisme**
- Rød accent bruges til **CTA og vigtige budskaber** — genkendelig fra logoet
- Masser af hvid/luft — "negative space" for tilgængelighed

---

## Typografi

| Brug | Skrifttype | Vægt | Web-fallback |
|------|-----------|------|--------------|
| **Overskrifter** | Sans-serif (proprietær) | Bold / Black | `"Inter", "Segoe UI", sans-serif` |
| **Brødtekst** | Sans-serif | Regular / Light | `"Inter", "Segoe UI", sans-serif` |

> Serviceforbundet bruger moderne sans-serif. Til demo-appen bruger vi **Inter** (Google Fonts) — ren, tilgængelig grotesk der matcher deres designfilosofi.

---

## Logo
- **Fil i repo:** `src/assets/sef-logo.png`
- **Format:** "SERVICE" i petrolblå + "FORBUNDET" i rød, fed sans-serif
- **Kendetegn:** Rent tekstlogo uden ikon — paraply-brand for 20 forbund

---

## Demo-persona

| Felt | Værdi |
|------|-------|
| **Navn** | Mikkel Brandt |
| **Alder** | 32 år |
| **Stilling** | Vagtassistent (kontrolcentral) |
| **Arbejdsgiver** | Securitas A/S |
| **CVR** | 17 56 58 44 |
| **Arbejdssted** | Securitas Kontrolcentral, Ballerup |
| **Overenskomst** | Brancheoverenskomst for vagtassistenter (DI nr. 854609) |
| **Overenskomstparter** | DI Overenskomst II × Serviceforbundet for VSL |
| **Fagforening** | VSL – Vagt- og Sikkerhedsfunktionærernes Fagforening |
| **Anciennitet** | 3 år, 7 md. → Gruppe 3 (over 36 mdr.) |
| **Arbejdstid** | Fuldtid (gns. 154,12 timer/md) |
| **Pensionskasse** | PensionDanmark |
| **Funktionærstatus** | Ja (jf. overenskomstens §22) |

---

## Lønmodel

### Grundløn (Gruppe 3, pr. 01.05.2025)
- Månedsløn: 32.195,13 kr.
- Timeløn: 200,80 kr/t (32.195,13 / 160,33)
- Inkluderer genetillæg for aften/natarbejde (§6, stk. 1)

### Tillæg
- Anciennitetstillæg Gr. 3: 364,39 kr./md
- Branchetillæg: 4,95 kr/t × 154,12t = 762,89 kr./md
- Lørdagstillæg (lør 14–man 06): 34,16 kr/t (pr. 01.05.2025)
- Søn-/helligdagstillæg: 51,44 kr/t (pr. 01.05.2025)
- Varskotillæg: 522,93 kr. pr. gang

### Pension (§8, pr. 01.05.2025)
- Samlet: 13% af A-skattepligtig løn
- Arbejdsgiver: 11%
- Medarbejder: 2%
- Pensionskasse: PensionDanmark

### Særlig opsparing (§14)
- Pr. 01.03.2026: 10,0% (var 9,0%)
- Pr. 01.03.2027: 11,0%

---

## Demo-fejl i lønseddel (3 eskalerende fejl)

### Fejl 1: Gammel lørdagstillægssats (januar 2026)

| Felt | Værdi |
|------|-------|
| **Fejltype** | Gammel sats |
| **Beskrivelse** | Lørdagstillæg beregnet med 32,80 kr/t (gammel sats) i stedet for 34,16 kr/t (pr. 01.05.2025). 16 timer × 1,36 kr = **21,76 kr. mangler** |
| **Overenskomstref.** | §7, stk. 1 — Genetillæg lørdag kl. 14:00–mandag kl. 06:00 |

### Fejl 2: Gammel pensionssats (februar 2026)

| Felt | Værdi |
|------|-------|
| **Fejltype** | Gammel sats |
| **Beskrivelse** | Samlet pension 12% (AG 10% + MA 2%) i stedet for 13% (AG 11% + MA 2%). **~342 kr./md mangler** i PensionDanmark-indbetaling |
| **Overenskomstref.** | §8, stk. 1 — Pension |

### Fejl 3: Manglende stigning i særlig opsparing (marts 2026)

| Felt | Værdi |
|------|-------|
| **Fejltype** | Manglende satsopdatering |
| **Beskrivelse** | Særlig opsparing stadig 9,0% — korrekt pr. 01.03.2026 er 10,0%. **~343 kr./md mangler** |
| **Overenskomstref.** | §14 — Særlig opsparing |

---

## Lønseddel-data (januar 2026, korrekt)

- Grundløn Gruppe 3: 32.195,13 kr.
- Anciennitetstillæg: 364,39 kr.
- Branchetillæg (154,12t × 4,95): 762,89 kr.
- Genetillæg lørdag (16t × 34,16): 546,56 kr.
- Genetillæg søndag (8t × 51,44): 411,52 kr.
- **Brutto i alt: 34.280,49 kr.**
- ATP: -99,00 kr.
- AM-bidrag (8%): -2.734,52 kr.
- Skat (38%): -8.833,85 kr.
- Pension medarbejder (2%): -683,63 kr.
- Pension arbejdsgiver (11%): 3.759,96 kr.
- **Udbetaling: 22.613,12 kr.**

---

## USP / Pitch-vinkel til Serviceforbundet/VSL

### Primær pain: Satsfejl der aldrig opdages
Vagtassistenter arbejder skiftende vagter med weekend- og helligdagstillæg. Når overenskomsten opdateres 1–2 gange om året, glemmer lønsystemet ofte at opdatere satserne — og ingen opdager det.

### PayTjek-framing:
> "Dine vagtassistenter har tillæg der ændrer sig med overenskomsten. PayTjek fanger de satsfejl der koster tusindvis over et år — fejl ingen ville have fundet manuelt."

### Nøglepunkter:
1. **Satsopdateringer:** Genetillæg, pension og særlig opsparing ændres med overenskomsten — lønsystemet følger ikke altid med
2. **Normnedskrivning:** 46 min/10 timer for aften/natarbejde — komplekst at beregne manuelt
3. **Vagtplan-integration:** Rullende vagtplan → automatisk beregning af genetillægs-timer
4. **20 forbund:** Én aftale med Serviceforbundet åbner for alle underliggende fagforeninger

### Demo-fokus (3 søjler):
| Søjle | SEF/VSL-specifik vinkel |
|-------|---------------------|
| **Lønseddel** | Lørdags-/søndagstillæg, pensionssats, særlig opsparing — satsfejl der gentager sig hver måned |
| **Kontrakt** | Anciennitet → løngruppe, funktionærstatus, opsigelsesvarsel |
| **Vagtplan** | ICS-sync → automatisk tjek: stemmer genetillægs-timer med vagtplanen? |
