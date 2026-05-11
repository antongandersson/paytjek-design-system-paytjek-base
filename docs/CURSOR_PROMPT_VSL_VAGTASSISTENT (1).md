# PayTjek Demo – Serviceforbundet/VSL Persona
## Komplet Cursor-Prompt
## Baseret på: Brancheoverenskomst for vagtassistenter 2025-2028 (DI nr. 854609)

---

## 1. PERSONA: Mikkel Brandt

### 1.1 Stamdata

| Felt | Værdi |
|---|---|
| Navn | Mikkel Brandt |
| CPR | 120993-1245 |
| Fødselsdato | 12. september 1993 (32 år) |
| Adresse | Hejrevej 88, 1. th., 2400 København NV |
| Stilling | Vagtassistent (kontrolcentral) |
| Arbejdsgiver | Securitas A/S |
| CVR | 17 56 58 44 |
| Arbejdssted | Securitas Kontrolcentral, Lautrupvang 1, 2750 Ballerup |
| Ansættelsesdato | 1. juni 2022 |
| Anciennitet pr. jan 2026 | 3 år, 7 md. → Gruppe 3 (over 36 mdr.) |
| Ugentlig arbejdstid | Fuldtid (gns. 154,12 timer/md) |
| Overenskomst | Brancheoverenskomst for vagtassistenter (DI nr. 854609) |
| Overenskomstparter | DI Overenskomst II × Serviceforbundet for VSL |
| Fagforening | VSL – Vagt- og Sikkerhedsfunktionærernes Fagforening |
| Pensionskasse | PensionDanmark |
| Funktionærstatus | Ja (jf. overenskomstens §22) |
| Godkendelse | Godkendt jf. §7 i Lov om Vagtvirksomhed |

### 1.2 Hvad appen skal ekstrahere fra kontrakten

```
KONTRAKT-EXTRAKTION:
├── person.name              → "Mikkel Brandt"
├── person.cpr               → "120993-1245"
├── person.address            → "Hejrevej 88, 1. th., 2400 København NV"
├── employment.title          → "Vagtassistent"
├── employment.employer       → "Securitas A/S"
├── employment.employer_cvr   → "17565844"
├── employment.start_date     → "2022-06-01"
├── employment.type           → "Fast" (fuldtid)
├── employment.monthly_norm   → 154,12 timer (gns. over 6 mdr., jf. §3, stk. 1)
├── employment.collective_agreement → "Brancheoverenskomst for vagtassistenter"
├── employment.agreement_id   → "DI nr. 854609"
├── employment.agreement_parties → "DI Overenskomst II × Serviceforbundet/VSL"
├── employment.pension_provider → "PensionDanmark"
├── employment.probation       → "3 måneder" (jf. §2, stk. 4)
└── employment.funktionaer     → true (jf. §22)
```

---

## 2. LØNMODEL: Vagtassistentoverenskomsten

### 2.1 Grundløn (månedsløn)

Vagtassistenter aflønnes med **fast månedsløn** baseret på anciennitet i 3 grupper. Månedslønberegningen tager udgangspunkt i 160,33 timer/md (§6, stk. 1).

```
LØNGRUPPER (§6, stk. 1):
                    Gruppe 1         Gruppe 2         Gruppe 3
Anciennitet:       0-12 mdr.        13-36 mdr.       Over 36 mdr.

Pr. 01.03.2025:    30.154,93        31.154,93        32.154,93
Pr. 01.05.2025:    30.195,13        31.195,13        32.195,13

MIKKEL: Ansat 01.06.2022 → 43 mdr. pr. jan 2026 → GRUPPE 3
  Grundløn: 32.195,13 kr./md (pr. 01.05.2025)
```

**Vigtigt:** Foranstående lønninger *inkluderer* genetillægget for aften- og natarbejde (§6, stk. 1, nederst). Det er altså ikke et separat tillæg oven i lønnen — det er bagt ind.

**Timeløn:** 32.195,13 / 160,33 = 200,80 kr/t

### 2.2 Anciennitetstillæg (§6, stk. 2)

```
ANCIENNITETSTILLÆG:
├── Gruppe 1: 287,24 kr./md
├── Gruppe 2: 362,39 kr./md
└── Gruppe 3: 364,39 kr./md  ← Mikkel

MIKKEL: +364,39 kr./md
```

### 2.3 Generelt branchetillæg (§6, stk. 3)

```
BRANCHETILLÆG:
└── Alle medarbejdere: 4,95 kr./time
    Mikkel (154,12 timer/md): 4,95 × 154,12 = 762,89 kr./md
```

### 2.4 Genetillæg (§7)

Genetillæg for weekend/helligdage er **faste kr.-beløb pr. time** (udover den grundløn der allerede inkluderer aften/nat-tillæg):

```
GENETILLÆG (§7, stk. 1):

Lørdag kl. 14:00 – mandag kl. 06:00:
├── Pr. 01.05.2025: 34,16 kr./time
├── Pr. 01.03.2026: 35,35 kr./time  ← ny sats
└── Pr. 01.03.2027: 36,59 kr./time

Søn- og helligdage kl. 00:00-24:00:
├── Pr. 01.05.2025: 51,44 kr./time
├── Pr. 01.03.2026: 53,24 kr./time  ← ny sats
└── Pr. 01.03.2027: 55,10 kr./time

Varskotillæg (pr. gang):
├── Pr. 01.05.2025: 522,93 kr.
├── Pr. 01.03.2026: 541,24 kr.
└── Pr. 01.03.2027: 560,18 kr.

Møde i retten: timeløn + 50%
Kilometergodtgørelse: statens regler
```

**Skæve helligdage (§7, stk. 1):** Nytårsdag, Nytårsaftensdag, Skærtorsdag, Langfredag, 2. påskedag, Kristi Himmelfartsdag, Grundlovsdag, 2. pinsedag, Juleaftensdag, 1. og 2. juledag.

### 2.5 Normnedskrivning for aften/natarbejde (§3, stk. 4)

```
NORMNEDSKRIVNING:
├── 46 minutter pr. 10 timers tjeneste i tidsrummet kl. 17:00-06:00
├── Mikkel arbejder skiftehold → betydeligt natarbejde
└── Eksempel: 80 timer mellem 17-06 → 80/10 × 46 min = 368 min = 6,13 timer nedskrives
    Justeret norm: 154,12 - 6,13 = 147,99 timer
```

### 2.6 Pension (§8)

```
PENSION:
├── FØR 01.05.2025:
│   ├── Samlet: 12% af A-skattepligtig løn
│   ├── Arbejdsgiver: 10%
│   └── Medarbejder: 2%
│
├── FRA 01.05.2025:  ← gælder for Mikkel i hele 2026
│   ├── Samlet: 13% af A-skattepligtig løn
│   ├── Arbejdsgiver: 11%
│   └── Medarbejder: 2%
│
├── Betingelser:
│   ├── Over 20 år ✓ (Mikkel er 32)
│   └── Enten i PensionDanmark i forvejen ELLER 5+ mdr. anciennitet ✓
│
├── Pensionskasse: PensionDanmark
│
└── Forhøjet pension under barsel (§8, stk. 2):
    └── 10 ugers orlov: 22,14 kr/t ekstra (samlet bidrag)
```

### 2.7 Særlig opsparing (§14)

```
SÆRLIG OPSPARING:
├── Pr. nuværende:  9,0% af ferieberettiget løn
├── Pr. 01.03.2026: 10,0% (+1 pct.point)  ← STIGNING
└── Pr. 01.03.2027: 11,0% (+1 pct.point)

Indeholder: feriegodtgørelse, ferietillæg, evt. feriefridage

Udbetaling:
├── Over 4 pct.point: udbetales løbende med lønnen
└── De 4 pct.point: opgøres og udbetales juni + december + fratræden
```

### 2.8 Overarbejde (§11)

```
OVERARBEJDE:
├── Tillæg: 50% af timelønnen
├── Øvrige tillæg kommer OVENI
└── Kan aftales afspadseret
```

### 2.9 Sundhedsordning (§9)

```
SUNDHEDSORDNING:
└── Arbejdsgiver tegner sundhedsordning hos PensionDanmark
    Max omkostning: 0,15% af normallønnen for præsterede timer
```

---

## 3. VAGTPLAN: Januar 2026

Mikkel arbejder rullende vagtplan på kontrolcentralen. Vagtplanen skal foreligge mindst 3 måneder frem (§3, stk. 5) og min. 8 dage før ikrafttræden.

### 3.1 Vagttyper

```
VAGTOVERSIGT:
├── Dagvagt (D):   06:00-14:00 (8 timer)
├── Aftenvagt (A):  14:00-22:00 (8 timer)
│   └── Aften/nat-tillæg: kl. 17:00-22:00 = 5 timer (bagt ind i grundløn)
│   └── Lørdagstillæg: lør kl. 14:00-22:00 = 8 timer (§7)
├── Natvagt (N):   22:00-06:00 (8 timer)
│   └── Aften/nat-tillæg: kl. 22:00-06:00 = 8 timer (bagt ind i grundløn)
└── Alle vagter inkl. ½ times spisetid indregnet i tjenestetiden (§10)
```

### 3.2 Januar 2026 vagtskema

```
UGE 1 (29.12-04.01):
  Man 29.12  A  14:00-22:00
  Tir 30.12  A  14:00-22:00
  Ons 31.12  N  22:00-06:00
  Tor 01.01  Fri (Nytårsdag — skæv helligdag)
  Fre 02.01  D  06:00-14:00
  Lør 03.01  Fri
  Søn 04.01  Fri

UGE 2 (05.01-11.01):
  Man 05.01  D  06:00-14:00
  Tir 06.01  D  06:00-14:00
  Ons 07.01  D  06:00-14:00
  Tor 08.01  A  14:00-22:00
  Fre 09.01  A  14:00-22:00
  Lør 10.01  A  14:00-22:00  → lørdagstillæg 8t + søndagstillæg 0t
  Søn 11.01  Fri

UGE 3 (12.01-18.01):
  Man 12.01  Fri
  Tir 13.01  N  22:00-06:00
  Ons 14.01  N  22:00-06:00
  Tor 15.01  N  22:00-06:00
  Fre 16.01  N  22:00-06:00
  Lør 17.01  Fri
  Søn 18.01  D  06:00-14:00  → søndagstillæg 8t

UGE 4 (19.01-25.01):
  Man 19.01  A  14:00-22:00
  Tir 20.01  D  06:00-14:00
  Ons 21.01  D  06:00-14:00
  Tor 22.01  Fri
  Fre 23.01  A  14:00-22:00
  Lør 24.01  D  06:00-14:00  → lørdag men D 06-14, kl. 14+ = 0 timer lørdagstillæg
  Søn 25.01  Fri

UGE 5 (26.01-01.02):
  Man 26.01  D  06:00-14:00
  Tir 27.01  A  14:00-22:00
  Ons 28.01  Fri
  Tor 29.01  N  22:00-06:00
  Fre 30.01  N  22:00-06:00
  Lør 31.01  A  14:00-22:00  → lørdagstillæg kl. 14-22 = 8t
  Søn 01.02  Fri
```

### 3.3 Tillægsopsummering januar

```
GENETILLÆG-TIMER:
├── Lørdagstillæg (lør 14:00-24:00 + man 00:00-06:00):
│   Lør 10.01 A: 14:00-22:00 = 8 timer
│   Lør 31.01 A: 14:00-22:00 = 8 timer
│   Man 05.01: 00:00-06:00 fra natvagt? Nej, Mikkel har aftenvagt 30.12, ikke natvagt.
│   Total: 16 timer × 34,16 = 546,56 kr.
│
├── Søn-/helligdagstillæg (søn/helligdage 00:00-24:00):
│   Tor 01.01 Fri (Nytårsdag) — ingen vagt = 0 timer
│   Søn 18.01 D: 06:00-14:00 = 8 timer
│   Total: 8 timer × 51,44 = 411,52 kr.
│
└── Total genetillæg: 546,56 + 411,52 = 958,08 kr.

NORMNEDSKRIVNING (timer kl. 17-06):
├── Aftenvagter (17-22): 7 vagter × 5t = 35 timer
├── Natvagter (22-06): 6 vagter × 8t = 48 timer
├── Total 17-06 timer: 83 timer
├── Nedskrivning: 83/10 × 46 min = 381,8 min = 6,36 timer
└── Justeret norm: 154,12 - 6,36 = 147,76 timer

PLANLAGTE TIMER:
├── 23 vagter × 8 timer = 184 timer
├── Justeret norm: 147,76 timer
└── Difference: +36,24 timer (opgøres over 6-mdr. periode, ikke pr. md.)
```

---

## 4. KOMPLET LØNBEREGNING (januar 2026, korrekt)

```
LØNSEDDEL JANUAR 2026 (KORREKT):
═══════════════════════════════════════════════
Grundløn Gruppe 3:                   32.195,13
Anciennitetstillæg:                     364,39
Branchetillæg (154,12t × 4,95):        762,89
                                    ──────────
Bruttoløn fast:                      33.322,41

Genetillæg:
  Lørdagstillæg (16t × 34,16):         546,56
  Søn-/helligdagstillæg (8t × 51,44):  411,52
                                    ──────────
  Genetillæg i alt:                     958,08

Brutto i alt:                        34.280,49

Fradrag:
  ATP medarbejderbidrag:                -99,00
                                    ──────────
A-indkomst:                          34.181,49
  AM-bidrag 8%:                      -2.734,52
  Skattepligtig:                     31.446,97
  Fradrag:                           -8.200,00
  Beskatningsgrundlag:               23.246,97
  Skat (38%):                        -8.833,85
                                    ──────────
UDBETALING:                          22.613,12

PENSION (§8):
  A-skattepligtig løn:               34.181,49
  Medarbejderbidrag (2%):               683,63
  Arbejdsgiverbidrag (11%):          3.759,96
  Samlet pension (13%):               4.443,59
  → PensionDanmark

SÆRLIG OPSPARING (§14):
  Ferieberettiget løn:               34.280,49
  Opsparing (9%):                     3.085,24
  Heraf udbetalt løbende (>4%):      1.713,22
  Resterende (4%) til konto:          1.371,22
═══════════════════════════════════════════════
```

*(Skatteoplysninger er syntetiske demotal: fradrag 8.200/md, trækprocent 38%)*

---

## 5. DE 3 FEJL

### 5.1 Fejl 1: Gammel genetillægssats (januar 2026)

```
FEJL 1 — GAMMEL LØRDAGSTILLÆG
════════════════════════════════════
Periode: Januar 2026
Fejltype: sats_transition

HVAD ER FORKERT:
  Lørdagstillæg = 32,80 kr./time
  Korrekt pr. 01.05.2025 = 34,16 kr./time
  Difference: 1,36 kr./time × 16 timer = 21,76 kr. for lidt

HVORFOR:
  32,80 kr. var satsen gældende før 01.05.2025
  34,16 kr. er satsen gældende fra 01.05.2025
  Overenskomstref: §7, stk. 1

SYNLIGHED PÅ LØNSEDDEL:
  Linjen "Lørdagstillæg" viser 32,80 kr/t i stedet for 34,16 kr/t
```

### 5.2 Fejl 2: Gammel pensionssats (februar 2026)

```
FEJL 2 — GAMMEL PENSIONSSATS
════════════════════════════════════
Periode: Februar 2026
Fejltype: sats_transition

HVAD ER FORKERT:
  Samlet pension = 12% (AG 10% + MA 2%)
  Korrekt pr. 01.05.2025 = 13% (AG 11% + MA 2%)
  Difference: 1 pct.point → ca. 342 kr./md for lidt indbetalt

HVORFOR:
  12% var satsen gældende før 01.05.2025
  13% er satsen gældende fra 01.05.2025
  Overenskomstref: §8, stk. 1

SYNLIGHED:
  Pensionslinjen viser AG 10% i stedet for 11%
  Samlet pension viser 12% i stedet for 13%
```

### 5.3 Fejl 3: Manglende stigning i særlig opsparing (marts 2026)

```
FEJL 3 — MANGLENDE STIGNING I SÆRLIG OPSPARING
════════════════════════════════════════════════
Periode: Marts 2026
Fejltype: sats_transition (lifecycle)

HVAD ER FORKERT:
  Særlig opsparing = 9,0%
  Korrekt pr. 01.03.2026 = 10,0%
  Difference: 1 pct.point → ca. 343 kr./md for lidt

HVORFOR:
  9,0% var satsen gældende til 28.02.2026
  10,0% er satsen gældende fra 01.03.2026 (§14)
  Overenskomstref: §14

SYNLIGHED:
  Særlig opsparing-linjen viser 9% i stedet for 10%
  Den løbende udbetaling (>4%) er for lav
```

---

## 6. KRYDSTJEK-REGLER

### 6.1 Kontrakt → Lønseddel

```
KONTRAKT ↔ LØNSEDDEL:
├── person.name == lønseddel.name
├── person.cpr == lønseddel.cpr
├── employment.start_date → anciennitet → løngruppe (1/2/3)
├── employment.monthly_norm → 154,12 → overtidsberegning
├── employment.pension_provider → PensionDanmark
└── employment.type → fuldtid/deltid → normnedskrivning
```

### 6.2 Vagtplan → Lønseddel

```
VAGTPLAN ↔ LØNSEDDEL:
├── sum(lørdagstimer 14-24 + mandagstimer 00-06) == lønseddel.lørdagstillæg.antal
├── sum(søn-/helligdagstimer) == lønseddel.søn_helligdagstillæg.antal
├── sum(timer 17-06) → normnedskrivning korrekt beregnet?
├── tillæg_sats == overenskomst_sats for periode
├── beløb == antal × sats
├── vagtplan forelagt min. 8 dage før (§3, stk. 5)
└── ændring > 3½ time inden 8 dage → varskotillæg (§3, stk. 6)?
```

### 6.3 Satsvalidering

```
SATSVALIDERING:
├── IF anciennitet > 36 mdr:
│   └── løngruppe == 3, grundløn >= 32.195,13 (pr. 01.05.2025)
│
├── IF lønperiode >= 2025-05-01:
│   ├── lørdagstillæg == 34,16 kr/t  (var 32,80)
│   ├── søn_helligdag == 51,44 kr/t  (var 49,47)
│   ├── varskotillæg == 522,93 kr    (var 503,37)
│   └── pension_samlet == 13%         (var 12%)
│
├── IF lønperiode >= 2026-03-01:
│   ├── lørdagstillæg == 35,35 kr/t  (ny stigning)
│   ├── søn_helligdag == 53,24 kr/t
│   ├── varskotillæg == 541,24 kr
│   └── særlig_opsparing == 10,0%     (var 9,0%)
│
└── IF lønperiode >= 2027-03-01:
    ├── lørdagstillæg == 36,59 kr/t
    ├── søn_helligdag == 55,10 kr/t
    └── særlig_opsparing == 11,0%     (var 10,0%)
```

---

## 7. SÆRLIGE REGLER FOR VAGTASSISTENTER

### 7.1 Lønperiode og udbetaling (§5)

```
LØNUDBETALING:
├── Lønperiode: 15. i en måned til 14. i den næste
├── Udbetales bagud
├── Til rådighed senest 3. sidste bankdag i måneden
└── Overføres til medarbejderens NemKonto
```

### 7.2 Feriefridage (§13)

```
FERIEFRIDAGE:
├── 5 feriefridage pr. ferieår
├── 7,4 timer pr. dag (fuldtid)
├── Placeres som restferie (ferieloven)
├── Kan IKKE varsles i opsigelsesperiode (fra virksomhedens side)
└── Alternativ: 2,5% af ferieberettiget løn til særlig opsparing (§13, stk. 5)
    └── Træder i kraft 1. september 2025
```

### 7.3 Seniorordning (§13a)

```
SENIORORDNING:
├── Fra 5 år før folkepensionsalder
├── Op til 46 seniorfridage
├── Finansiering: særlig opsparing, pensionskonvertering eller selvbetalt
└── Ikke relevant for Mikkel (32 år)
```

### 7.4 Barsel (§16)

```
BARSEL (9 mdr. anciennitet krævet):
├── Mikkel har 3+ år → opfylder betingelse
├── Den ene forælder: 4 uger før + 10 uger efter fødsel
├── Den anden forælder: 2 uger i forbindelse med fødsel
├── Forældreorlov: 24 uger (pr. 01.06.2025: 26 uger)
│   ├── 9 uger reserveret til den ene forælder
│   ├── 10 uger reserveret til den anden
│   └── 5 uger (pr. 01.06.2025: 7 uger) til fri fordeling
└── Forhøjet pension under 10 ugers orlov (§8, stk. 2)
```

### 7.5 Opsigelse (§2, stk. 4)

```
OPSIGELSESVARSLER (funktionærlignende):
├── Prøvetid (3 mdr.): 14 dage fra selskab, 3 dage fra medarbejder
│
├── Efter prøvetid:
│   ├── Medarbejder: 1 måned til udgangen af en måned
│   └── Selskab (afhænger af anciennitet):
│       ├── Op til 5 mdr:    1 måned
│       ├── Op til 2 år 9 mdr: 3 måneder
│       ├── Op til 5 år 8 mdr: 4 måneder
│       ├── Op til 8 år 7 mdr: 5 måneder
│       └── Herefter:          6 måneder
│
├── MIKKEL (3 år 7 mdr.): 4 måneders varsel fra selskab
│   "Hvis du opsiges i dag → sidste arbejdsdag 31. maj 2026"
│
└── Alle opsigelser skal være skriftlige (§2, stk. 5)
```

### 7.6 Børns sygdom og omsorgsdage (§17)

```
BØRNS SYGDOM (9 mdr. anciennitet krævet):
├── 1. hele sygedag: fri med fuld løn (barn under 14 år)
├── 2 yderligere dage: uden løn (kan betales fra særlig opsparing)
├── Hospitalsindlæggelse: fri med løn, max 1 uge pr. barn pr. 12 mdr.
├── 2 børneomsorgsdage pr. kalenderår (uden løn, fra særlig opsparing)
├── 2 børnebørns-omsorgsdage pr. kalenderår (uden løn)
└── Ledsagelse af nærtstående: 2 dage/år + 5 ekstra ved kritisk sygdom
```

---

## 8. SAMMENLIGNING: FOA vs. VSL vs. Djøf

| Aspekt | FOA (Maria) | VSL (Mikkel) | Djøf (Sofie) |
|---|---|---|---|
| Sektor | Kommunal | Privat | Stat |
| Forbund | FOA | Serviceforbundet/VSL | Djøf |
| AG-part | KL | DI Overenskomst II | Skatteministeriet |
| Lønsystem | Trin × procentreg. | Fast månedsløn (grupper) | Basisløntrin |
| Aften/nat-tillæg | % af timeløn | Bagt ind i grundløn | Ikke relevant |
| Weekend-tillæg | % af timeløn | Faste kr/t (§7) | Ikke relevant |
| Pension | 14% (frit valg) | 13% (11%AG + 2%MA) | 18,07% (fritvalg >15%) |
| Særlig opsparing | 9-10% (fritvalg) | 9-11% (§14) | Ikke separat |
| Norm | 37t/uge | 154,12 t/md (6-mdr gns) | 37t/uge |
| Funktionær | Via OK §10 | Via OK §22 | Via OK §3 |
| Vagtplan | 5-ugers rullende | Min. 3 mdr. frem (§3,5) | Ikke relevant |

---

## 9. BEREGNINGSFORMLER

```python
# Grundløn (direkte fra tabel baseret på anciennitet)
if anciennitet_mdr <= 12:
    grundlon = GRUPPE_1[periode]
elif anciennitet_mdr <= 36:
    grundlon = GRUPPE_2[periode]
else:
    grundlon = GRUPPE_3[periode]

# Anciennitetstillæg
anc_tillaeg = ANC_TILLAEG[gruppe]  # 287,24 / 362,39 / 364,39

# Branchetillæg
branche_tillaeg = 4.95 * praesterede_timer

# Timeløn
timelon = grundlon / 160.33

# Genetillæg (faste beløb)
lordag_beloeb = lordag_timer * LORDAG_SATS[periode]
sondag_beloeb = sondag_timer * SONDAG_SATS[periode]

# Normnedskrivning
nedskrivning_min = (timer_17_06 / 10) * 46  # minutter
nedskrivning_timer = nedskrivning_min / 60
justeret_norm = 154.12 - nedskrivning_timer

# Pension (af A-skattepligtig løn)
a_skat_lon = brutto - atp
pension_ma = a_skat_lon * 0.02
pension_ag = a_skat_lon * 0.11  # pr. 01.05.2025
pension_total = pension_ma + pension_ag

# Særlig opsparing (af ferieberettiget løn)
saerlig = ferieberettiget_lon * SAERLIG_PCT[periode]
loebende_udbetalt = max(0, saerlig - ferieberettiget_lon * 0.04)
konto = saerlig - loebende_udbetalt

# ATP
atp = 99.00  # fuldtid

# AM-bidrag
am = round(a_skat_lon * 0.08, 2)

# Overarbejde
if timer > justeret_norm:
    overarbejde_timer = timer - justeret_norm
    overarbejde_beloeb = overarbejde_timer * timelon * 1.50
```

---

## 10. LOVGIVNINGSREFERENCER

```
OVERENSKOMSTER OG LOVE:
├── Brancheoverenskomst for vagtassistenter 2025-2028 (DI nr. 854609)
│   ├── §2: Ansættelse og opsigelse
│   ├── §3: Tjenestetid (154,12 t/md, normnedskrivning)
│   ├── §5: Lønudbetaling (15.-14., bagud)
│   ├── §6: Løngrupper (1/2/3) + anciennitetstillæg + branchetillæg
│   ├── §7: Genetillæg (lørdag, søndag, varsko)
│   ├── §8: Pension (13% pr. 01.05.2025, PensionDanmark)
│   ├── §9: Sundhedsordning
│   ├── §10: Spisetid (½ time indregnet)
│   ├── §11: Overarbejde (50%)
│   ├── §12: Ferie
│   ├── §13: Feriefridage (5 dage)
│   ├── §13a: Seniorordning
│   ├── §14: Særlig opsparing (9% → 10% → 11%)
│   ├── §15: Sygdom (funktionærlovens regler)
│   ├── §16: Barsel
│   ├── §17: Børns sygdom, omsorgsdage, ledsagelse
│   ├── §22: Funktionærloven (vagtassistenter er omfattet)
│   └── §23: Uniform (arbejdsgiver betaler)
│
├── Funktionærloven: Gælder jf. §22
├── AM-bidragsloven §2: Arbejdsmarkedsbidrag 8%
├── ATP-loven: Sats A (fuldtid)
├── Ferieloven: 25 dage/år + 5 feriefridage (§13)
├── Lov om Vagtvirksomhed §7: Godkendelse
└── Protokollat 17: Store bededag (0,45% tillæg)
```

---

## 11. DEMO-FLOW I APPEN

```
STEP 1: Upload kontrakt (PDF)
  → App ekstrahere: navn, CPR, stilling, anciennitet,
    overenskomst (DI/VSL), pensionskasse
  → App viser: "Mikkel Brandt, Vagtassistent, Gruppe 3,
    Securitas, VSL/DI, PensionDanmark"

STEP 2: Upload vagtplan (ICS)
  → App beregner: genetillægs-timer + normnedskrivning
  → App viser: "16t lørdag, 8t søndag, 83t aften/nat (normnedskr. 6,36t)"

STEP 3: Upload lønseddel (PDF)
  → App parser og krydstjekker
  → Resultater:
     ✅ Korrekt: "Ingen fejl fundet"
     ❌ Fejl 1: "Lørdagstillæg bruger 32,80 kr/t —
                 skal være 34,16 kr/t pr. 01.05.2025.
                 Ref: §7, stk. 1. Tab: 21,76 kr."
     ❌ Fejl 2: "Pension AG er 10% —
                 skal være 11% pr. 01.05.2025.
                 Ref: §8, stk. 1. Tab: ~342 kr./md"
     ❌ Fejl 3: "Særlig opsparing er 9% —
                 skal være 10% pr. 01.03.2026.
                 Ref: §14. Tab: ~343 kr./md"
```
