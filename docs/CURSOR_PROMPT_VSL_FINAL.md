# PayTjek × Serviceforbundet – Demo
## Cursor-Prompt: Kontrakttjek

---

## 1. HVAD DEMOEN SKAL VISE

Ét flow: Mikkel uploader sin ansættelseskontrakt → appen identificerer overenskomst og beregner anciennitet → vilkårstjek (10 punkter) → rettigheder han har → opsigelsesberegner.

Ingen lønsedler. Ingen vagtplaner. Ingen ICS. Det kommer senere.

---

## 2. PERSONA: Mikkel Brandt

| Felt | Værdi |
|---|---|
| Navn | Mikkel Brandt |
| CPR | 120993-1245 |
| Fødselsdato | 12. september 1993 (32 år) |
| Stilling | Vagtassistent (kontrolcentral) |
| Arbejdsgiver | Securitas A/S, CVR 17565844 |
| Ansættelsesdato | 1. juni 2022 |
| Anciennitet pr. maj 2026 | 3 år, 11 mdr. → Gruppe 3 (over 36 mdr.) |
| Arbejdstid | Fuldtid (154,12 timer/md gns. over 6 mdr.) |
| Overenskomst | Brancheoverenskomst for vagtassistenter (DI 854609) |
| Parter | DI Overenskomst II × Serviceforbundet/VSL |
| Pensionskasse | PensionDanmark |
| Funktionærstatus | Ja (§22) |

---

## 3. KONTRAKT-EKSTRAKTION

Når Mikkel uploader sin kontrakt, finder appen disse felter:

```
person.name              → "Mikkel Brandt"
person.cpr               → "120993-1245"
employment.title         → "Vagtassistent"
employment.employer      → "Securitas A/S"
employment.employer_cvr  → "17565844"
employment.start_date    → "2022-06-01"
employment.type          → "Fast"
employment.hours         → "Fuldtid" / "Deltid (XX timer)"
employment.monthly_norm  → 154,12 timer
employment.probation     → "3 måneder"
employment.notice        → (opsigelsesvarsel)
employment.collective_agreement → "DI 854609"
employment.pension       → "PensionDanmark"
employment.funktionaer   → ja/nej
employment.uniform       → ja/nej
```

Kontrakterne i vagtbranchen følger typisk Protokollat 12 i overenskomsten som definerer et standardiseret ansættelsesbevis med faste sektioner. Det gør parsing lettere.

---

## 4. VILKÅRSTJEK: 10 punkter

Hvert punkt tjekkes mod overenskomsten. Resultat: ✅ OK, ⚠️ Mangler, ❌ Forkert.

### 1. Løngruppe (§6, stk. 1)

Appen beregner anciennitet fra start_date og slår op:
- 0-12 mdr. → Gruppe 1
- 13-36 mdr. → Gruppe 2
- Over 36 mdr. → Gruppe 3

Mikkel: 01.06.2022 → 47 mdr. → Gruppe 3.

```
✅ "Gruppe 3 — korrekt iht. din anciennitet"
❌ "Gruppe 2 — du har over 36 mdr., burde være Gruppe 3.
    Difference: ~1.000 kr/md. Kontakt VSL."
⚠️ "Ingen løngruppe angivet i kontrakten"
```

Grundløn Gruppe 3 pr. 01.05.2025: 32.195,13 kr/md. Beregningsgrundlag: 160,33 timer/md.

### 2. Pension (§8, stk. 1)

Pr. 01.05.2025: samlet 13% (11% AG + 2% MA). Var 12% (10% + 2%) før.
Betingelse: over 20 år + enten tidl. ordning eller 5+ mdr. anciennitet.
Kasse: PensionDanmark.

```
✅ "Pension 13% hos PensionDanmark — korrekt"
❌ "Pension 12% — skal være 13% pr. 01.05.2025.
    Du mangler ca. 340 kr/md i pensionsindbetaling"
⚠️ "Pension ikke nævnt — du har ret til pension (§8)"
```

### 3. Funktionærstatus (§22)

Overenskomsten siger: "Vagtassistenterne er omfattet af Funktionærloven." Det giver ret til løn under sygdom, længere opsigelsesvarsel og beskyttelse mod usaglig opsigelse.

```
✅ "Funktionærstatus bekræftet"
⚠️ "Ikke nævnt i kontrakten — du ER funktionær jf. §22"
```

### 4. Opsigelsesvarsel (§2, stk. 4)

Skala:
- Op til 5 mdr: 1 måned
- Op til 2 år 9 mdr: 3 måneder
- Op til 5 år 8 mdr: 4 måneder ← Mikkel
- Op til 8 år 7 mdr: 5 måneder
- Herefter: 6 måneder

Medarbejder opsiger altid med 1 måned til udgangen af en måned.

```
✅ "4 mdr. opsigelsesvarsel — korrekt"
❌ "Kontrakten angiver 3 mdr. — du har ret til 4 mdr. (§2, stk. 4)"
```

### 5. Prøveperiode (§2, stk. 4)

Max 3 måneder. I prøvetiden: 14 dages varsel fra selskab, 3 dage fra medarbejder.

```
✅ "3 mdr. prøvetid — korrekt"
❌ "6 mdr. prøvetid — overenskomsten tillader max 3 mdr."
```

### 6. Arbejdstid og norm (§3)

Fuldtid = 154,12 timer/md gns. over 6 mdr. (§3, stk. 1). Kompenseret for skæve helligdage.
Deltid = individuel garanteret månedsnorm (§3, stk. 2).
Vagtplan min. 3 mdr. frem, 8 dage før ikrafttræden (§3, stk. 5).

```
✅ "Fuldtid, 154,12 timer/md — korrekt"
⚠️ "Deltid men ingen garanteret månedsnorm — du har ret til én (§3, stk. 2)"
❌ "Månedsnorm 160 timer — korrekt norm er 154,12 timer"
```

### 7. Godkendelse jf. Lov om Vagtvirksomhed (§2, stk. 1)

Ansættelse er betinget af godkendelse jf. §7 i Lov om Vagtvirksomhed + ren straffeattest.

```
✅ "Godkendelse nævnt"
⚠️ "Ikke nævnt — bør fremgå"
```

### 8. Uniform (§23)

"Kræver arbejdsgiveren uniform, vil omkostningerne påhvile arbejdsgiveren."

```
✅ "Uniform betalt af arbejdsgiver"
⚠️ "Ikke nævnt — hvis din arbejdsgiver kræver uniform, skal de betale (§23)"
```

### 9. Sundhedsordning (§9)

Arbejdsgiver tegner sundhedsordning hos PensionDanmark. Max 0,15% af normalløn for præsterede timer.

```
✅ "Sundhedsordning nævnt"
⚠️ "Ikke nævnt — du har ret til sundhedsordning betalt af arbejdsgiver (§9)"
```

### 10. Overenskomsthenvisning (Protokollat 12)

Kontrakten skal henvise til den gældende overenskomst.

```
✅ "Brancheoverenskomst for vagtassistenter (DI 854609)"
⚠️ "Ingen overenskomst nævnt"
❌ "Forkert overenskomst angivet"
```

---

## 5. DINE RETTIGHEDER

Efter vilkårstjekket viser appen hvad Mikkel har ret til — uanset om kontrakten er fejlfri. Det er grunden til at bruge appen, selv når alt er OK.

```
DINE RETTIGHEDER
Baseret på din overenskomst

💰 LØN & TILLÆG
   Grundløn Gruppe 3: 32.195,13 kr/md
   Anciennitetstillæg: 364,39 kr/md
   Branchetillæg: 4,95 kr/time
   Genetillæg lørdag: 34,16 kr/t (§7)
   Genetillæg søn-/helligdag: 51,44 kr/t (§7)
   Overarbejde: timeløn + 50% (§11)

🏥 FRAVÆR MED LØN
   Sygdom: fuld løn (funktionærloven via §22)
   Barns 1. sygedag: fri med fuld løn (§17)
   + 2 ekstra dage fra særlig opsparing
   Barns hospitalsindlæggelse: max 1 uge/år (§17)
   2 børneomsorgsdage/år (§17, stk. 4)
   2 børnebørns-omsorgsdage/år (§17, stk. 5)
   Ledsagelse af nærtstående: 2 dage/år
   + 5 ekstra ved kritisk sygdom (§17, stk. 6)

🏖️ FERIE & FRIDAGE
   25 feriedage (ferieloven)
   5 feriefridage pr. ferieår (§13)
   Særlig opsparing: 9% af ferieberettiget løn
   → stiger til 10% pr. 01.03.2026 (§14)

📚 UDDANNELSE
   2 ugers frihed/år til uddannelse (§18, stk. 4)
   Kompetenceudviklingsfonden betaler
   4 timer fri til FVU/ordblinde-screening (§18, stk. 4)
   Ved afskedigelse: ret til 2 ugers kursus (§18, stk. 10)

🔒 BESKYTTELSE
   Funktionærstatus (§22)
   4 mdr. opsigelsesvarsel (din anciennitet)
   Skriftlig opsigelse påkrævet (§2, stk. 5)
   Ret til 2 timers fri til a-kasse ved afskedigelse (§2, stk. 7)
   Virksomheden skal tilstræbe ikke at pålægge
   overarbejde i opsigelsesperioden (§2, stk. 6)
   Feriefridage kan IKKE varsles i opsigelsesperiode (§13, stk. 4)

👔 ARBEJDSVILKÅR
   Uniform betalt af arbejdsgiver (§23)
   Sundhedsordning via PensionDanmark (§9)
   Spisetid ½ time indregnet i tjenestetiden (§10)
   Pension 13% via PensionDanmark (§8)
```

---

## 6. OPSIGELSESBEREGNER

Interaktiv sektion. Vagten ser to scenarier beregnet ud fra sin konkrete anciennitet.

### "Hvis du opsiger"

```
Dit varsel: 1 måned til udgangen af en måned
Eksempel: Opsiger du 14. maj → sidste arbejdsdag 30. juni 2026

Ved fratræden:
├── Optjent ferie udbetales
├── Særlig opsparing (saldo) udbetales
└── Ikke-afholdte feriefridage udbetales
```

### "Hvis du bliver opsagt"

```
Dit varsel: 4 måneder (din anciennitet: 3 år 11 mdr.)
Næste trin: 5 mdr. ved 5 år 8 mdr. anciennitet (feb 2028)

Eksempel: Opsiges du i dag →

  I dag (14. maj)
    │
    ├── Opsigelse modtaget (SKAL være skriftlig, §2 stk. 5)
    │
    ├── Hurtigst muligt: 2 timers fri med løn
    │   til a-kasse/VSL (§2, stk. 7)
    │
    ├── Ret til 2 ugers kursus i opsigelsesperioden
    │   (§18, stk. 10 — du har 2+ års anciennitet)
    │   Arbejdsgiver betaler deltagerbetaling (max 1.500 kr)
    │
    ├── Maj–September: Opsigelsesperiode (4 mdr.)
    │   ├── Fuld løn inkl. alle tillæg
    │   ├── Virksomheden tilstræber ingen overarbejde (§2.6)
    │   └── Feriefridage kan IKKE varsles (§13.4)
    │
    ├── 30. september: Fratræden
    │
    └── Oktober: Ferieafregning + særlig opsparing udbetales

Fratrædelsesgodtgørelse:
  Funktionærlovens §2a kræver 12 års ansættelse.
  Du opnår ret i juni 2034.
```

---

## 7. HANDLINGSKORT

Når der er fundet fejl, viser appen konkrete handlinger:

```
⚡ HANDLING PÅKRÆVET

❌ Forkert løngruppe
   Du er i Gruppe 2 men burde være Gruppe 3
   Difference: ~1.000 kr/md
   ┌───────────────────────────────┐
   │ Kontakt tillidsrepræsentant → │
   └───────────────────────────────┘
   ┌───────────────────────────────┐
   │ Ring til VSL: 70 30 09 30  → │
   └───────────────────────────────┘

⚠️ Sundhedsordning mangler i kontrakt
   Du har ret til sundhedsordning via
   PensionDanmark (§9)
   ┌───────────────────────────────┐
   │ Bed om nyt ansættelsesbevis → │
   └───────────────────────────────┘
```

---

## 8. DASHBOARD-STRUKTUR

### Forside (før upload)

```
Hej, Mikkel 👋
Din kontrakt skal være korrekt

┌──────────────────┐
│ 📋 KONTRAKT      │
│ Ikke uploadet    │
└──────────────────┘

┌──────────────────────────────┐
│  Upload kontrakt             │
└──────────────────────────────┘
```

### Forside (efter upload)

```
Hej, Mikkel 👋
Din kontrakt skal være korrekt

┌──────────────────────────────────────┐
│ 📋 KONTRAKT                         │
│ Securitas A/S                        │
│ Gruppe 3 · Fuldtid · 154,12 t/md    │
│ ✅ 8/10 OK  ⚠️ 2 mangler           │
│                                      │
│ Se detaljer →                        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 🛡️ DINE RETTIGHEDER                │
│                                      │
│ 💰 Grundløn Gruppe 3: 32.195 kr/md  │
│ 🏥 Fuld løn under sygdom            │
│ 🔒 4 mdr. opsigelsesvarsel          │
│ 📚 2 ugers uddannelsesret/år        │
│                                      │
│ Se alle rettigheder →                │
└──────────────────────────────────────┘
```

### Kontrakt-fanen

```
← KONTRAKT VERIFICERET

Mikkel Brandt
Vagtassistent — Securitas A/S

OVERENSKOMST
Brancheoverenskomst for vagtassistenter (DI 854609)
Serviceforbundet/VSL × DI Overenskomst II

ANSÆTTELSE
┌──────────────┐  ┌──────────────┐
│ STILLING     │  │ TYPE         │
│ Vagtassistent│  │ Fast         │
├──────────────┤  ├──────────────┤
│ ANSAT SIDEN  │  │ ARBEJDSTID   │
│ 1. juni 2022 │  │ Fuldtid      │
│              │  │ 154,12 t/md  │
├──────────────┤  ├──────────────┤
│ PRØVEPERIODE │  │ OPSIGELSE    │
│ 3 mdr.       │  │ 4 mdr.       │
└──────────────┘  └──────────────┘

LØNSATSER
Grundløn Gruppe 3: 32.195,13 kr/md
+ Anciennitetstillæg: 364,39 kr/md
+ Branchetillæg: 4,95 kr/time

Genetillæg (§7):
  Lørdag kl. 14-24: 34,16 kr/t
  Søn-/helligdag:   51,44 kr/t
  Varskotillæg:    522,93 kr/gang

PENSION
┌────────┐  ┌────────┐  ┌────────┐
│   2%   │  │  11%   │  │  13%   │
│  EGET  │  │   AG   │  │ I ALT  │
└────────┘  └────────┘  └────────┘
PensionDanmark

VILKÅRSTJEK                  8/10 OK  ⚠️ 2
──────────────────────────────────────────
✅ Løngruppe (Gruppe 3)
   32.195,13 kr/md — korrekt iht. anciennitet

✅ Pension (13%)
   PensionDanmark — korrekt pr. 01.05.2025

✅ Funktionærstatus
   Omfattet af funktionærloven (§22)

✅ Opsigelsesvarsel (4 mdr.)
   Korrekt iht. §2, stk. 4

✅ Prøveperiode (3 mdr.)
   Korrekt iht. §2, stk. 4

✅ Arbejdstid (154,12 t/md)
   Korrekt fuldtidsnorm (§3, stk. 1)

✅ Overenskomsthenvisning
   DI 854609 — korrekt

✅ Godkendelse vagtvirksomhedsloven
   §7 nævnt

⚠️ Sundhedsordning
   Ikke nævnt — du har ret til sundhedsordning
   via PensionDanmark (§9)

⚠️ Uniform
   Ikke nævnt — hvis arbejdsgiver kræver uniform
   skal de betale (§23)

OPSIGELSE
Se hvad der sker hvis du opsiger
eller bliver opsagt →

Kontrakt underskrevet 1. juni 2022
```

---

## 9. NAVIGATION

Bottom tab bar (5 ikoner):

```
🏠 Hjem  |  📋 Kontrakt  |  ✅ Løntjek  |  🕐 Historie  |  ••• Mere
```

Løntjek-fanen viser "Kommer snart" eller er deaktiveret i denne version. Kontrakttjek er primær funktion.

---

## 10. BRANDING

Logo: Serviceforbundet (øverst til venstre i header)
Farver: Følg Serviceforbundets brand — primær farve er mørkeblå/navy
Tagline under velkomst: "Din kontrakt skal være korrekt"
