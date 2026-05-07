# PayTjek Whitelabel Demo — Cursor Guide v6

## Status
Flowet virker: Kontrakt → Lønseddel → Rapport. Dashboard opdaterer sig korrekt. Temaer, farver, skrifttyper, personas — alt fungerer.

## 3 ting der stadig mangler

1. **Login-siden** viser stadig PayTjek-logo og lilla farve
2. **Welcome-siden** har stadig for mange tekstlinjer
3. **Djøf/Lederne** mangler kontrakt-lovgivningstjek + "Kontrakt" i bottom nav

---

## 1. Login-siden skal brandes

### Nuværende
```
[PayTjek lilla ikon]
Velkommen tilbage 👋
Log ind for at fortsætte

[Email]
[Adgangskode]
[Log ind]  ← lilla knap

Kontakt os for at få adgang til platformen
```

### Ønsket (i demo-mode)
```
[Union-logo]
Log ind

[Email]
[Adgangskode]
[Log ind]  ← union-farve knap
```

### Ændringer:
- Erstat PayTjek-ikon med `config.logo` (fald tilbage til PayTjek hvis ingen demo)
- Fjern "Velkommen tilbage 👋" — erstat med bare "Log ind"
- Fjern "Log ind for at fortsætte"
- Log ind-knap følger allerede `--primary` via Tailwind (burde virke automatisk)
- Fjern "Kontakt os for at få adgang til platformen" i demo-mode

### I koden (sandsynligvis `LoginForm.tsx` eller login-side):
```tsx
const demo = useDemo();

// Logo
<img src={demo?.config?.logo ?? paytjekLogo} />

// Overskrift
{demo?.isDemoMode
  ? <h1>Log ind</h1>
  : <><h1>Velkommen tilbage 👋</h1><p>Log ind for at fortsætte</p></>
}

// Bund-tekst
{!demo?.isDemoMode && <p>Kontakt os for at få adgang...</p>}
```

---

## 2. Welcome-siden skal forenkles

### Nuværende (for meget)
```
[Union-logo]

Stor headline
Sub-headline i union-farve
Spørgsmål i grå

[Tjek din lønseddel nu]

Har du allerede en konto? Log ind
```

### Ønsket
```
[Union-logo]

Én headline

[Tjek din lønseddel]

Log ind
```

### Ændringer:
- Fjern sub-headline (den i union-farve under headlinen)
- Fjern spørgsmålsteksten (den grå linje)
- Forenkl CTA-tekst: "Tjek din lønseddel nu" → "Tjek din lønseddel"
- Forenkl login-link: "Har du allerede en konto? Log ind" → bare "Log ind"

### Headlines per union:
```ts
FOA:     "Er din løn korrekt?"
HK:      "Er din løn korrekt?"
3F:      "Stemmer din løn?"
Djøf:    "Får du det du har krav på?"
Lederne: "Leveres din lønpakke?"
```

### I koden (`Welcome.tsx`):
```tsx
const { config } = useDemo();

<img src={config.logo} />
<h1>{config.welcomeHeadline}</h1>
{/* FJERNET: welcomeSub */}
{/* FJERNET: spørgsmålstekst */}
<Button>{`Tjek din lønseddel`}</Button>
<Link>Log ind</Link>
```

---

## 3. Djøf/Lederne: Kontrakt-lovgivningstjek + bottom nav

### 3a. Bottom nav

**FOA, 3F, HK — uændret:**
```
Hjem | Kalender | Løntjek | Historie | Mere
```

**Djøf, Lederne — Kalender erstattes:**
```
Hjem | Kontrakt | Løntjek | Historie | Mere
```

I `BottomNavigation.tsx`:
```tsx
const { config } = useDemo();
const isContract = config?.demoProfile === "contract";

// Swap det ene nav-item:
// isContract → { icon: FileText, label: "Kontrakt", route: "/m/contract" }
// ellers    → { icon: Calendar, label: "Kalender", route: "/m/calendar" }
```

### 3b. Kontrakt-analyse: ekstra trin for Djøf/Lederne

Den eksisterende kontrakt-analyse har disse trin:
```
✅ Læser dokument
✅ Identificerer kontrakttype
⏳ Finder overenskomst
○  Udtrækker lønsatser
○  Verificerer vilkår
```

**For Djøf/Lederne tilføjes et ekstra trin:**
```
✅ Læser dokument
✅ Identificerer kontrakttype
✅ Finder overenskomst
✅ Udtrækker lønsatser
✅ Verificerer vilkår
⏳ Tjekker mod gældende lovgivning    ← NYT TRIN
```

I analyse-step-listen (sandsynligvis `AnalysisStepList.tsx` eller kontrakt-analyse komponent):
```tsx
const { config } = useDemo();
const isContract = config?.demoProfile === "contract";

const steps = [
  "Læser dokument",
  "Identificerer kontrakttype",
  "Finder overenskomst",
  "Udtrækker lønsatser",
  "Verificerer vilkår",
  ...(isContract ? ["Tjekker mod gældende lovgivning"] : []),
];
```

### 3c. Kontrakt-resultat: lovgivningstjek sektion for Djøf/Lederne

Efter kontrakt-analyse vises resultatet. For FOA/3F/HK ser det ud som nu (overenskomst, ansættelse, lønsatser, pension).

**For Djøf/Lederne tilføjes en sektion "LOVGIVNINGSTJEK" efter kontrakt-resultatet:**

```
┌─────────────────────────────────────┐
│  ✅ KONTRAKT VERIFICERET            │
│                                     │
│  Thomas Berg                        │
│  Afdelingsleder — Novo Nordisk A/S  │
├─────────────────────────────────────┤
│                                     │
│  [Eksisterende sektioner som nu:    │
│   ANSÆTTELSE, LØNSATSER, PENSION]   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ⚖️ LOVGIVNINGSTJEK                │
│                                     │
│  ✅ 7 af 8 vilkår i overens-       │
│     stemmelse med lovgivningen      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ⚠️ §4.2 Bonusberegning     │    │
│  │                             │    │
│  │ Kontrakten angiver bonus    │    │
│  │ beregnet på "fast løn" uden │    │
│  │ at definere om faste tillæg │    │
│  │ er inkluderet.              │    │
│  │                             │    │
│  │ 📎 Funktionærlovens §17a   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ✅ §6.1 Opsigelsesvarsel    │    │
│  │ 4 md. varsel. I orden.      │    │
│  │ 📎 Funktionærlovens §2     │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ✅ §7.3 Konkurrenceklausul  │    │
│  │ 50% kompensation. I orden.  │    │
│  │ 📎 Ansættelsesklausulloven  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ ✅ §5.1 Pension             │    │
│  │ 15% arbejdsgiver. I orden.  │    │
│  │ 📎 ATP-loven               │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### 3d. Dashboard kontrakt-card for Djøf/Lederne

Når kontrakten er uploadet, viser kontrakt-card'et på dashboardet også lovgivningstjek:

**FOA/3F/HK (som nu):**
```
┌──────────────────────────────┐
│ KONTRAKT                 ✅  │
│ Odense Kommune               │
│ KL/FOA SOSU-overenskomst     │
│ 197 kr/t · 37t/uge           │
└──────────────────────────────┘
```

**Djøf/Lederne (udvidet):**
```
┌──────────────────────────────┐
│ DIN ANSÆTTELSE       ✅      │
│ Novo Nordisk A/S             │
│ Afdelingsleder               │
│ Individuel kontrakt          │
│ 58.400 kr/md · 37t/uge      │
│                              │
│ ⚖️ Lovgivningstjek          │
│ ✅ 7/8 vilkår i orden        │
│ ⚠️ 1 kræver opmærksomhed    │
│                              │
│ [Se kontraktanalyse →]       │
└──────────────────────────────┘
```

---

## Mock-data til `demoUnionConfigs.ts`

### Tilføj til interfacet:
```ts
export interface UnionDemoConfig {
  // ... eksisterende felter ...
  demoProfile: "agreement" | "contract";

  // Kun for contract-profil
  demoContractAnalysis?: {
    totalClauses: number;
    compliantClauses: number;
    issues: Array<{
      clause: string;
      status: "ok" | "warning";
      description: string;
      legalRef: string;
    }>;
  };
}
```

### Lederne:
```ts
demoProfile: "contract",
demoContractAnalysis: {
  totalClauses: 8,
  compliantClauses: 7,
  issues: [
    {
      clause: "§4.2 Bonusberegning",
      status: "warning",
      description: "Kontrakten angiver bonus beregnet på 'fast løn' uden at definere om faste tillæg er inkluderet. Anbefaling: præcisér at bonus beregnes på totalløn inkl. faste tillæg.",
      legalRef: "Funktionærlovens §17a",
    },
    {
      clause: "§6.1 Opsigelsesvarsel",
      status: "ok",
      description: "12 måneders anciennitet giver 4 måneders varsel. Overholder funktionærloven.",
      legalRef: "Funktionærlovens §2",
    },
    {
      clause: "§7.3 Konkurrenceklausul",
      status: "ok",
      description: "Kompensation på 50% af løn i klausulperioden. Overholder lov om ansættelsesklausuler.",
      legalRef: "Ansættelsesklausulloven §8",
    },
    {
      clause: "§5.1 Pension",
      status: "ok",
      description: "15% arbejdsgiverpension. Over lovkrav.",
      legalRef: "ATP-loven",
    },
  ],
},
```

### Djøf:
```ts
demoProfile: "contract",
demoContractAnalysis: {
  totalClauses: 6,
  compliantClauses: 5,
  issues: [
    {
      clause: "§3.1 Pensionssats",
      status: "warning",
      description: "Kontrakten angiver 15,2% pension. AC-overenskomsten foreskriver 17,1% efter 6 års anciennitet. Med 9 års anciennitet bør satsen være 17,1%.",
      legalRef: "AC-overenskomsten §10",
    },
    {
      clause: "§4.1 Kvalifikationstillæg",
      status: "ok",
      description: "Tillæg på 4.200 kr./md. I overensstemmelse med aftalt.",
      legalRef: "AC-overenskomsten §5, stk. 2",
    },
    {
      clause: "§8.1 Opsigelsesvarsel",
      status: "ok",
      description: "6 måneders varsel ved 9 års anciennitet. Overholder funktionærloven.",
      legalRef: "Funktionærlovens §2",
    },
  ],
},
```

### FOA, 3F, HK:
```ts
demoProfile: "agreement",
// Ingen demoContractAnalysis — de får ikke lovgivningstjek
```

---

## Implementation-rækkefølge

```
1. Login-side: erstat PayTjek-logo med union-logo, forenkl tekst
2. Welcome-side: fjern sub-headline + spørgsmål, opdatér headlines
3. Tilføj demoProfile + demoContractAnalysis til UnionDemoConfig
4. Udfyld mock-data for Djøf og Lederne
5. Bottom nav: conditional Kalender vs. Kontrakt
6. Kontrakt-analyse steps: tilføj "Tjekker mod gældende lovgivning" for contract-profil
7. Kontrakt-resultat side: tilføj LOVGIVNINGSTJEK sektion for contract-profil
8. Dashboard kontrakt-card: udvidet version med lovgivningstjek for contract-profil
```

---

## Filer der ændres

```
src/components/auth/LoginForm.tsx (eller login-side)
  → Union-logo + forenklet tekst i demo-mode

src/pages/mobile/Welcome.tsx
  → Fjern sub-headline + spørgsmål

src/lib/demoUnionConfigs.ts
  → demoProfile + demoContractAnalysis felter + data

src/components/layout/BottomNavigation.tsx
  → Conditional: Kalender vs. Kontrakt

Kontrakt-analyse step-komponent (AnalysisStepList eller lignende)
  → Ekstra trin for contract-profil

Kontrakt-resultat side
  → LOVGIVNINGSTJEK sektion for contract-profil

Dashboard kontrakt-card komponent
  → Udvidet card med lovgivningstjek for contract-profil
```

---

## Test

| Check | FOA | Djøf | Lederne |
|-------|-----|------|---------|
| Welcome: kun logo + headline + knap + login | ✅ | ✅ | ✅ |
| Login: union-logo, ingen "Velkommen tilbage" | ✅ | ✅ | ✅ |
| Bottom nav: Kalender / Kontrakt | Kalender | Kontrakt | Kontrakt |
| Kontrakt-analyse: "Tjekker lovgivning" trin | Nej | Ja | Ja |
| Kontrakt-resultat: LOVGIVNINGSTJEK sektion | Nej | Ja, 5/6 ok | Ja, 7/8 ok |
| Dashboard kontrakt-card: lovgivningstjek | Nej | Ja | Ja |
