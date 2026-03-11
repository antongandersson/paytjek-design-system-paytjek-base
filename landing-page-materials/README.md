# PayTjek Landing Page Materials

Alt du skal bruge for at opdatere paytjek.io landing page.

## 📦 Indhold

```
landing-page-materials/
├── README.md              ← Du er her
├── copy.md                ← Al tekst (headlines, descriptions, CTAs)
├── colors.css             ← CSS variabler til farver
├── components/
│   ├── HowItWorks.tsx     ← "Sådan fungerer det" sektion
│   └── FeatureCards.tsx   ← Feature grid med mockups
└── screenshots/           ← Her placerer du mockups fra /mockups
```

## 🚀 Quickstart

### 1. Generer mockups

1. Start appen: `npm run dev`
2. Gå til: `http://localhost:5173/mockups`
3. Klik **"Download alle (PNG)"**
4. Flyt PNG-filer til `screenshots/` mappen

### 2. Kopier til dit landing page projekt

```bash
# Kopier hele mappen
cp -r landing-page-materials/ /path/to/paytjek-landing/

# Eller kun det du skal bruge
cp landing-page-materials/copy.md /path/to/paytjek-landing/
cp landing-page-materials/colors.css /path/to/paytjek-landing/src/
cp landing-page-materials/screenshots/*.png /path/to/paytjek-landing/public/mockups/
```

### 3. Implementer komponenter

Se `components/HowItWorks.tsx` og `components/FeatureCards.tsx` for færdige React komponenter.

---

## 🎨 Design Reference

### Farver

| Brug | Hex | CSS Variable |
|------|-----|--------------|
| Primary (blå) | `#090cd2` | `--paytjek-primary` |
| Accent (lime) | `#b1e63e` | `--paytjek-accent` |
| Secondary (lyseblå) | `#98c6e3` | `--paytjek-secondary` |
| Card bg (Løntjek) | `#e8f4fc` | `--paytjek-card-blue` |
| Card bg (Kalender) | `#f0fce8` | `--paytjek-card-green` |
| Card bg (Ernest) | `#f0e8fc` | `--paytjek-card-purple` |
| Card bg (Fagforening) | `#fce8f0` | `--paytjek-card-pink` |

### Font

- **Urbanist** - Hele appen bruger denne
- Fallback: `system-ui, sans-serif`

```css
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
```

### Mockup Størrelser

- Phone frame: 280×580px
- Eksport: 3x pixel ratio (840×1740px)
- Format: PNG med transparent baggrund

---

## 📝 Sektioner at implementere

### 1. Hero
- Headline + subtext
- CTA knap
- Evt. mockup af app

### 2. Social Proof (valgfri)
- "X lønsedler analyseret"
- Fagforenings-logos

### 3. "Sådan fungerer det"
- 4 steps med nummererede cirkler
- Se `components/HowItWorks.tsx`

### 4. Features Grid
- 4 cards med mockups
- Se `components/FeatureCards.tsx`

### 5. Ernest AI Showcase (valgfri)
- Animeret chat demo

### 6. CTA Sektion
- Afsluttende call-to-action

---

## ✅ Checklist

- [ ] Download mockups fra `/mockups`
- [ ] Importer `colors.css` i dit projekt
- [ ] Tilføj Urbanist font
- [ ] Implementer HowItWorks sektion
- [ ] Implementer FeatureCards sektion
- [ ] Opdater hero med ny tekst fra `copy.md`
- [ ] Test på mobil

---

## 🔄 Opdatering

Når appen opdateres:

1. Gå til `/mockups` igen
2. Download nye mockups
3. Erstat filer i `screenshots/`
4. Deploy landing page

Mockup Generator bruger jeres faktiske komponenter, så screenshots afspejler altid den nyeste UI.


