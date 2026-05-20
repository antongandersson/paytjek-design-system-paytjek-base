# PayTjek – Arbejdsmiljø & Hviletidstjek Feature
## Cursor-Prompt

---

## Hvad denne feature gør

Når brugeren uploader en vagtplan (ICS), parser appen ikke kun tillægstimer — den kører også et arbejdsmiljøtjek mod danske regler for hviletid, fridøgn og natarbejde. Resultatet vises som en checkliste med grønne flueben og gule/røde advarsler.

---

## Regler der skal tjekkes

### Regel 1: Min. 11 timers hviletid mellem vagter
**Kilde:** Arbejdsmiljøloven §3 (bekendtgørelse om hvileperiode og fridøgn)
**Regel:** Mellem to arbejdsperioder skal der være mindst 11 sammenhængende timers hvile.
**Beregning:**
```
for each consecutive pair of shifts (A, B):
  rest_hours = B.start - A.end
  if rest_hours < 11:
    flag WARNING
```
**Eksempel:** Aftenvagt slutter 22:00 → næste vagt må tidligst starte 09:00.

### Regel 2: Max 3 nattevagter i træk
**Kilde:** NFA's anbefalinger om natarbejde, implementeret via Protokollat 13 i Brancheoverenskomst for vagtassistenter
**Regel:** Højst 3 nattevagter i træk.
**Definition af nattevagt:** En vagt der inkluderer arbejde i tidsrummet kl. 23:00-06:00 i mindst 3 timer.
**Beregning:**
```
consecutive_night_count = 0
for each day:
  if shift overlaps 23:00-06:00 by >= 3 hours:
    consecutive_night_count += 1
    if consecutive_night_count > 3:
      flag WARNING
  else:
    consecutive_night_count = 0
```
**Mikkel-demo:** Uge 3 har 4 nattevagter i træk (tir 13. - fre 16. januar, alle 22:00-06:00) → WARNING.

### Regel 3: Max 9 timer pr. vagt
**Kilde:** NFA's anbefalinger om natarbejde (Protokollat 13)
**Regel:** Nattevagter bør højst vare 9 timer.
**Beregning:**
```
for each shift:
  duration = shift.end - shift.start
  if is_night_shift AND duration > 9 hours:
    flag WARNING
```
**Mikkel-demo:** Alle vagter er 8 timer → OK.

### Regel 4: Fridøgn pr. 7 dage
**Kilde:** Arbejdsmiljøloven §4 (bekendtgørelse om hvileperiode og fridøgn)
**Regel:** Inden for hver periode på 7 dage skal der være mindst ét fridøgn (sammenhængende 24 timer hvile).
**Beregning:**
```
for each rolling 7-day window:
  find longest continuous rest period
  if longest_rest < 24 hours:
    flag WARNING
```
**Note:** Fridøgnet skal "så vidt muligt" falde på en søndag og "så vidt muligt" i sammenhæng med daglig hvileperiode (= 35 timers sammenhængende hvile).

### Regel 5: Gravides natarbejde (§4, stk. 2)
**Kilde:** Overenskomstens §4, stk. 2
**Regel:** Gravide må højst arbejde 1 nattevagt om ugen. Arbejdsgiver skal omlægge inden 2 uger efter underretning.
**Implementering:** Denne regel er kun relevant hvis brugeren har markeret graviditet i sin profil. I demoen: vis reglen som info-kort under arbejdsmiljø-sektionen, ikke som et automatisk tjek.

### Regel 6: Varskotillæg ved vagtændring (§3, stk. 6)
**Kilde:** Overenskomstens §3, stk. 6
**Regel:** Hvis en vagtassistents tjeneste ændres med mere end 3½ time inden for 8 dage i forhold til udsat mødetid → varskotillæg (522,93 kr. pr. gang pr. 01.05.2025).
**Implementering:** Kræver sammenligning af to versioner af vagtplanen (original vs. ændret). I demoen: vis reglen som info, men det automatiske tjek kræver at brugeren uploader den originale vagtplan + den ændrede.

---

## ICS Parsing Logic

```python
def parse_ics_for_shifts(ics_content):
    """
    Parse ICS file and extract shifts as list of:
    {
      'date': date,
      'start': datetime,
      'end': datetime,
      'duration_hours': float,
      'is_night_shift': bool,  # overlaps 23-06 by >= 3 hours
      'night_hours': float,    # hours between 23-06
      'is_weekend': bool,
      'is_holiday': bool,
      'summary': str
    }
    """
    shifts = []
    for event in ics_events:
        if event has DTSTART with time (not DATE-only):
            start = parse_datetime(event.DTSTART)
            end = parse_datetime(event.DTEND)
            
            duration = (end - start).total_seconds() / 3600
            
            # Calculate night hours (23:00-06:00)
            night_hours = calculate_overlap(start, end, 
                                            time(23,0), time(6,0))
            
            shifts.append({
                'date': start.date(),
                'start': start,
                'end': end,
                'duration_hours': duration,
                'is_night_shift': night_hours >= 3,
                'night_hours': night_hours,
                'is_weekend': start.weekday() >= 5,
                'summary': event.SUMMARY
            })
    
    return sorted(shifts, key=lambda s: s['start'])


def run_arbejdsmiljo_check(shifts):
    """
    Run all arbejdsmiljø rules against parsed shifts.
    Returns list of check results.
    """
    results = []
    
    # Rule 1: Min. 11 hours rest between shifts
    violations_rest = []
    for i in range(len(shifts) - 1):
        rest = (shifts[i+1]['start'] - shifts[i]['end']).total_seconds() / 3600
        if rest < 11:
            violations_rest.append({
                'date': shifts[i]['date'],
                'rest_hours': round(rest, 1),
                'shift_end': shifts[i]['end'].strftime('%H:%M'),
                'next_shift_start': shifts[i+1]['start'].strftime('%H:%M'),
            })
    
    results.append({
        'rule': 'Min. 11 timers hviletid mellem vagter',
        'source': 'Arbejdsmiljøloven §3',
        'status': 'ok' if not violations_rest else 'warning',
        'violations': violations_rest,
        'description': f'{len(violations_rest)} overtrædelse(r)' if violations_rest 
                       else 'Alle vagter har min. 11 timers hvile'
    })
    
    # Rule 2: Max 3 consecutive night shifts
    max_consecutive = 0
    current_streak = 0
    streak_dates = []
    worst_streak = []
    
    # Group shifts by date
    from collections import defaultdict
    by_date = defaultdict(list)
    for s in shifts:
        by_date[s['date']].append(s)
    
    all_dates = sorted(by_date.keys())
    for d in all_dates:
        day_shifts = by_date[d]
        has_night = any(s['is_night_shift'] for s in day_shifts)
        if has_night:
            current_streak += 1
            streak_dates.append(d)
            if current_streak > max_consecutive:
                max_consecutive = current_streak
                worst_streak = streak_dates.copy()
        else:
            current_streak = 0
            streak_dates = []
    
    results.append({
        'rule': 'Max 3 nattevagter i træk',
        'source': 'NFA anbefalinger / Protokollat 13',
        'status': 'ok' if max_consecutive <= 3 else 'warning',
        'max_consecutive': max_consecutive,
        'worst_streak_dates': worst_streak,
        'description': f'{max_consecutive} nattevagter i træk' + 
                       (f' (uge {worst_streak[0].isocalendar()[1]})' if max_consecutive > 3 else '')
    })
    
    # Rule 3: Max 9 hours per night shift
    long_night_shifts = [s for s in shifts 
                         if s['is_night_shift'] and s['duration_hours'] > 9]
    
    results.append({
        'rule': 'Max 9 timer pr. nattevagt',
        'source': 'NFA anbefalinger / Protokollat 13',
        'status': 'ok' if not long_night_shifts else 'warning',
        'violations': [{'date': s['date'], 'hours': s['duration_hours']} 
                       for s in long_night_shifts],
        'description': f'{len(long_night_shifts)} for lange nattevagter' if long_night_shifts
                       else 'Alle nattevagter er under 9 timer'
    })
    
    # Rule 4: Fridøgn per 7 days
    violations_fridogn = []
    if all_dates:
        first = min(s['start'] for s in shifts).date()
        last = max(s['end'] for s in shifts).date()
        
        from datetime import timedelta
        check_date = first
        while check_date + timedelta(days=6) <= last:
            window_end = check_date + timedelta(days=6)
            
            # Find all shifts in this 7-day window
            window_shifts = sorted(
                [s for s in shifts if check_date <= s['date'] <= window_end],
                key=lambda s: s['start']
            )
            
            # Find longest rest gap
            max_rest = 0
            if window_shifts:
                for i in range(len(window_shifts) - 1):
                    gap = (window_shifts[i+1]['start'] - window_shifts[i]['end']).total_seconds() / 3600
                    max_rest = max(max_rest, gap)
            
            if max_rest < 24 and len(window_shifts) > 0:
                violations_fridogn.append({
                    'week_start': check_date,
                    'max_rest_hours': round(max_rest, 1)
                })
            
            check_date += timedelta(days=1)
    
    results.append({
        'rule': 'Fridøgn pr. 7 dage (min. 24 timers sammenhængende hvile)',
        'source': 'Arbejdsmiljøloven §4',
        'status': 'ok' if not violations_fridogn else 'warning',
        'violations': violations_fridogn,
        'description': f'{len(violations_fridogn)} uge(r) uden fridøgn' if violations_fridogn
                       else 'Fridøgn overholdt i alle uger'
    })
    
    return results
```

---

## UI: Hvordan det skal vises

### På vagtplan-siden (efter upload)

Tilføj en sektion under vagtplan-oversigten:

```
┌─────────────────────────────────────────┐
│ 🛡️ ARBEJDSMILJØTJEK                    │
│                                         │
│ ✅ Min. 11 timers hviletid              │
│    Alle vagter har min. 11 timers hvile │
│                                         │
│ ⚠️ Max 3 nattevagter i træk            │
│    4 nattevagter i træk (uge 3)         │
│    → NFA anbefaler max 3.               │
│    → Virksomheden skal gennemføre       │
│      særlig APV (Protokollat 13)        │
│                                         │
│ ✅ Max 9 timer pr. nattevagt            │
│    Alle nattevagter er under 9 timer    │
│                                         │
│ ✅ Fridøgn pr. 7 dage                   │
│    Fridøgn overholdt i alle uger        │
│                                         │
│ 3/4 regler overholdt                    │
└─────────────────────────────────────────┘
```

### Styling

- Grønt flueben (✅) for OK
- Gul advarsel (⚠️) for WARNING (overtrædelse af anbefaling, ikke lov)
- Rød fejl (❌) for ERROR (overtrædelse af lovkrav — regel 1 og 4)
- Hvert punkt kan ekspanderes for at vise detaljer (hvilke datoer, hvilke vagter)
- Kildehenvisning (lovparagraf) vises i lille tekst under hvert punkt

### På dashboard (hjem-siden)

Hvis der er advarsler, vis det i vagtplan-kortet:

```
┌──────────────────┐  ┌──────────────────┐
│ 📋 KONTRAKT      │  │ 📅 VAGTPLAN      │
│ Securitas A/S    │  │ Næste vagt: ...  │
│ 1 afvigelse      │  │ ⚠️ 1 advarsel   │
└──────────────────┘  └──────────────────┘
```

---

## Mikkels demo-data: Forventede resultater

Med den eksisterende ICS (schedule_mikkel_jan_may_2026.ics):

```
JANUAR 2026:
├── Regel 1 (11t hvile): ✅ OK
│   Alle skift har tilstrækkelig hvile
│   (Natvagt 22-06 → næste vagt tidligst 17:00 = 11t OK)
│
├── Regel 2 (max 3 nat i træk): ⚠️ WARNING
│   Uge 3: tir 13., ons 14., tor 15., fre 16. = 4 nattevagter
│   NFA anbefaler max 3 → særlig APV påkrævet
│
├── Regel 3 (max 9t nattevagt): ✅ OK
│   Alle nattevagter er 8 timer (22:00-06:00)
│
└── Regel 4 (fridøgn/7 dage): ✅ OK
    Alle uger har min. 1 helt fridøgn

SAMLET: 3/4 OK, 1 advarsel
```

---

## Datakilder for reglerne

```
ALLE REGLER KAN UDLEDES FRA:
├── ICS-filen (vagtplan)
│   → Start/slut-tidspunkter for alle vagter
│   → Beregning af hvileperioder, nattimer, fridøgn
│
├── Overenskomsten (Protokollat 13)
│   → NFA's anbefalinger: max 3 nat, max 9t, 11t hvile
│   → Konsekvens: særlig APV, helbredskontrol
│   → Udvidet helbredskontrol for 50+ ved overtrædelse
│
├── Arbejdsmiljøloven
│   → §3: 11 timers hvileperiode (lovkrav)
│   → §4: Fridøgn pr. 7 dage (lovkrav)
│
└── Ingen eksterne data nødvendige
```

---

## Implementeringsnoter til Cursor

1. ICS-parsing: Brug en ICS-parser (fx `ical.js` i frontend eller `node-ical` i backend) til at ekstrahere VEVENT'er med DTSTART/DTEND.

2. Natvagt-klassificering: En vagt er en "nattevagt" hvis den overlapper tidsrummet 23:00-06:00 med mindst 3 timer. En aftenvagt 14:00-22:00 er IKKE en nattevagt. En natvagt 22:00-06:00 har 7 timers overlap (23:00-06:00) → er nattevagt.

3. Hvileperiode-beregning: Sortér alle vagter kronologisk. For hvert par (vagt N, vagt N+1): rest = vagt(N+1).start - vagt(N).end. Husk at natvagter kan slutte næste dag (22:00 → 06:00+1d).

4. Fridøgn: Brug et rullende 7-dages vindue. For hvert vindue: find den længste sammenhængende periode uden arbejde. Hvis < 24 timer → violation.

5. Feature-flag: Arbejdsmiljøtjek er relevant for VSL og FOA (skiftehold), men IKKE for Djøf (fast dagtid). Vis kun sektionen for profiler med vagtplan/ICS.
