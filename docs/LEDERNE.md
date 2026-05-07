# Lederne — Brand Specification for PayTjek Demo

## Organisation
- **Fuldt navn:** Lederne
- **Medlemmer:** ~134.000
- **Primær sektor:** Tværgående — ledere i alle brancher (privat og offentlig)
- **Nøglefaggrupper:** Afdelingsledere, mellemledere, direktører, projektledere, teamledere, produktionsledere, butikschefer
- **Mission:** "Sammen gør vi en verden til forskel"
- **Website:** lederne.dk

---

## Farver

> Kilde: Lederne rebrandede i 2022 med nyt logo og ny visuel identitet. Primærfarverne er en mørk grøn og en lys grøn. Vi bruger de eksakte farver fra den eksisterende Lederne-deck (#185848).

| Rolle | Navn | HEX | RGB | Bemærkning |
|-------|------|-----|-----|------------|
| **Primær mørk** | Lederne Mørkegrøn | `#185848` | 24, 88, 72 | Logo venstre side, primær UI-farve, nav |
| **Primær lys** | Lederne Lysegrøn | `#4CAF50` | 76, 175, 80 | Logo højre side, accent, CTA |
| **Sekundær** | Lederne Mellemgrøn | `#2E7D62` | 46, 125, 98 | Hover-states, sekundære elementer |
| **Baggrund lys** | Lederne Lysegrøn bg | `#F0F7F4` | 240, 247, 244 | Baggrund, cards |
| **Tekst primær** | Mørk | `#1A1A1A` | 26, 26, 26 | Brødtekst |
| **Tekst sekundær** | Grå | `#5F6368` | 95, 99, 104 | Labels, meta |
| **Hvid** | Hvid | `#FFFFFF` | 255, 255, 255 | Baggrund |

### Farveprincip:
- Mørk grøn + lys grøn symboliserer **dualitet:** lederen er ofte alene, men hos Lederne er de del af et fællesskab
- Grøn signalerer bæredygtighed, vækst, ansvarlighed
- Organiske, rene former — peger fremad mod en bæredygtig verden

---

## Typografi

| Brug | Skrifttype | Vægt | Web-fallback |
|------|-----------|------|--------------|
| **Overskrifter** | Proprietær (Lederne custom) | Bold, Medium | `"Outfit", sans-serif` |
| **Brødtekst** | Proprietær | Regular, Light | `"Outfit", sans-serif` |

> Ledernes skrifttype er proprietær. Til demo-appen bruger vi **Outfit** (Google Fonts) som fallback — den har tilsvarende moderne, rene linjer med et professionelt udtryk.

---

## Logo
- **Fil i repo:** Mangler ❌ — skal tilføjes som `src/assets/lederne-logo.png`
- **Format:** To overlappende organiske former (blade/dråber) i mørk og lys grøn + "Lederne" tekst
- **Kendetegn:** Organiske, runde former — symboliserer fællesskab og bæredygtighed
- **Positiv:** Grøn på hvid baggrund
- **Negativ:** Hvid på mørk grøn baggrund

> **Note:** Vi har allerede brugt Lederne-branding i deck v17 (hosted på paytjek.io/lederne/). Logoet fra den eksisterende deck kan genbruges.

---

## Demo-persona

| Felt | Værdi |
|------|-------|
| **Navn** | Thomas Berg |
| **Stilling** | Afdelingsleder, Supply Chain |
| **Arbejdsgiver** | Novo Nordisk A/S |
| **Overenskomst** | Individuel lederkontrakt (Lederaftalen/Ledernes standardvilkår) |
| **Anciennitet** | 12 år |
| **Lønpakke** | Fast løn + bonus + pension + firmabil |

---

## Demo-fejl i lønseddel

| Felt | Værdi |
|------|-------|
| **Fejltype** | Bonus beregnet forkert |
| **Beskrivelse** | Årlig bonus beregnet på grundløn (52.000 kr.) i stedet for totalløn inkl. faste tillæg (58.400 kr.). 12% bonus × 6.400 kr. difference = **768 kr./md mangler** (9.216 kr./år) |
| **Kontraktref.** | Individuel lederkontrakt §4.2 — "Bonus beregnes på baggrund af den samlede faste løn inkl. faste tillæg" |
| **Kontekst** | Ledere med individuelle kontrakter har ofte komplekse lønpakker med bonus, pension, firmabil, sundhedsforsikring osv. Bonusgrundlaget er et typisk stridspunkt |

---

## Lønseddel-data (demo)

### Grunddata
- Grundløn: 52.000 kr./md
- Ledertillæg: 4.200 kr.
- Funktionstillæg: 2.200 kr.
- Totalløn (fast): 58.400 kr.
- ~~Bonus (12% af totalløn): 7.008 kr./md~~ → Udbetalt: 6.240 kr. (12% af grundløn) **← FORKERT**
- Pension (arbejdsgiver 15%): 8.760 kr.
- Pension (eget bidrag 5%): 2.920 kr.
- Firmabil (beskatning): 4.200 kr.
- A-skat: 19.830 kr.
- AM-bidrag: 4.672 kr.
- Udbetalt: 22.518 kr.

---

## USP / Pitch-vinkel til Lederne

### Primær pain: Individuelle kontrakter ingen tjekker
Lederne-medlemmer har ikke standardoverenskomster — de har forhandlede individuelle kontrakter. Men hvem tjekker at arbejdsgiveren lever op til det der blev aftalt?

### PayTjek-framing for Lederne:
> "Din lønpakke er forhandlet individuelt — men hvem tjekker at arbejdsgiveren leverer det der blev aftalt? PayTjek er din personlige lønrevisor."

### Nøglepunkter:
1. **Kontrakt er KING:** For ledere handler det ikke om overenskomst — det handler om den individuelle kontrakt. Kontrakt-flowet er den primære feature
2. **Bonus-kompleksitet:** Bonusordninger, aktieoptioner, resultatløn — alle med vilkår der kan misfortolkes
3. **Pension og goder:** Firmabil, sundhedsforsikring, ekstra ferie — ting der er aftalt men svære at verificere
4. **Prestige og troværdighed:** Demoen skal føles premium — "din personlige lønrevisor", ikke "fejl-finder"

### Demo-fokus (3 søjler):
| Søjle | Lederne-specifik vinkel |
|-------|---------------------|
| **Lønseddel** | Bonusberegning, pensionssatser, beskatning af goder — de komplekse tal i en lederlønpakke |
| **Kontrakt** | ⭐ **Primær:** Upload din kontrakt → AI matcher hvert enkelt vilkår mod din faktiske udbetaling |
| **Vagtplan** | Ikke relevant for ledere — erstattes med "lønpakke-overblik" (samlet visualisering af løn + goder + pension) |

> **Note:** Lederne-decket er allerede finaliseret (v17). Demo-appen skal matche det eksisterende deck's tone og branding.
