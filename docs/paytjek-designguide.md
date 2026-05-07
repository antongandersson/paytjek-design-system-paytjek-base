# PayTjek Landing Page — Visuel Designguide

> Denne guide beskriver PayTjeks visuelle identitet som den er implementeret i landing page v2.
> Alle farve- og typografiværdier er verificeret direkte fra `src/styles/design-tokens.css` og komponent-CSS.

---

## Logo

**Placering:** Inline SVG i `src/components/Header/Header.tsx` og `src/components/Footer/Footer.tsx`  
**Ekstern logofil:** `public/favicon.svg` (til browser-fav og OG-billede)

### Logobeskrivelse

PayTjek-logoet består af to dele:

| Element | Beskrivelse |
|---------|-------------|
| Ikon | Abstrakt geometrisk P-form med overlappende polygoner (venstre side) |
| Wordmark | "PayTjek" i typografisk stil til højre for ikonet |
| Farve | `currentColor` — arver altid forældrens CSS-farve |
| Dimensioner | `width="140" height="50"`, viewBox `0 0 249.86 113.46` |

### Brug af logoet

- Logo renders altid som `currentColor` — tilpas farven via forældrens `color`-property
- På mørk baggrund: `color: var(--pt-text-light)` → `#EEF2FF`
- I footer: `color: var(--pt-text-light)` med `opacity: 0.85` for let dæmpet tone
- På mobil `<480px`: reduceres til `width: 120px`
- Wrapper-linket skal altid have `aria-label="PayTjek forside"`

```tsx
// Korrekt brug på mørk baggrund (header)
<Link to="/" aria-label="PayTjek forside">
  <svg width="140" height="50" viewBox="0 0 249.86 113.46"
    style={{ color: 'var(--pt-text-light)' }}>
    {/* ...paths... */}
  </svg>
</Link>

// Korrekt brug i footer (let dæmpet)
<svg width="140" height="50" viewBox="0 0 249.86 113.46"
  style={{ color: 'var(--pt-text-light)', opacity: 0.85 }}>
  {/* ...paths... */}
</svg>
```

---

## Farvepalette

PayTjek har et **mørkt tema som standard** — det er ikke en alternativ dark mode, men den primære visuelle profil på landing page.

### Primærfarver (brand)

| Navn | Token | Hex | Brug |
|------|-------|-----|------|
| **PayTjek Blue** | `--pt-primary` | `#090CD2` | Contact page hero-baggrund, founder-avatars |
| Blue hover | `--pt-primary-hover` | `#0709A8` | Hover på primary-specifikke elementer |
| Sort | `--pt-black` | `#000000` | Ren sort |
| Hvid | `--pt-white` | `#FFFFFF` | Ren hvid |

### Accentfarver (primær interaktionsfarve)

| Navn | Token | Hex | Brug |
|------|-------|-----|------|
| **Indigo** | `--pt-accent` | `#4F46E5` | Knapper, aktive ikoner, underline-hover, fokusringe |
| Indigo hover | `--pt-accent-hover` | `#4338CA` | Hover-state på primære knapper |
| Indigo glow | `--pt-accent-glow` | `rgba(79, 70, 229, 0.20)` | Fokusring `box-shadow` på inputfelter |
| Indigo soft | `--pt-accent-soft` | `rgba(79, 70, 229, 0.08)` | Meget lette tint-baggrunde |
| **Indigo tekst** | `--pt-accent-text` | `#818CF8` | Pre-heading labels, h1-accent, bullet-ikoner i hero |

### Mørke baggrunde

| Navn | Token | Hex | Brug |
|------|-------|-----|------|
| **Dyb nat** | `--pt-bg-dark` | `#060C18` | `<body>`, Hero-sektion, basis-lag |
| Mørk midtone | `--pt-bg-mid` | `#0A1020` | Footer, Contact content-sektion, mobil-nav |
| Kortbaggrund | `--pt-bg-card` | `#111827` | Alle `.card`-elementer, formcards |
| Kort hover | `--pt-bg-card-hover` | `#1A2436` | Hover state på interaktive kort |

### Tekstfarver

| Navn | Token | Hex | Brug |
|------|-------|-----|------|
| **Lys tekst** | `--pt-text-light` | `#EEF2FF` | Overskrifter, nav-links, primær tekst på mørkt |
| Dæmpet tekst (mørkt) | `--pt-text-muted-dark` | `#94A3B8` | Brødtekst, bullets, footer-links, labels |
| Mørk tekst | `--pt-text-dark` | `#102029` | Brug på lyse baggrunde |
| Muted (lys) | `--pt-text-muted` | `#5F6B73` | Sekundær tekst på lyse baggrunde |

### Lyse baggrunde (til fremtidige lyse sektioner)

| Navn | Token | Hex | Brug |
|------|-------|-----|------|
| Lys baggrund | `--pt-bg-light` | `#F5F7F8` | Lyse sektionsbaggrunde |
| Lysere baggrund | `--pt-bg-lighter` | `#F2F5F6` | Alternerende lyse paneler |
| Border (lys) | `--pt-border` | `#E0E4E7` | Kanter på lys baggrund |

### State-farver

| Navn | Token | Hex | Brug |
|------|-------|-----|------|
| Success | `--pt-success` | `#146B68` | Positive states, succesmarkering |
| Error | `--pt-error` | `#DC2626` | Fejlstates, alerts — **ikke** primærfarve |
| Success grøn (inline) | — | `#34d399` | Succesikon i kontaktformular |

### Kanter på mørkt

| Navn | Token | Brug |
|------|-------|------|
| Border dark | `--pt-border-dark` | `rgba(99, 102, 241, 0.12)` | Standard subtile kanter på mørkt |
| Border dark strong | `--pt-border-dark-strong` | `rgba(99, 102, 241, 0.22)` | Stærkere kanter, input-borders |

### CSS-variabler (`design-tokens.css`)

```css
/* Brand */
--pt-white: #FFFFFF;
--pt-black: #000000;
--pt-primary: #090CD2;
--pt-primary-hover: #0709A8;

/* Text */
--pt-text-dark: #102029;
--pt-text-muted: #5F6B73;
--pt-text-light: #EEF2FF;
--pt-text-muted-dark: #94A3B8;

/* Light backgrounds */
--pt-bg-light: #F5F7F8;
--pt-bg-lighter: #F2F5F6;
--pt-border: #E0E4E7;

/* Dark backgrounds */
--pt-bg-dark: #060C18;
--pt-bg-mid: #0A1020;
--pt-bg-card: #111827;
--pt-bg-card-hover: #1A2436;

/* Accent – indigo */
--pt-accent: #4F46E5;
--pt-accent-hover: #4338CA;
--pt-accent-glow: rgba(79, 70, 229, 0.20);
--pt-accent-soft: rgba(79, 70, 229, 0.08);
--pt-accent-text: #818CF8;

/* Dark borders */
--pt-border-dark: rgba(99, 102, 241, 0.12);
--pt-border-dark-strong: rgba(99, 102, 241, 0.22);

/* States */
--pt-success: #146B68;
--pt-error: #DC2626;
```

---

## Typografi

### Skrifttyper

To skrifttyper med klare roller:

```css
/* Brødtekst */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Overskrifter og knapper */
--font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

```css
/* Google Fonts — importeret i globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
```

### Skriftvægte og brug

| Font | Vægt | Klasse/brug |
|------|------|-------------|
| **Plus Jakarta Sans** | 500 | Navigation-labels |
| **Plus Jakarta Sans** | 600 | Knapper (`.btn`), vigtig tekst |
| **Plus Jakarta Sans** | 700 | `h1`–`h6` |
| **Plus Jakarta Sans** | 800 | Hero `h1` — max impact |
| **Inter** | 400 | `body`, `p`, normal tekst |
| **Inter** | 500 | Nav-links, labels, badges |
| **Inter** | 600 | Fremhævet brødtekst |

### PayTjeks typografiske stil

PayTjek bruger **konsekvent negativ letter-spacing** på alle overskrifter — det giver et tæt, tech-præcist udtryk. Hero-h1 er font-weight 800 (ikke blot 700). Pre-heading labels er i indigo-lilla (`--pt-accent-text`) med versaler og bred tracking.

```tsx
// Hero H1 med accentfarve
<h1 style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)', fontWeight: 800,
             lineHeight: 1.08, letterSpacing: '-0.03em' }}>
  Fra reaktiv sagsbehandling til{' '}
  <span style={{ color: 'var(--pt-accent-text)' }}>
    proaktiv magtfaktor
  </span>
</h1>

// Standard H2 (sektionsoverskrift)
<h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', letterSpacing: '-0.025em' }}>
  Fremtidens digitale{' '}
  <span style={{ color: 'var(--pt-accent-text)' }}>tillidsrepræsentant</span>
</h2>

// Pre-heading label (eyebrow)
<p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--pt-accent-text)' }}>
  B2B SaaS · FH-forbundene
</p>

// Brødtekst (standard)
<p style={{ fontSize: '1.0625rem', lineHeight: 1.75,
            color: 'var(--pt-text-muted-dark)' }}>
  Beskrivelsestekst her
</p>
```

### Størrelseshierarki

| Element | Størrelse | Font | Vægt | Letter-spacing |
|---------|-----------|------|------|----------------|
| Hero `h1` | `clamp(2.8rem, 5.5vw, 4.2rem)` | Plus Jakarta Sans | 800 | `-0.03em` |
| `h1` (standard) | `clamp(2.25rem, 5vw, 3.5rem)` | Plus Jakarta Sans | 700 | `-0.03em` |
| `h2` | `clamp(2rem, 4.5vw, 3rem)` | Plus Jakarta Sans | 700 | `-0.025em` |
| `h3` | `clamp(1.125rem, 3vw, 1.375rem)` | Plus Jakarta Sans | 700 | `-0.01em` |
| Pre-heading | `0.75rem` | Inter | 600 | `0.12em` |
| Nav-links | `0.9375rem` | Inter | 500 | — |
| Brødtekst `p` | `1.0625rem` | Inter | 400 | — |
| Footer kolonne-titler | `0.8125rem` | Inter | 700 | `0.07em` |
| Small/meta tekst | `0.8125rem` | Inter | 400 | — |

---

## Komponent-mønstre

### Knapper

PayTjek bruger **pill-formede knapper** (`border-radius: 9999px`) — maksimalt afrundede.

```tsx
// Primær knap
<Link to="/kontakt" className="btn btn-primary btn-lg">
  Book uforpligtende dialog
  <ArrowRight size={17} />
</Link>

// Sekundær / outline
<a href="mailto:kontakt@paytjek.io" className="btn btn-secondary btn-lg">
  <Mail size={18} />
  kontakt@paytjek.io
</a>

// Ghost (diskret)
<button className="btn btn-ghost">Se mere</button>
```

**Hover-adfærd:** `transform: translateY(-1px)` på alle knapper  
**Primær hover-glow:** `box-shadow: 0 4px 20px rgba(79, 70, 229, 0.45)`  
**Border-radius:** `border-radius: 9999px` (`--radius-pill`) — aldrig rektangulær

| Variant | Baggrund | Kant | Tekst |
|---------|----------|------|-------|
| Primary | `#4F46E5` | `#4F46E5` | `#FFFFFF` |
| Primary hover | `#4338CA` | `#4338CA` | `#FFFFFF` |
| Secondary | transparent | `rgba(99,102,241,0.22)` | `#EEF2FF` |
| Ghost | transparent | transparent | `#94A3B8` |

### Kort (Cards)

```tsx
// Standard kort (globals.css .card)
<div className="card">
  {/* Baggrund: #111827, kant: rgba(99,102,241,0.12), radius: 16px */}
</div>

// Stort formkort (contact page)
<div style={{
  background: 'var(--pt-bg-card)',
  border: '1px solid var(--pt-border-dark)',
  borderRadius: 'var(--radius-2xl)',  /* 20px */
  padding: 'var(--space-2xl)'
}}>
```

### Section-eyebrow (pre-heading label)

Bruges konsekvent som visuel introduktion til hver sektion:

```tsx
<div style={{
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--pt-accent-text)'  /* #818CF8 */
}}>
  Kapacitetsfælden
</div>
```

### Scroll-animationer

Alle sektioner fade-in ved scroll via `useInView`-hook og globale CSS-klasser:

```tsx
// I komponenten
const { ref, inView } = useInView(0.2);

<section ref={ref} className={`fadeInUp ${inView ? 'inView' : ''}`}>
```

```css
/* globals.css — kun opacity, ingen bevægelse */
.fadeInUp { opacity: 0; transition: opacity 0.7s ease; }
.fadeInUp.inView { opacity: 1; }
```

**Ingen `translateY`** — bevidst valg for at holde et roligt, professionelt udtryk.

### Detalje-ikoner (icon pill)

```tsx
<div style={{
  width: '44px', height: '44px',
  background: 'rgba(79, 70, 229, 0.10)',
  border: '1px solid rgba(79, 70, 229, 0.18)',
  borderRadius: 'var(--radius-md)',  /* 8px */
  color: 'var(--pt-accent)'
}}>
  <Shield size={20} />
</div>
```

### Formfelter

```tsx
<input style={{
  padding: '1rem 1.25rem',
  border: '1px solid var(--pt-border-dark-strong)',
  borderRadius: 'var(--radius-lg)',  /* 12px */
  background: 'var(--pt-bg-mid)',
  color: 'var(--pt-text-light)',
  fontSize: '1rem'
}} />

// Focus state
/* border-color: var(--pt-accent);
   box-shadow: 0 0 0 4px var(--pt-accent-glow); */
```

---

## Header

```tsx
// Sticky header med glasmorfisme
<header style={{
  position: 'fixed',
  background: 'rgba(6, 12, 24, 0.75)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid var(--pt-border-dark)',
  height: '72px'  /* 64px på mobil <480px */
}}>
```

- **Scrolled state:** baggrund skifter til `rgba(6, 12, 24, 0.95)`
- **Nav-link hover:** underline-animation — indigo-linje ekspanderer fra `width: 0` til `100%` på `150ms`
- **Desktop breakpoint:** `>1024px` — under skifter til hamburgermenu
- **CTA-knap:** "Book dialog" som primær knap i øverste højre hjørne

---

## Hero

Hero er sidens visuelle signatur og kombinerer fire lag:

| Lag | Z-index | Beskrivelse |
|-----|---------|-------------|
| Aurora-blobs (4 stk.) | 0 | Animerede radiale gradienter i indigo-lilla toner |
| Baggrundsfoto | 1 | `mix-blend-mode: luminosity`, `opacity: 0.72` |
| Gradient overlay | 2 | Mørk fra venstre → transparent mod højre |
| Tekstindhold | 3 | Left-aligned, max `560px` bred |

**Aurora-blob farvepalette:**

| Blob | Farve | Hex |
|------|-------|-----|
| Blob 1 | Primær indigo | `rgba(79, 70, 229, 0.28)` |
| Blob 2 | Lys indigo/periwinkle | `rgba(129, 140, 248, 0.20)` |
| Blob 3 | Mørk indigo | `rgba(67, 56, 202, 0.22)` |
| Blob 4 | Lys lavender | `rgba(165, 180, 252, 0.10)` |

**Animationsdurationer:** 14s / 18s / 22s / 16s — bevidst asynkrone for organisk bevægelse.

**Gradient overlay:**
```css
background: linear-gradient(
  to right,
  rgba(6, 12, 24, 0.98) 0%,
  rgba(6, 12, 24, 0.94) 22%,
  rgba(6, 12, 24, 0.78) 38%,
  rgba(6, 12, 24, 0.40) 55%,
  rgba(6, 12, 24, 0.05) 72%,
  transparent 100%
);
```

**Responsiv hero:** På `≤900px` skifter overlayets retning til top-bund, og fotoets opacity sænkes til `0.35`.

---

## Footer

```tsx
// Footer — mørk midtone baggrund
<footer style={{
  background: 'var(--pt-bg-mid)',   /* #0A1020 */
  borderTop: '1px solid var(--pt-border-dark)',
  padding: 'var(--space-3xl) 0 var(--space-lg)'
}}>
```

**Layout:** Grid `1.2fr 1.8fr` (brand | 3 navigationskolonner)  
**Tagline:** *"Digital magt til fagbevægelsen"*  
**Brand-features:** GDPR-compliant, EU-hosting, Dansk teknologi — med `--pt-accent` ikoner

| Breakpoint | Layout |
|------------|--------|
| Desktop `>900px` | `1.2fr 1.8fr`, nav 3 kolonner |
| Tablet `≤900px` | Enkeltkolonne, nav 2 kolonner |
| Mobil `≤480px` | Enkeltkolonne, nav 1 kolonne, centreret |

---

## Spacing-system

| Token | Værdi | Typisk brug |
|-------|-------|-------------|
| `--space-xs` | `0.5rem` | Tæt indre padding, ikongap |
| `--space-sm` | `1rem` | Knap-padding vertikal, lille gap |
| `--space-md` | `1.5rem` | Standard indre padding, formgap |
| `--space-lg` | `2rem` | Container-padding, sektionsafstand |
| `--space-xl` | `3rem` | Desktop nav-gap, kolonnegab |
| `--space-2xl` | `4rem` | Sektion mobile padding |
| `--space-3xl` | `6rem` | `.section` top/bund padding |

**Container:** max-bredde `1200px`, padding `0 2rem` → `0 1.5rem` på `≤768px`

---

## Border Radius

| Token | Værdi | Brug |
|-------|-------|------|
| `--radius-sm` | `4px` | Badges, meget små elementer |
| `--radius-md` | `8px` | Icon-containere, detalje-ikoner |
| `--radius-lg` | `12px` | Formfelter (input, textarea) |
| `--radius-xl` | `16px` | Standard kort |
| `--radius-2xl` | `20px` | Store formkort (contact page) |
| `--radius-pill` | `9999px` | **Alle knapper** |

---

## Shadows

| Token | Værdi | Brug |
|-------|-------|------|
| `--shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | Diskrete løft |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Standard card shadow |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Fremhævede elementer |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Store modaler/popovers |
| `--shadow-card` | `0 4px 20px rgba(0,0,0,0.08)` | Kortspecifik shadow |
| Knap hover glow | `0 4px 20px rgba(79,70,229,0.45)` | Primær knap hover |

---

## Transitions

| Token | Værdi | Brug |
|-------|-------|------|
| `--transition-fast` | `150ms ease-in-out` | Links, hover-farver, underline |
| `--transition-normal` | `250ms ease-in-out` | Header blur, knapper, mobil-menu |
| `--transition-slow` | `350ms ease-in-out` | Større layout-skift |

---

## Partner-assets (StatBar)

| Asset | Fil | Brug |
|-------|-----|------|
| CBS-logo | `public/images/CBSlogo_rgb_blue.svg` | Akademisk partner |
| Innovationsfonden | `public/images/Innovationsfonden_Logo_DK_White_RGB.png` | Offentlig støtte |

StatBar placeres direkte under Hero (`id="statbar"`) og er scroll-target for Hero-chevronknappen.

---

## Sideopbygning (landing page)

| Sektion | Komponent | ID | Primær rolle |
|---------|-----------|-----|--------------|
| 1 | `Hero` | — | Intro, CTA, visuelt signatur |
| 2 | `StatBar` | `statbar` | Social proof — CBS & Innovationsfonden |
| 3 | `ProductShowcase` | — | Demo af produktet |
| 4 | `KapacitetsFaelden` | `kapacitetsfaelden` | Problemet — to udfordringer |
| 5 | `Losning` | `losning` | Løsningen — tre features |
| 6 | `SkudsikkerFundament` | `fundament` | Troværdighed — tre pillar-cards |
| 7 | `FinalCTA` | — | Afsluttende call-to-action |

---

## PayTjek — Specifik identitet

### Hvem er målgruppen

PayTjek er et **B2B SaaS-produkt** målrettet FH-forbundenes ledelse og it-afdelinger:

- **Fagforeningsledere** — forbundsformænd, næstformænd, direktører
- **Sagsbehandlere og TR'er** — dem der i dag håndterer lønsager manuelt
- **Strategiske beslutningstagere** — der vil bevare magten ved forhandlingsbordet

Typisk beslutningstagerprofil: digitaliseringschef i et mellemstort til stort FH-forbund.

### Tone-of-voice

| Undgå | Brug i stedet |
|-------|---------------|
| "Upload lønsedler til systemet" | "Fra reaktiv sagsbehandling til proaktiv magtfaktor" |
| "Analyser data automatisk" | "Realtidsdata direkte til forhandlingsbordet" |
| "Vores SaaS-platform" | "Den digitale tillidsrepræsentant" |
| "Skalerbar løsning" | "Skalerer uden ekstra ansatte" |
| Teknisk produktsprog | Magtsprog — strategi, eksekvering, indflydelse |
| "Kom i gang" | "Book uforpligtende dialog" / "Få en live-gennemgang" |

### Centrale budskaber

- **Kapacitetsfælden:** Fagbevægelsen fanges i manuelle processer, mens arbejdsgiverne er digitaliserede
- **Data-driven Labour Organising:** Individuelle lønsager omsættes til makrodata
- **ROI-bevis:** Systemet beviser medlemskabets værdi mod gule fagforeninger
- **Sikkerhed som argument:** GDPR og EU-hosting er en del af salgsargumentet, ikke bare en note

---

## Hvad der stadig mangler

### Assets

- [ ] **PayTjek SVG-logo som selvstændig fil** — kun inline SVG i dag; eksporter til `public/images/paytjek-logo.svg` til brug i emails, præsentationer og OG-billede
- [ ] **OG-billede** — `og:image` er defineret i `index.html` men ingen billedfil er sat endnu
- [ ] **Founder-billeder** — Contact page har placeholder-avatars; rigtige fotos mangler i `public/images/`

### Design

- [ ] **Lyse sektioner** — `--pt-bg-light` og `--pt-bg-lighter` er defineret i tokens men bruges ikke endnu på landing page; en konsistent regel for hvornår lyse sektioner må bruges mangler
- [ ] **Responsiv StatBar** — CBS og Innovationsfonden-logoerne er ikke testet ned til `<320px`
- [ ] **Lys-tilstand** — en eventuel fremtidig lys version af siden er ikke specificeret

### Font

Inter og Plus Jakarta Sans er begge open source Google Fonts — ingen licens nødvendig.
