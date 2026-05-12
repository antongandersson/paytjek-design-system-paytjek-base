/**
 * Arbejdsmiljø & Hviletidstjek
 *
 * Kører 4 regler mod en vagtplan:
 *  Regel 1: Min. 11 timers hviletid mellem vagter (Arbejdsmiljøloven §3)
 *  Regel 2: Max 3 nattevagter i træk (NFA / Protokollat 13)
 *  Regel 3: Max 9 timers nattevagt (NFA / Protokollat 13)
 *  Regel 4: Fridøgn pr. 7 dage (Arbejdsmiljøloven §4)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArbejdsmiljoShift {
  date: string | Date;
  time?: string;
  type: string;
}

export interface ArbejdsmiljoViolation {
  label: string;
  detail: string;
}

export interface ArbejdsmiljoResult {
  rule: string;
  source: string;
  /** error = lovkrav brudt, warning = anbefaling brudt, ok = alt godt */
  status: "ok" | "warning" | "error";
  description: string;
  violations: ArbejdsmiljoViolation[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** ISO ugenummer (1-53) for en given dato */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function toDate(d: string | Date): Date {
  return d instanceof Date ? d : new Date(d);
}

function formatDaDate(d: Date): string {
  const days = ["søn", "man", "tir", "ons", "tor", "fre", "lør"];
  const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${days[d.getDay()]}. ${d.getDate()}. ${months[d.getMonth()]}`;
}

/** Overlapstimer mellem to tidsintervaller */
function overlapHours(s1: Date, e1: Date, s2: Date, e2: Date): number {
  const start = Math.max(s1.getTime(), s2.getTime());
  const end = Math.min(e1.getTime(), e2.getTime());
  return Math.max(0, (end - start) / (1000 * 60 * 60));
}

interface ParsedShift {
  raw: ArbejdsmiljoShift;
  start: Date;
  end: Date;
  durationHours: number;
  isNightShift: boolean;  // overlapper 23:00-06:00 med >= 3 timer
  nightOverlapHours: number;
}

/**
 * Parser "HH:MM-HH:MM"-strengen og kombinerer med datoen.
 * Håndterer cross-midnight vagter (22:00-06:00 → slutter næste dag).
 * Returnerer null for fridage/sygdom/vagter uden tidspunkt.
 */
function parseShiftTimes(s: ArbejdsmiljoShift): ParsedShift | null {
  if (s.type === "day-off" || s.type === "sick" || !s.time) return null;

  const match = s.time.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [, sh, sm, eh, em] = match.map(Number);
  const base = toDate(s.date);

  const start = new Date(base);
  start.setHours(sh, sm, 0, 0);

  const end = new Date(base);
  end.setHours(eh, em, 0, 0);
  if (end <= start) end.setDate(end.getDate() + 1); // cross-midnight

  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  // Ignorer all-day events der er misklassificeret (duration 0 eller >= 23t)
  if (durationHours <= 0 || durationHours >= 23) return null;

  // 23:00-06:00 overlap (kan spænde to dage)
  const n1s = new Date(base); n1s.setHours(23, 0, 0, 0);
  const n1e = new Date(base); n1e.setDate(n1e.getDate() + 1); n1e.setHours(6, 0, 0, 0);
  const n2s = new Date(base); n2s.setDate(n2s.getDate() - 1); n2s.setHours(23, 0, 0, 0);
  const n2e = new Date(base); n2e.setHours(6, 0, 0, 0);

  const nightOverlapHours = overlapHours(start, end, n1s, n1e) + overlapHours(start, end, n2s, n2e);

  return {
    raw: s,
    start,
    end,
    durationHours,
    isNightShift: nightOverlapHours >= 3,
    nightOverlapHours,
  };
}

// ─── Regler ───────────────────────────────────────────────────────────────────

function checkRegel1(parsed: ParsedShift[]): ArbejdsmiljoResult {
  const violations: ArbejdsmiljoViolation[] = [];

  const sorted = [...parsed].sort((a, b) => a.start.getTime() - b.start.getTime());

  for (let i = 0; i < sorted.length - 1; i++) {
    const restHours = (sorted[i + 1].start.getTime() - sorted[i].end.getTime()) / (1000 * 60 * 60);
    if (restHours < 11) {
      const roundedRest = Math.round(restHours * 10) / 10;
      violations.push({
        label: `${formatDaDate(sorted[i].start)} → ${formatDaDate(sorted[i + 1].start)}`,
        detail: `Kun ${roundedRest}t hvile (krav: 11t). Vagt slutter ${sorted[i].raw.time?.split("-")[1] ?? "?"}, næste starter ${sorted[i + 1].raw.time?.split("-")[0] ?? "?"}.`,
      });
    }
  }

  return {
    rule: "Min. 11 timers hviletid mellem vagter",
    source: "Arbejdsmiljøloven §3",
    status: violations.length > 0 ? "error" : "ok",
    description: violations.length > 0
      ? `${violations.length} overtrædelse${violations.length > 1 ? "r" : ""} af hvileperiodekravet`
      : "Alle vagter har min. 11 timers hvile",
    violations,
  };
}

function checkRegel2(parsed: ParsedShift[]): ArbejdsmiljoResult {
  const violations: ArbejdsmiljoViolation[] = [];

  // Grupper nattevagter pr. dato (brug start-datoen)
  const nightByDate = new Map<string, Date>();
  for (const p of parsed) {
    if (p.isNightShift) {
      const key = p.start.toISOString().split("T")[0];
      nightByDate.set(key, p.start);
    }
  }

  const nightDates = [...nightByDate.values()].sort((a, b) => a.getTime() - b.getTime());

  let streak: Date[] = [];
  let maxStreak: Date[] = [];

  for (let i = 0; i < nightDates.length; i++) {
    if (streak.length === 0) {
      streak = [nightDates[i]];
    } else {
      const prev = streak[streak.length - 1];
      const diffDays = Math.round((nightDates[i].getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        streak.push(nightDates[i]);
      } else {
        if (streak.length > maxStreak.length) maxStreak = streak;
        streak = [nightDates[i]];
      }
    }
    if (streak.length > maxStreak.length) maxStreak = streak;
  }

  if (maxStreak.length > 3) {
    const week = getISOWeek(maxStreak[0]);
    violations.push({
      label: `Uge ${week}: ${maxStreak.length} nattevagter i træk`,
      detail: `${formatDaDate(maxStreak[0])} – ${formatDaDate(maxStreak[maxStreak.length - 1])}. NFA anbefaler max 3 — særlig APV påkrævet (Protokollat 13).`,
    });
  }

  return {
    rule: "Max 3 nattevagter i træk",
    source: "NFA anbefalinger / Protokollat 13",
    status: violations.length > 0 ? "warning" : "ok",
    description: violations.length > 0
      ? `${maxStreak.length} nattevagter i træk (uge ${getISOWeek(maxStreak[0])})`
      : "Max 3 nattevagter i træk overholdt",
    violations,
  };
}

function checkRegel3(parsed: ParsedShift[]): ArbejdsmiljoResult {
  const violations: ArbejdsmiljoViolation[] = parsed
    .filter((p) => p.isNightShift && p.durationHours > 9)
    .map((p) => ({
      label: formatDaDate(p.start),
      detail: `Nattevagt på ${p.durationHours}t (max anbefalet: 9t). NFA anbefaler max 9 timers nattevagt.`,
    }));

  return {
    rule: "Max 9 timer pr. nattevagt",
    source: "NFA anbefalinger / Protokollat 13",
    status: violations.length > 0 ? "warning" : "ok",
    description: violations.length > 0
      ? `${violations.length} nattevagt${violations.length > 1 ? "er" : ""} over 9 timer`
      : "Alle nattevagter er under 9 timer",
    violations,
  };
}

function checkRegel4(parsed: ParsedShift[]): ArbejdsmiljoResult {
  if (parsed.length === 0) {
    return {
      rule: "Fridøgn pr. 7 dage (min. 24 timers sammenhængende hvile)",
      source: "Arbejdsmiljøloven §4",
      status: "ok",
      description: "Fridøgn overholdt i alle uger",
      violations: [],
    };
  }

  const sorted = [...parsed].sort((a, b) => a.start.getTime() - b.start.getTime());
  const violations: ArbejdsmiljoViolation[] = [];

  const firstDay = new Date(sorted[0].start);
  firstDay.setHours(0, 0, 0, 0);
  const lastDay = new Date(sorted[sorted.length - 1].end);
  lastDay.setHours(0, 0, 0, 0);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const checkedWeeks = new Set<string>();

  let windowStart = new Date(firstDay);
  while (windowStart.getTime() + 6 * ONE_DAY <= lastDay.getTime()) {
    const windowEnd = new Date(windowStart.getTime() + 7 * ONE_DAY);

    const windowShifts = sorted.filter(
      (p) => p.start < windowEnd && p.end > windowStart
    );

    let maxRest = 0;
    if (windowShifts.length === 0) {
      maxRest = 7 * 24;
    } else {
      // Gap before first shift in window
      const gapBefore = (windowShifts[0].start.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
      maxRest = Math.max(maxRest, gapBefore);
      // Gaps between shifts
      for (let i = 0; i < windowShifts.length - 1; i++) {
        const gap = (windowShifts[i + 1].start.getTime() - windowShifts[i].end.getTime()) / (1000 * 60 * 60);
        maxRest = Math.max(maxRest, gap);
      }
      // Gap after last shift
      const gapAfter = (windowEnd.getTime() - windowShifts[windowShifts.length - 1].end.getTime()) / (1000 * 60 * 60);
      maxRest = Math.max(maxRest, gapAfter);
    }

    if (maxRest < 24 && windowShifts.length > 0) {
      const week = getISOWeek(windowStart);
      const weekKey = `${windowStart.getFullYear()}-W${week}`;
      if (!checkedWeeks.has(weekKey)) {
        checkedWeeks.add(weekKey);
        violations.push({
          label: `Uge ${week} (${formatDaDate(windowStart)} – ${formatDaDate(new Date(windowEnd.getTime() - ONE_DAY))})`,
          detail: `Længste sammenhængende hvileperiode: ${Math.round(maxRest * 10) / 10}t. Lovkrav: min. 24t fridøgn per 7 dage.`,
        });
      }
    }

    windowStart = new Date(windowStart.getTime() + ONE_DAY);
  }

  return {
    rule: "Fridøgn pr. 7 dage (min. 24 timers sammenhængende hvile)",
    source: "Arbejdsmiljøloven §4",
    status: violations.length > 0 ? "error" : "ok",
    description: violations.length > 0
      ? `${violations.length} uge${violations.length > 1 ? "r" : ""} uden lovpligtigt fridøgn`
      : "Fridøgn overholdt i alle uger",
    violations,
  };
}

// ─── Hoved-funktion ───────────────────────────────────────────────────────────

/**
 * Kør alle 4 arbejdsmiljøregler mod vagtplanen.
 *
 * @param shifts - Array af vagter fra CalendarContext eller CalendarGrid
 * @returns Array af resultater, én per regel
 */
export function runArbejdsmiljoCheck(shifts: ArbejdsmiljoShift[]): ArbejdsmiljoResult[] {
  const parsed = shifts.flatMap((s) => {
    const p = parseShiftTimes(s);
    return p ? [p] : [];
  });

  if (parsed.length === 0) return [];

  return [
    checkRegel1(parsed),
    checkRegel2(parsed),
    checkRegel3(parsed),
    checkRegel4(parsed),
  ];
}

/** Antal regler der er brudt (status error eller warning) */
export function countArbejdsmiljoIssues(results: ArbejdsmiljoResult[]): number {
  return results.filter((r) => r.status !== "ok").length;
}
