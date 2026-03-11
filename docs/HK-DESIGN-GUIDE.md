# HK Handel — Visuel Designguide

> Denne guide beskriver HKs visuelle identitet som den er implementeret i denne app.
> Alle farveværdier er verificeret direkte fra hk.dk's CSS-kildekode.

---

## Logo

**Placering:** `src/assets/hk-logo.png`  
**Kilde:** `docs/backend-examples/HK.png`

### Logobeskrivelse

HKs logo består af to bogstaver — **H** og **K** — i et rent, geometrisk design:

| Element | Farve | Hex |
|---------|-------|-----|
| Bogstavet **H** | Sky blue | `#009de0` |
| Bogstavet **K** | Sort | `#000000` |
| Baggrund | Hvid | `#ffffff` |

### Brug af logoet

- Vis logoet altid på hvid eller meget lys baggrund
- Brug det **aldrig** direkte på mørk primærfarve uden en hvid container
- Når det vises på primærblå baggrund (fx AuthLayout), placer det i en hvid afrundet boks
- Minimumsbredde: **48px**
- Tilføj altid `alt="HK Handel"` på `<img>`-elementet

```tsx
// Korrekt brug på lys baggrund
<img src={hkLogo} alt="HK Handel" className="h-8 w-auto" />

// Korrekt brug på mørk/primær baggrund
<div className="bg-white rounded-2xl p-4">
  <img src={hkLogo} alt="HK Handel" className="h-10 w-auto" />
</div>
```

---

## Farvepalette

### Primærfarver

| Navn | Hex | HSL (Tailwind) | Brug |
|------|-----|----------------|------|
| **HK Sky Blue** | `#009de0` | `199 100% 44%` | Primær interaktionsfarve, links, knapper, highlights |
| **HK Navy** | `#003755` | `210 100% 16%` | Overskrifter, primær tekstfarve på lys baggrund |
| **Sort** | `#141e2d` | `210 35% 14%` | Brødtekst, h1–h6 |

### Navigations- og strukturfarver

| Navn | Hex | Brug |
|------|-----|------|
| Navigation dark | `#034464` | Navigationsbaggrund, dark header |
| Footer dark | `#172e3c` | Footer-baggrund |
| Footer darker | `#1b3240` | Sekundær footer-sektion |

### Interaktionsfarver (hover/aktive states)

| Navn | Hex | Brug |
|------|-----|------|
| Button hover | `#0f73a0` | Hover-state på primære knapper |
| Medium blue | `#0075a3` | Fokusringe, aktive navigationslinks |
| Light blue | `#2a9bd7` | Sekundære hover-states |

### Accentfarver

| Navn | Hex | HSL (Tailwind) | Brug |
|------|-----|----------------|------|
| **HK Grøn** | `#5da423` | `93 50% 37%` | Positive states, success, check-marks |
| **HK Rød** | `#c60f13` | `358 86% 42%` | Alerts, fejl, notifikationer — **ikke** primærfarve |

### Lyse toner (baggrunde og kort)

| Navn | Hex | Brug |
|------|-----|------|
| Lys blå tint | `#e6f5fc` | Kortbaggrunde, CTA-baggrunde |
| Blå tint medium | `#ccebf9` | Hover på lys baggrund |
| Blå tint dyb | `#99d8f3` | Aktiv state på lys baggrund |
| Off-white | `#f0f0eb` | Sidefod, varm baggrund (let beige) |
| Lys grå | `#f2f2f2` | Panel-baggrunde |

### CSS-variabler (index.css)

```css
--primary: 199 100% 44%;          /* #009de0 - HK Sky Blue */
--primary-foreground: 0 0% 100%;

--secondary: 199 60% 88%;         /* Lys HK blå tint */
--secondary-foreground: 210 100% 16%;

--accent: 93 50% 37%;             /* #5da423 - HK Grøn */
--accent-foreground: 0 0% 100%;

--destructive: 358 86% 42%;       /* #c60f13 - HK Rød */
--destructive-foreground: 0 0% 100%;

--foreground: 210 100% 16%;       /* #003755 - HK Navy */
--background: 0 0% 98%;           /* #fafafa */

--muted: 199 40% 95%;             /* Meget lys HK blå tint */
--muted-foreground: 210 30% 45%;

--border: 199 25% 88%;
--ring: 199 100% 44%;             /* Fokusring = primærfarve */
```

---

## Typografi

### Skrifttype

**Manrope** — HKs faktiske skrifttype brugt på hk.dk.

```html
<!-- Google Fonts — tilføjet i index.html -->
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```ts
// tailwind.config.ts
fontFamily: {
  manrope: ['Manrope', 'sans-serif'],
}
```

### Skriftvægte og brug

| Vægt | Klasse | Brug |
|------|--------|------|
| 300 — Light | `font-light` | Brødtekst, beskrivelser, subtitles |
| 400 — Regular | `font-normal` | Normal tekst |
| 500 — Medium | `font-medium` | Navigation, labels, badges |
| 600 — SemiBold | `font-semibold` | Knapper, vigtig tekst |
| 700 — Bold | `font-bold` | Overskrifter h1–h3 |

### HKs typografiske stil

HK bruger **overraskende lette skriftvægte** — brødtekst er `font-light` (300), ikke 400. Det giver et mere airy og professionelt udtryk end tech-apps typisk bruger.

```tsx
// HK-stil overskrift
<h1 className="text-4xl font-bold tracking-tight text-foreground">
  HK Handel
</h1>

// HK-stil brødtekst (let!)
<p className="text-base font-light text-muted-foreground">
  Din løn skal være korrekt — hver gang
</p>

// HK-stil tagline
<p className="text-xl font-light opacity-90">
  Skræddersyet til dig der arbejder i handel og kontor
</p>
```

---

## Komponent-mønstre

### Knapper

HK bruger rektangulære til moderat afrundede knapper — **ikke** stærkt afrundede (pill-shape).

```tsx
// Primær knap — HK stil
<Button className="h-12 px-8 rounded-xl font-semibold">
  Tjek din lønseddel nu
</Button>

// Sekundær / outline
<Button variant="outline" className="h-12 rounded-xl">
  Se overenskomst
</Button>
```

**Hover-farve:** `#0f73a0` (mørkere blå end primær)  
**Border-radius:** `rounded-xl` (0.75rem) — ikke `rounded-2xl` eller `rounded-full`

### Kort (Cards)

```tsx
// Standard HK-kort
<Card className="border border-border/60">
  <CardContent className="p-5">
    ...
  </CardContent>
</Card>

// Fremhævet HK-kort (light blue tint)
<Card className="bg-secondary/40 border-primary/15">
  ...
</Card>
```

### Badges og chips

```tsx
// Aktivt medlemskab
<Chip variant="success" size="sm">Aktivt medlemskab</Chip>

// Alert/fejl (HK rød)
<Chip variant="destructive" size="sm">Lønfejl fundet</Chip>
```

### Logo på mørk baggrund

Når HK-logoet vises på en primærblå baggrund, skal det altid have en hvid container:

```tsx
<div className="bg-primary p-8">
  <div className="bg-white rounded-2xl p-5 inline-flex shadow-xl">
    <img src={hkLogo} alt="HK Handel" className="h-16 w-auto" />
  </div>
</div>
```

### Header / AppBar

```tsx
// Mobil header — kun HK-logo, ingen PayTjek-branding
<header className="sticky top-0 z-40 bg-background shadow-sm">
  <div className="flex items-center justify-between h-14 px-4">
    <img src={hkLogo} alt="HK Handel" className="h-8 w-auto" />
    ...
  </div>
</header>
```

---

## HK Handel — Specifik identitet

### Hvem er målgruppen

HK Handel organiserer medarbejdere i:
- **Detailhandel** — supermarkeder, specialbutikker, stormagasiner
- **Engroshandel** — grossister og distributionsvirksomheder
- **Kontor og administration** — privat sektor

Typisk profil: butiksassistent, kassemedarbejder, lagerassistent, kontorfunktionær.

### Tone-of-voice

| Undgå | Brug i stedet |
|-------|---------------|
| "Upload din lønseddel" | "Er din løn fra butikken korrekt?" |
| "Analyser lønseddel" | "Tjek om du får det du har krav på" |
| "Ingen løndata endnu" | "Som HK Handel-medlem er du dækket, hvis din løn er forkert" |
| "Dit overblik er klar" | "Din lønseddel er tjekket — her er dit overblik" |
| Teknisk sprog | Hverdagssprog der matcher butiksansatte |

### Overenskomstsatser 2025 (HK Handel / Dansk Erhverv)

Disse satser bruges til validering af lønsedler:

| Post | Sats |
|------|------|
| Mindste timeløn — trin 1 (0–1 år) | 149,80 kr/t |
| Mindste timeløn — trin 2 (1–2 år) | 154,30 kr/t |
| Mindste timeløn — trin 3 (2–4 år) | 158,90 kr/t |
| Mindste timeløn — trin 4 (4–6 år) | 165,45 kr/t |
| Mindste timeløn — trin 5 (6–7 år) | 171,20 kr/t |
| Mindste timeløn — trin 6 (7+ år) | 177,45 kr/t |
| Aftentillæg (efter kl. 18:00) | 25,30 kr/t |
| Lørdagstillæg (efter kl. 14:00) | 35,15 kr/t |
| Søn- og helligdagstillæg | 80,35 kr/t |
| Feriegodtgørelse | 12,5% af løn |
| Pension — arbejdsgiver | 9,0% |
| Pension — lønmodtager | 3,0% |
| Feriefridage | 5 dage/år |

---

## Hvad der stadig mangler

### Assets fra HK

Følgende skal indhentes officielt fra HK (kontakt: `mille.redanz@hk.dk`):

- [ ] **HK Handel SVG-logo** — vektorfil i stedet for PNG (`src/assets/hk-handel-logo.svg`)
- [ ] **HK Handel farvet version** — logoet med tekst "HK Handel" under ikonet
- [ ] **Officiel brandguide PDF** — bekræftelse af farveværdier og brugsregler
- [ ] **Co-branding retningslinjer** — hvordan HK-logo må kombineres med tredjepart (PayTjek)

### Font-licens

Manrope er et open source Google Font — ingen licens nødvendig.  
Bekræft dog med HK om de bruger en custom skrifttype internt, som adskiller sig fra Manrope.

### Mørk tilstand

HKs hjemmeside har ikke en dark mode. Appens dark mode (`index.css .dark`) er funktionel men er ikke verificeret mod HKs officielle palette.


