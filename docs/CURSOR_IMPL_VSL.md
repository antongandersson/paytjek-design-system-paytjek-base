# PayTjek × Serviceforbundet – Implementeringsprompt til Cursor

## Arkitektur

5 skærme. Kontrakt-fanen er en hub med 3 undersider. Hjem er rent. Løntjek er deaktiveret (fase 2).

```
Routes:
/                    → Home.tsx
/contract            → ContractOverview.tsx (hub)
/contract/check      → ContractCheck.tsx (vilkårstjek)
/contract/rights     → ContractRights.tsx (rettigheder)
/contract/termination → ContractTermination.tsx (opsigelse)
```

Bottom tab bar: Hjem | Kontrakt | Løntjek (disabled) | Historie | Mere

Branding: Serviceforbundet logo, primærfarve #0d6e56 (mørk teal/grøn).

---

## Skærm 1: Home.tsx

Kun 3 elementer: kontraktkort, upload-knap, rettigheder-teaser.

```tsx
export default function Home() {
  const contract = useContractStore()
  
  return (
    <Page>
      <Header logo="serviceforbundet" />
      
      <Greeting name="Mikkel" subtitle="Din kontrakt skal være korrekt" />
      
      {/* Kontraktkort — tappable, navigerer til /contract */}
      {contract.uploaded ? (
        <Card onClick={() => navigate('/contract')}>
          <CardLabel>Kontrakt</CardLabel>
          <CardTitle>{contract.employer}</CardTitle>
          <CardDetail>
            {contract.group} · {contract.type} · {contract.norm} t/md
          </CardDetail>
          <BadgeRow>
            <Badge variant="ok">{contract.checksPassed} OK</Badge>
            <Badge variant="warn">{contract.checksWarning} mangler</Badge>
          </BadgeRow>
        </Card>
      ) : (
        <Card>
          <CardLabel>Kontrakt</CardLabel>
          <CardDetail>Ikke uploadet</CardDetail>
        </Card>
      )}
      
      {/* Upload knap */}
      <Button variant="primary" onClick={handleUpload}>
        Upload kontrakt
      </Button>
      
      {/* Rettigheder-teaser — kun hvis kontrakt er uploadet */}
      {contract.uploaded && (
        <Section title="Dine rettigheder" icon="shield">
          <Card accent="left" onClick={() => navigate('/contract/rights')}>
            <CardDetail>
              Grundløn {contract.group}: {contract.baseSalary} kr/md
            </CardDetail>
            <CardDetail muted>
              Fuld løn under sygdom · {contract.noticePeriod} mdr. opsigelsesvarsel
            </CardDetail>
            <CardLink>Se alle rettigheder →</CardLink>
          </Card>
        </Section>
      )}
      
      <BottomNav active="home" />
    </Page>
  )
}
```

**Vigtigt:** Ingen lønseddel-sektion. Ingen vagtplan. Ingen "seneste lønudbetaling." Kun kontrakt og rettigheder.

---

## Skærm 2: ContractOverview.tsx

Hub-side med stamdata + 3 navigation-links til undersider.

```tsx
export default function ContractOverview() {
  const contract = useContractStore()
  
  return (
    <Page>
      <BackHeader title="Ansættelseskontrakt" />
      
      {/* Hero-kort med navn og stilling */}
      <HeroCard color="primary">
        <HeroLabel>Kontrakt verificeret</HeroLabel>
        <HeroTitle>{contract.name}</HeroTitle>
        <HeroSubtitle>
          {contract.title} — {contract.employer}
        </HeroSubtitle>
        <FileChip>{contract.fileName}</FileChip>
      </HeroCard>
      
      {/* 4 stat-bokse i 2x2 grid */}
      <StatGrid>
        <Stat label="Løngruppe" value={contract.group} />
        <Stat label="Timer/md" value={contract.norm} />
        <Stat label="Ansat siden" value={contract.startDateFormatted} />
        <Stat label="Opsigelse" value={`${contract.noticePeriod} mdr.`} />
      </StatGrid>
      
      {/* 3 navigation-links — dette er hubben */}
      <Section title="Gå til">
        <NavRow onClick={() => navigate('/contract/check')}>
          <NavIcon name="checkbox" />
          <NavLabel>Vilkårstjek</NavLabel>
          <BadgeRow>
            <Badge variant="ok">{contract.checksPassed}</Badge>
            <Badge variant="warn">{contract.checksWarning}</Badge>
          </BadgeRow>
          <NavChevron />
        </NavRow>
        
        <NavRow onClick={() => navigate('/contract/rights')}>
          <NavIcon name="shield" />
          <NavLabel>Dine rettigheder</NavLabel>
          <NavChevron />
        </NavRow>
        
        <NavRow onClick={() => navigate('/contract/termination')}>
          <NavIcon name="arrow-bar-right" />
          <NavLabel>Opsigelse & varsel</NavLabel>
          <NavChevron />
        </NavRow>
      </Section>
      
      <FooterNote>
        Overenskomst: DI 854609 · VSL × DI Overenskomst II
      </FooterNote>
      
      <BottomNav active="contract" />
    </Page>
  )
}
```

**Vigtigt:** Ingen lønsatser, pension, ferie eller vilkårstjek-liste på denne side. Det lever på undersiderne. Denne side er KUN overblik + navigation.

---

## Skærm 3: ContractCheck.tsx

Ren checkliste. OK-punkter først, advarsler nederst med handlingsknapper.

```tsx
export default function ContractCheck() {
  const checks = useContractChecks()
  
  const passed = checks.filter(c => c.status === 'ok')
  const warnings = checks.filter(c => c.status === 'warning')
  const errors = checks.filter(c => c.status === 'error')
  
  return (
    <Page>
      <BackHeader title="Vilkårstjek" backTo="/contract" />
      
      {/* Summary header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium">
          {checks.length} vilkår tjekket
        </h2>
        <BadgeRow>
          <Badge variant="ok">{passed.length} OK</Badge>
          {warnings.length > 0 && (
            <Badge variant="warn">{warnings.length} mangler</Badge>
          )}
          {errors.length > 0 && (
            <Badge variant="error">{errors.length} fejl</Badge>
          )}
        </BadgeRow>
      </div>
      
      {/* Errors first (if any) */}
      {errors.map(check => (
        <CheckItem key={check.id} status="error">
          <CheckTitle>{check.title}</CheckTitle>
          <CheckDetail>{check.detail}</CheckDetail>
          <CheckActions>
            <ActionButton 
              label="Ring til VSL: 70 30 09 30" 
              icon="phone" 
              variant="primary"
            />
            <ActionButton 
              label="Bed om nyt ansættelsesbevis" 
              icon="file-text" 
              variant="outline"
            />
          </CheckActions>
        </CheckItem>
      ))}
      
      {/* OK items */}
      {passed.map(check => (
        <CheckItem key={check.id} status="ok">
          <CheckTitle>{check.title}</CheckTitle>
          <CheckDetail>{check.detail}</CheckDetail>
        </CheckItem>
      ))}
      
      {/* Warnings last */}
      {warnings.map(check => (
        <CheckItem key={check.id} status="warning">
          <CheckTitle>{check.title}</CheckTitle>
          <CheckDetail>{check.detail}</CheckDetail>
          <CheckActions>
            <ActionButton 
              label="Hvad gør jeg?" 
              icon="help" 
              variant="outline"
            />
          </CheckActions>
        </CheckItem>
      ))}
      
      <BottomNav active="contract" />
    </Page>
  )
}
```

**Mock data for checks:**

```ts
const CONTRACT_CHECKS = [
  {
    id: 'salary_group',
    title: 'Løngruppe (Gruppe 3)',
    detail: '32.195,13 kr/md — korrekt iht. anciennitet (47 mdr. → over 36 mdr.)',
    status: 'ok',
    ref: '§6, stk. 1',
  },
  {
    id: 'pension',
    title: 'Pension (13%)',
    detail: 'Samlet 13% (AG 11% + MA 2%) via PensionDanmark — korrekt pr. 01.05.2025',
    status: 'ok',
    ref: '§8, stk. 1',
  },
  {
    id: 'funktionaer',
    title: 'Funktionærstatus',
    detail: 'Omfattet af funktionærloven (§22)',
    status: 'ok',
    ref: '§22',
  },
  {
    id: 'notice',
    title: 'Opsigelsesvarsel (4 mdr.)',
    detail: 'Korrekt iht. §2, stk. 4 (3 år 11 mdr. anciennitet)',
    status: 'ok',
    ref: '§2, stk. 4',
  },
  {
    id: 'probation',
    title: 'Prøveperiode (3 mdr.)',
    detail: 'Korrekt iht. §2, stk. 4 — max 3 mdr. tilladt',
    status: 'ok',
    ref: '§2, stk. 4',
  },
  {
    id: 'working_hours',
    title: 'Arbejdstid (154,12 t/md)',
    detail: 'Korrekt fuldtidsnorm (§3, stk. 1) — gns. over 6 mdr., kompenseret for skæve helligdage',
    status: 'ok',
    ref: '§3, stk. 1',
  },
  {
    id: 'agreement_ref',
    title: 'Overenskomsthenvisning',
    detail: 'Brancheoverenskomst for vagtassistenter (DI 854609) — korrekt angivet (Protokollat 12)',
    status: 'ok',
    ref: 'Protokollat 12',
  },
  {
    id: 'vagtlov',
    title: 'Godkendelse vagtvirksomhedsloven',
    detail: '§7 i Lov om Vagtvirksomhed nævnt — godkendelseskrav fremgår',
    status: 'ok',
    ref: '§2, stk. 1',
  },
  {
    id: 'health',
    title: 'Sundhedsordning',
    detail: 'Ikke nævnt i kontrakten — du har ret til sundhedsordning via PensionDanmark (§9). Max 0,15% af normalløn.',
    status: 'warning',
    ref: '§9',
  },
  {
    id: 'uniform',
    title: 'Uniform',
    detail: 'Ikke nævnt — hvis din arbejdsgiver kræver uniform, skal de betale for anskaffelse og supplering (§23)',
    status: 'warning',
    ref: '§23',
  },
]
```

---

## Skærm 4: ContractRights.tsx

Ekspanderbare kategorier. Hvert punkt viser en preview-linje og kan åbnes for detaljer.

```tsx
export default function ContractRights() {
  return (
    <Page>
      <BackHeader title="Dine rettigheder" backTo="/contract" />
      
      <h2 className="text-base font-medium mb-1">
        Baseret på din overenskomst
      </h2>
      <p className="text-xs text-secondary mb-4">
        Brancheoverenskomst for vagtassistenter (DI 854609)
      </p>
      
      <Accordion>
        <AccordionItem 
          icon="coin" 
          title="Løn & tillæg"
          preview="Grundløn 32.195 kr · Branchetillæg · Genetillæg §7"
        >
          <RightsList>
            <RightsItem>Grundløn Gruppe 3: 32.195,13 kr/md</RightsItem>
            <RightsItem>Anciennitetstillæg: 364,39 kr/md</RightsItem>
            <RightsItem>Branchetillæg: 4,95 kr/time</RightsItem>
            <RightsItem>Lørdagstillæg (lør 14-24 + man 00-06): 34,16 kr/t</RightsItem>
            <RightsItem>Søn-/helligdagstillæg: 51,44 kr/t</RightsItem>
            <RightsItem>Varskotillæg: 522,93 kr/gang</RightsItem>
            <RightsItem>Overarbejde: timeløn + 50% (§11)</RightsItem>
          </RightsList>
        </AccordionItem>
        
        <AccordionItem 
          icon="heart" 
          title="Fravær med løn"
          preview="Sygdom · Barns 1. sygedag · Hospitalsindlæggelse"
        >
          <RightsList>
            <RightsItem>Sygdom: fuld løn (funktionærloven via §22)</RightsItem>
            <RightsItem>Barns 1. sygedag: fri med fuld løn, barn under 14 år (§17.1)</RightsItem>
            <RightsItem>+ 2 ekstra dage (betalt fra særlig opsparing)</RightsItem>
            <RightsItem>Barns hospitalsindlæggelse: fri med løn, max 1 uge/barn/12 mdr. (§17.3)</RightsItem>
            <RightsItem>Frihed til lægebesøg med barn (§17.2)</RightsItem>
            <RightsItem>2 børneomsorgsdage pr. kalenderår (§17.4)</RightsItem>
            <RightsItem>2 børnebørns-omsorgsdage pr. kalenderår (§17.5)</RightsItem>
            <RightsItem>Ledsagelse af nærtstående: 2 dage/år + 5 ekstra ved kritisk sygdom (§17.6)</RightsItem>
          </RightsList>
        </AccordionItem>
        
        <AccordionItem 
          icon="calendar" 
          title="Ferie & fridage"
          preview="25 feriedage · 5 feriefridage · Særlig opsparing 10%"
        >
          <RightsList>
            <RightsItem>25 feriedage pr. år (ferieloven)</RightsItem>
            <RightsItem>5 feriefridage pr. ferieår, 7,4 timer/dag (§13)</RightsItem>
            <RightsItem>Feriefridage kan IKKE varsles i opsigelsesperiode (§13.4)</RightsItem>
            <RightsItem>Særlig opsparing: 9% af ferieberettiget løn (§14)</RightsItem>
            <RightsItem>→ Stiger til 10% pr. 01.03.2026</RightsItem>
            <RightsItem>→ Stiger til 11% pr. 01.03.2027</RightsItem>
          </RightsList>
        </AccordionItem>
        
        <AccordionItem 
          icon="school" 
          title="Uddannelse"
          preview="2 ugers frihed/år · Kompetencefonden betaler"
        >
          <RightsList>
            <RightsItem>2 ugers frihed/år til uddannelse efter 6 mdr. anciennitet (§18.4)</RightsItem>
            <RightsItem>Kompetenceudviklingsfonden betaler løntabsgodtgørelse (§18.6)</RightsItem>
            <RightsItem>4 timer fri til FVU/ordblinde-screening med fuld løn (§18.4)</RightsItem>
            <RightsItem>Ved afskedigelse (2+ år): ret til 2 ugers kursus, AG betaler max 1.500 kr (§18.10)</RightsItem>
            <RightsItem>Virksomheden betaler 520 kr/år/fuldtidsansat til fonden (§18.3)</RightsItem>
          </RightsList>
        </AccordionItem>
        
        <AccordionItem 
          icon="lock" 
          title="Beskyttelse"
          preview="Funktionær · 4 mdr. varsel · Skriftlig opsigelse"
        >
          <RightsList>
            <RightsItem>Funktionærstatus (§22)</RightsItem>
            <RightsItem>4 mdr. opsigelsesvarsel fra arbejdsgiver (§2.4)</RightsItem>
            <RightsItem>Alle opsigelser skal være skriftlige (§2.5)</RightsItem>
            <RightsItem>Virksomheden tilstræber ikke overarbejde i opsigelsesperiode (§2.6)</RightsItem>
            <RightsItem>2 timers fri med løn til a-kasse/VSL ved afskedigelse (§2.7)</RightsItem>
          </RightsList>
        </AccordionItem>
        
        <AccordionItem 
          icon="briefcase" 
          title="Arbejdsvilkår"
          preview="Uniform · Sundhedsordning · Spisetid · Pension 13%"
        >
          <RightsList>
            <RightsItem>Uniform betalt af arbejdsgiver (§23)</RightsItem>
            <RightsItem>Sundhedsordning via PensionDanmark (§9)</RightsItem>
            <RightsItem>Spisetid ½ time indregnet i tjenestetiden (§10)</RightsItem>
            <RightsItem>Pension 13% via PensionDanmark (§8)</RightsItem>
            <RightsItem>Vagtplan min. 3 mdr. frem, 8 dage før ikrafttræden (§3.5)</RightsItem>
            <RightsItem>Normnedskrivning: 46 min/10t tjeneste kl. 17-06 (§3.4)</RightsItem>
          </RightsList>
        </AccordionItem>
      </Accordion>
      
      <BottomNav active="contract" />
    </Page>
  )
}
```

---

## Skærm 5: ContractTermination.tsx

To scenarier med konkrete datoer + visuel tidslinje.

```tsx
export default function ContractTermination() {
  const contract = useContractStore()
  
  // Beregn datoer dynamisk fra dags dato
  const today = new Date()
  const endOfNextMonth = getEndOfMonth(addMonths(today, 1))
  const endOfNoticePeriod = getEndOfMonth(
    addMonths(today, contract.noticePeriod)
  )
  
  return (
    <Page>
      <BackHeader title="Opsigelse & varsel" backTo="/contract" />
      
      {/* Tags */}
      <TagRow>
        <Tag>{contract.seniorityYears}+ års anciennitet</Tag>
        <Tag>Funktionær</Tag>
      </TagRow>
      
      {/* Scenario 1: Du opsiger */}
      <Card className="mb-3">
        <CardTitle size="sm">Hvis du opsiger</CardTitle>
        <CardDetail>1 måned til udgangen af en måned</CardDetail>
        <CardDetail muted className="mt-1">
          Opsiger du {formatDate(today)} → sidste dag {formatDate(endOfNextMonth)}
        </CardDetail>
      </Card>
      
      {/* Scenario 2: Du bliver opsagt — accentueret */}
      <Card accent="left" className="mb-4">
        <CardTitle size="sm">Hvis du bliver opsagt</CardTitle>
        <CardDetail>
          {contract.noticePeriod} måneders varsel (din anciennitet)
        </CardDetail>
        <CardDetail muted className="mt-1">
          Opsiges du i dag → sidste dag {formatDate(endOfNoticePeriod)}
        </CardDetail>
      </Card>
      
      {/* Tidslinje */}
      <Section title="Tidslinje ved opsigelse">
        <Timeline>
          <TimelineItem 
            label="I dag" 
            detail="Opsigelse modtaget (skal være skriftlig)" 
          />
          <TimelineItem 
            label="Hurtigst muligt" 
            detail="2 timers fri til a-kasse/VSL (§2.7)" 
          />
          <TimelineItem 
            label="I opsigelsesperioden" 
            detail="Ret til 2 ugers kursus (§18.10)" 
          />
          <TimelineItem 
            label={`${formatMonth(today)}–${formatMonth(endOfNoticePeriod)}`}
            detail="Fuld løn · Ingen tvunget overarbejde" 
          />
          <TimelineItem 
            label={formatDate(endOfNoticePeriod)} 
            detail="Fratræden" 
          />
          <TimelineItem 
            label={formatMonth(addMonths(endOfNoticePeriod, 1))}
            detail="Ferieafregning + særlig opsparing udbetales" 
          />
        </Timeline>
      </Section>
      
      <FooterNote>
        Baseret på din kontrakt, overenskomst og funktionærloven
      </FooterNote>
      
      <BottomNav active="contract" />
    </Page>
  )
}
```

**Timeline komponent:**

```tsx
function Timeline({ children }) {
  return (
    <div style={{ paddingLeft: 16, borderLeft: '2px solid #0d6e56' }}>
      {children}
    </div>
  )
}

function TimelineItem({ label, detail }) {
  return (
    <div style={{ padding: '6px 0' }}>
      <div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
        {detail}
      </div>
    </div>
  )
}
```

---

## Komponenter der skal laves

### Badge

```tsx
function Badge({ variant, children }) {
  const styles = {
    ok: { bg: '#E1F5EE', color: '#0d6e56' },
    warn: { bg: '#FAEEDA', color: '#854F0B' },
    error: { bg: '#FCEBEB', color: '#A32D2D' },
  }
  const s = styles[variant]
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10,
      padding: '2px 8px',
      borderRadius: 6,
      background: s.bg,
      color: s.color,
      marginRight: 4,
    }}>
      {children}
    </span>
  )
}
```

### CheckItem

```tsx
function CheckItem({ status, children }) {
  const icons = {
    ok: { name: 'circle-check', color: '#0d6e56' },
    warning: { name: 'alert-triangle', color: '#BA7517' },
    error: { name: 'alert-circle', color: '#A32D2D' },
  }
  const icon = icons[status]
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '10px 0',
      borderBottom: '0.5px solid var(--color-border-tertiary)',
    }}>
      <Icon name={icon.name} color={icon.color} size={16} />
      <div>{children}</div>
    </div>
  )
}
```

### NavRow (for contract hub)

```tsx
function NavRow({ icon, label, badge, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name={icon} size={16} color="#0d6e56" />
        <span style={{ fontSize: 13 }}>{label}</span>
        {badge}
      </div>
      <Icon name="chevron-right" size={14} color="var(--color-text-tertiary)" />
    </div>
  )
}
```

### AccordionItem (for rights)

```tsx
function AccordionItem({ icon, title, preview, children }) {
  const [open, setOpen] = useState(false)
  
  return (
    <div style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
      <div 
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name={icon} size={16} />
          <span style={{ fontSize: 13 }}>{title}</span>
        </div>
        <Icon 
          name={open ? 'chevron-down' : 'chevron-right'} 
          size={14} 
          color="var(--color-text-tertiary)" 
        />
      </div>
      
      {/* Preview tekst (altid synlig) */}
      {!open && (
        <div style={{
          padding: '0 0 8px 28px',
          fontSize: 11,
          color: 'var(--color-text-secondary)',
        }}>
          {preview}
        </div>
      )}
      
      {/* Ekspanderet indhold */}
      {open && (
        <div style={{ padding: '0 0 12px 28px' }}>
          {children}
        </div>
      )}
    </div>
  )
}
```

---

## Contract Store (mock data)

```ts
const CONTRACT_DATA = {
  uploaded: true,
  fileName: 'contract_mikkel_brandt.pdf',
  
  // Person
  name: 'Mikkel Brandt',
  cpr: '120993-1245',
  
  // Employment
  employer: 'Securitas A/S',
  employerCvr: '17565844',
  title: 'Vagtassistent (kontrolcentral)',
  type: 'Fuldtid',
  startDate: '2022-06-01',
  startDateFormatted: '1. jun 2022',
  
  // Calculated
  seniorityMonths: 47,
  seniorityYears: 3,
  group: 'Gruppe 3 (over 36 mdr.)',
  norm: '154,12',
  baseSalary: '32.195',
  noticePeriod: 4,
  
  // Overenskomst
  agreement: 'Brancheoverenskomst for vagtassistenter',
  agreementId: 'DI 854609',
  agreementParties: 'Serviceforbundet/VSL × DI Overenskomst II',
  pensionProvider: 'PensionDanmark',
  pensionTotal: 13,
  pensionAg: 11,
  pensionMa: 2,
  
  // Check results
  checksPassed: 8,
  checksWarning: 2,
  checksError: 0,
}
```

---

## Hvad der IKKE skal være i denne version

- Lønseddel-upload eller -tjek (Løntjek-fanen viser "Kommer snart")
- Vagtplan/ICS integration
- Arbejdsmiljøtjek
- Seneste lønudbetaling widget
- Kalender-fane
- Lønpakke-overblik (det er Djøf-konceptet)
- Forhandlingsmuligheder (det er Djøf-konceptet)
- Karriereforløb/timeline (det er Djøf-konceptet)
