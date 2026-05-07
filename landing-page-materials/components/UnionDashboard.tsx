/**
 * PayTjek — Fagforenings-Dashboard (B2B Demo)
 *
 * Viser hvad fagforeninger (HK, 3F, etc.) får adgang til via PayTjek.
 * Alle data er fiktive demo-data til landing page / pitch formål.
 *
 * Dependencies: React, recharts, lucide-react
 *
 * Usage: <UnionDashboard />
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Download,
  Bell,
  Settings,
  Menu,
  X,
  Users,
  FileText,
  Building2,
  Lock,
  Zap,
  BarChart3,
  Map,
  Inbox,
  Search,
  Filter,
  Send,
  RefreshCw,
  Globe,
  Eye,
  Server,
} from "lucide-react";

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  sidebar: "#080F1D",
  sidebarBorder: "rgba(255,255,255,0.06)",
  bg: "#F0F2F8",
  card: "#FFFFFF",
  accent: "#4F46E5",
  accentHover: "#4338CA",
  accentSoft: "rgba(79,70,229,0.10)",
  accentBorder: "rgba(79,70,229,0.20)",
  accentText: "#818CF8",
  text: "#102029",
  subtext: "#5F6B73",
  border: "#E4E8EE",
  ok: "#146B68",
  okBg: "#ECFDF5",
  error: "#DC2626",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  warning: "#D97706",
  warningBg: "#FFFBEB",
  warningBorder: "#FDE68A",
  red400: "#F87171",
  red200: "#FECACA",
  amber200: "#FDE68A",
  yellow200: "#FEF08A",
  green200: "#BBF7D0",
  orange200: "#FED7AA",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const KPI_DATA = [
  {
    label: "Genvundet til Medlemmer",
    value: "24,5 mio. kr.",
    trend: "+12%",
    up: true,
    color: C.ok,
    bg: C.okBg,
  },
  {
    label: "Fastholdelseseffekt",
    value: "+40%",
    trend: "vs. ikke-brugere",
    up: true,
    color: C.accent,
    bg: C.accentSoft,
  },
  {
    label: "Automatiseringsgrad",
    value: "85%",
    trend: "Løst af AI",
    up: true,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    label: "Kritiske Arbejdsgivere",
    value: "3",
    trend: "Høj risiko flagget",
    up: false,
    color: C.error,
    bg: C.errorBg,
  },
];

const REGIONS = [
  {
    id: "nordjylland",
    name: "Nordjylland",
    fejl: 8234,
    topSynder: "OK Supermarked",
    level: 2,
    path: "M 97,8 L 130,2 L 152,11 L 162,27 L 156,43 L 167,51 L 140,60 L 112,60 L 89,47 L 91,27 Z",
  },
  {
    id: "midtvest",
    name: "MidtVest",
    fejl: 6891,
    topSynder: "Bestseller A/S",
    level: 1,
    path: "M 89,60 L 112,60 L 130,60 L 128,128 L 86,132 L 71,113 L 73,83 Z",
  },
  {
    id: "ostjylland",
    name: "Østjylland",
    fejl: 11203,
    topSynder: "Aarhus Universitetshospital",
    level: 3,
    path: "M 130,60 L 140,60 L 167,51 L 177,66 L 182,98 L 174,128 L 148,132 L 128,128 Z",
  },
  {
    id: "sydjylland",
    name: "Sydjylland",
    fejl: 7456,
    topSynder: "Jysk A/S",
    level: 2,
    path: "M 71,113 L 86,132 L 128,128 L 148,132 L 174,128 L 167,168 L 131,181 L 85,170 L 71,153 Z",
  },
  {
    id: "fyn",
    name: "Fyn",
    fejl: 5124,
    topSynder: "OUH",
    level: 1,
    path: "M 172,152 L 206,146 L 217,162 L 204,178 L 177,183 L 161,171 Z",
  },
  {
    id: "sjaelland",
    name: "Sjælland",
    fejl: 9876,
    topSynder: "Rema 1000",
    level: 3,
    path: "M 222,135 L 256,130 L 260,152 L 242,178 L 226,196 L 207,188 L 199,174 L 215,163 L 222,148 Z",
  },
  {
    id: "hovedstaden",
    name: "Hovedstaden",
    fejl: 12400,
    topSynder: "Salling Group",
    level: 4,
    path: "M 256,130 L 272,135 L 278,154 L 268,168 L 256,166 L 260,152 Z",
  },
];

const REGION_COLORS = [
  { level: 0, fill: "#DCFCE7", stroke: "#86EFAC" },
  { level: 1, fill: "#FEF9C3", stroke: "#FDE047" },
  { level: 2, fill: "#FED7AA", stroke: "#FB923C" },
  { level: 3, fill: "#FECACA", stroke: "#F87171" },
  { level: 4, fill: "#FDA4AF", stroke: "#FB7185" },
];

const SECTOR_DATA = [
  { name: "HK Handel", gennemsnitsfejl: 842, fejlrate: 62, mindstelon: 34 },
  { name: "HK Privat", gennemsnitsfejl: 2240, fejlrate: 28, mindstelon: 41 },
  { name: "HK Stat", gennemsnitsfejl: 1180, fejlrate: 35, mindstelon: 28 },
];

const TRIAGE_DATA = [
  {
    id: "#4421",
    status: "error",
    navn: "Mathias Pedersen",
    virksomhed: "Elgiganten",
    fejltype: "Under Mindsteløn (§4)",
    beloeb: "-450 kr.",
    dato: "I dag",
    expanded: false,
  },
  {
    id: "#9923",
    status: "warning",
    navn: "Mette Høgh",
    virksomhed: "Magasin",
    fejltype: "Lokalaftale uafklaret",
    beloeb: "?",
    dato: "I går",
    expanded: false,
  },
  {
    id: "#1120",
    status: "error",
    navn: "Jonas Kristensen",
    virksomhed: "Region Sjælland",
    fejltype: "Manglende søndagstillæg",
    beloeb: "-1.200 kr.",
    dato: "2 dage siden",
    expanded: false,
  },
  {
    id: "#7734",
    status: "warning",
    navn: "Sara Nielsen",
    virksomhed: "Netto",
    fejltype: "Manglende fritvalgskonto",
    beloeb: "-875 kr.",
    dato: "3 dage siden",
    expanded: false,
  },
  {
    id: "#3301",
    status: "error",
    navn: "Camilla Andersen",
    virksomhed: "Bilka",
    fejltype: "Forkert anciennitetstrin",
    beloeb: "-320 kr.",
    dato: "4 dage siden",
    expanded: false,
  },
];

const COCKPIT_COMPARISON = [
  { post: "Grundløn", lonseddel: "24.500", forventet: "24.500", ok: true },
  { post: "Fritvalgskonto (7%)", lonseddel: "0", forventet: "1.715", ok: false },
  { post: "Pension (12%)", lonseddel: "2.400", forventet: "2.940", ok: false },
  { post: "ATP", lonseddel: "99", forventet: "99", ok: true },
  { post: "AM-bidrag (8%)", lonseddel: "1.960", forventet: "1.960", ok: true },
];

const COMPANY_DATA = [
  {
    name: "Salling Group",
    fejlrate: 45,
    fejl: 3842,
    type: "Manglende hviletid",
    beloeb: "2,1 mio.",
    subs: ["Netto", "Føtex", "Bilka"],
    expanded: false,
  },
  {
    name: "Elgiganten",
    fejlrate: 38,
    fejl: 1241,
    type: "Under Mindsteløn",
    beloeb: "890 t.",
    subs: [],
    expanded: false,
  },
  {
    name: "Region Sjælland",
    fejlrate: 31,
    fejl: 987,
    type: "Manglende søndagstillæg",
    beloeb: "760 t.",
    subs: ["OUH", "Holbæk Sygehus"],
    expanded: false,
  },
  {
    name: "Magasin",
    fejlrate: 28,
    fejl: 712,
    type: "Lokalaftale-brud",
    beloeb: "540 t.",
    subs: [],
    expanded: false,
  },
  {
    name: "OK Supermarked",
    fejlrate: 22,
    fejl: 534,
    type: "Forkert fritvalgsprocent",
    beloeb: "320 t.",
    subs: ["OK", "Dagli'Brugsen"],
    expanded: false,
  },
];

const TREND_DATA = [
  { dato: "Jan 24", fejlrate: 28 },
  { dato: "Feb 24", fejlrate: 31 },
  { dato: "Mar 24", fejlrate: 52, spike: true },
  { dato: "Apr 24", fejlrate: 48 },
  { dato: "Maj 24", fejlrate: 44 },
  { dato: "Jun 24", fejlrate: 40 },
  { dato: "Jul 24", fejlrate: 37 },
  { dato: "Aug 24", fejlrate: 35 },
  { dato: "Sep 24", fejlrate: 33 },
  { dato: "Okt 24", fejlrate: 31 },
  { dato: "Nov 24", fejlrate: 29 },
  { dato: "Dec 24", fejlrate: 27 },
];

const LOGIC_PARAMS = [
  { param: "min_wage_hourly", value: "134,50", unit: "kr./t", validFrom: "2024-03-01", active: true },
  { param: "pension_employer", value: "10,00", unit: "%", validFrom: "2023-01-01", active: true },
  { param: "pension_employee", value: "2,00", unit: "%", validFrom: "2023-01-01", active: true },
  { param: "sunday_supplement", value: "42,00", unit: "%", validFrom: "2024-03-01", active: true },
  { param: "evening_supplement_start", value: "18:00", unit: "tid", validFrom: "2024-03-01", active: true },
  { param: "overtime_tier1_pct", value: "50,00", unit: "%", validFrom: "2022-06-01", active: true },
  { param: "overtime_tier2_pct", value: "100,00", unit: "%", validFrom: "2022-06-01", active: true },
  { param: "fritvalg_pct", value: "7,00", unit: "%", validFrom: "2024-03-01", active: true },
];

const INITIAL_LOG = [
  { time: "14:02:11", msg: "AI Model Response Verified via SMT Logic", status: "pass" },
  { time: "14:02:15", msg: "Attempted Model Poisoning Detected", status: "block" },
  { time: "14:03:02", msg: "User 'Mette H.' accessed 'Region Sjælland' Report", status: "log" },
  { time: "14:04:18", msg: "Batch validation completed: 247 lønsedler", status: "pass" },
  { time: "14:05:00", msg: "TLS 1.3 certificate renewed — StackIT Frankfurt", status: "pass" },
];

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "strategisk", label: "Strategisk", icon: BarChart3 },
  { id: "sagsbehandling", label: "Sagsbehandling", icon: Inbox },
  { id: "virksomheder", label: "Virksomheder", icon: Building2 },
  { id: "logik", label: "Logik-motor", icon: Zap },
  { id: "sikkerhed", label: "Sikkerhed", icon: Shield },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Card({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: C.card,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        padding: "20px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: "0.8125rem",
        fontWeight: 700,
        color: C.subtext,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 16,
      }}
    >
      {children}
    </h3>
  );
}

function Badge({
  children,
  color,
  bg,
}: {
  children: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: bg,
        color,
        borderRadius: 9999,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

// ─── Denmark Map ─────────────────────────────────────────────────────────────
function DenmarkMap({ onHover }: { onHover: (r: (typeof REGIONS)[0] | null) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 300 240"
      style={{ width: "100%", maxWidth: 320, display: "block" }}
    >
      {/* Sea background */}
      <rect width="300" height="240" fill="#DBEAFE" rx="8" />

      {/* Water between islands (simplified) */}
      <rect x="160" y="130" width="60" height="60" fill="#DBEAFE" />
      <rect x="188" y="110" width="30" height="60" fill="#DBEAFE" />

      {REGIONS.map((region) => {
        const colors = REGION_COLORS[region.level];
        const isHovered = hovered === region.id;
        return (
          <path
            key={region.id}
            d={region.path}
            fill={isHovered ? C.accent : colors.fill}
            stroke={isHovered ? C.accentHover : colors.stroke}
            strokeWidth={isHovered ? 2 : 1}
            style={{ cursor: "pointer", transition: "fill 150ms, stroke 150ms" }}
            onMouseEnter={() => {
              setHovered(region.id);
              onHover(region);
            }}
            onMouseLeave={() => {
              setHovered(null);
              onHover(null);
            }}
          />
        );
      })}

      {/* Region labels (abbreviated) */}
      <text x="128" y="30" fontSize="7" fill="#374151" textAnchor="middle" fontWeight="600">Nordjylland</text>
      <text x="96" y="100" fontSize="6.5" fill="#374151" textAnchor="middle">MidtVest</text>
      <text x="154" y="98" fontSize="6.5" fill="#374151" textAnchor="middle">Østjylland</text>
      <text x="122" y="152" fontSize="6.5" fill="#374151" textAnchor="middle">Sydjylland</text>
      <text x="189" y="166" fontSize="6" fill="#374151" textAnchor="middle">Fyn</text>
      <text x="230" y="165" fontSize="6.5" fill="#374151" textAnchor="middle">Sjælland</text>
      <text x="263" y="152" fontSize="6" fill="#374151" textAnchor="middle">Hoved.</text>

      {/* Legend */}
      {["Lav", "Moderat", "Høj", "Kritisk"].map((label, i) => (
        <g key={label} transform={`translate(${6 + i * 48}, 220)`}>
          <rect width="14" height="10" rx="2" fill={REGION_COLORS[i + 0].fill} stroke={REGION_COLORS[i + 0].stroke} strokeWidth="1" />
          <text x="18" y="9" fontSize="7" fill="#6B7280">{label}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── VIEW 1: Strategisk Dashboard ─────────────────────────────────────────────
function StrategiskDashboard() {
  const [hoveredRegion, setHoveredRegion] = useState<(typeof REGIONS)[0] | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {KPI_DATA.map((kpi) => (
          <Card key={kpi.label} style={{ padding: "20px" }}>
            <p style={{ fontSize: 12, color: C.subtext, margin: "0 0 8px", fontWeight: 500 }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: "1.625rem", fontWeight: 800, color: C.text, margin: "0 0 6px", lineHeight: 1 }}>
              {kpi.value}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {kpi.up ? (
                <TrendingUp size={13} color={C.ok} />
              ) : (
                <TrendingDown size={13} color={C.error} />
              )}
              <span style={{ fontSize: 12, color: kpi.up ? C.ok : C.error, fontWeight: 600 }}>
                {kpi.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Map + Region info row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <SectionTitle>Geo-Politisk Fejlkort</SectionTitle>
          <DenmarkMap onHover={setHoveredRegion} />
          {hoveredRegion ? (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                background: C.accentSoft,
                borderRadius: 10,
                border: `1px solid ${C.accentBorder}`,
              }}
            >
              <p style={{ fontWeight: 700, color: C.text, fontSize: 13, margin: "0 0 2px" }}>
                {hoveredRegion.name}
              </p>
              <p style={{ color: C.subtext, fontSize: 12, margin: "0 0 2px" }}>
                {hoveredRegion.fejl.toLocaleString("da-DK")} fejl fundet
              </p>
              <p style={{ color: C.subtext, fontSize: 12, margin: 0 }}>
                Top synder: <strong style={{ color: C.text }}>{hoveredRegion.topSynder}</strong>
              </p>
            </div>
          ) : (
            <p style={{ marginTop: 12, fontSize: 12, color: C.subtext, textAlign: "center" }}>
              Hover over en region for detaljer
            </p>
          )}
        </Card>

        <Card>
          <SectionTitle>Sektorsammenligning — Gennemsnitlig Fejl pr. Lønseddel</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SECTOR_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.subtext }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.subtext }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12 }}
                formatter={(val: number, name: string) => [`${val} kr.`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="gennemsnitsfejl" name="Gns. fejlbeløb (kr.)" fill={C.accent} radius={[6, 6, 0, 0]} />
              <Bar dataKey="fejlrate" name="Fejlrate (%)" fill="#818CF8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <Badge color={C.error} bg={C.errorBg}>
              <AlertCircle size={10} /> HK Handel: Systematiske fejl
            </Badge>
            <Badge color="#7C3AED" bg="#F5F3FF">
              <Zap size={10} /> HK Privat: Store beløb
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── VIEW 2: Sagsbehandling ───────────────────────────────────────────────────
function Sagsbehandling() {
  const [rows, setRows] = useState(TRIAGE_DATA);
  const [selected, setSelected] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setSelected(selected === id ? null : id);
  };

  const selectedRow = rows.find((r) => r.id === selected);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, height: "100%" }}>
      {/* Left: Triage Inbox */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>
              Triage Inbox
            </h3>
            <p style={{ fontSize: 11, color: C.subtext, margin: 0 }}>
              {rows.filter((r) => r.status === "error").length} kritiske sager
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: C.subtext,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              <Filter size={12} /> Filter
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: C.subtext,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              <Search size={12} /> Søg
            </button>
          </div>
        </div>

        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "24px 60px 1fr 1fr 70px 70px",
            gap: 8,
            padding: "8px 20px",
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
            fontSize: 11,
            fontWeight: 600,
            color: C.subtext,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span />
          <span>ID</span>
          <span>Virksomhed</span>
          <span>Fejltype</span>
          <span>Beløb</span>
          <span>Dato</span>
        </div>

        {rows.map((row) => (
          <div
            key={row.id}
            onClick={() => toggleRow(row.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "24px 60px 1fr 1fr 70px 70px",
              gap: 8,
              padding: "12px 20px",
              borderBottom: `1px solid ${C.border}`,
              cursor: "pointer",
              background: selected === row.id ? C.accentSoft : "transparent",
              transition: "background 120ms",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: row.status === "error" ? C.error : C.warning,
                marginTop: 4,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{row.id}</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{row.virksomhed}</span>
            <span style={{ fontSize: 12, color: C.subtext }}>{row.fejltype}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: row.beloeb === "?" ? C.warning : C.error,
              }}
            >
              {row.beloeb}
            </span>
            <span style={{ fontSize: 11, color: C.subtext }}>{row.dato}</span>
          </div>
        ))}
      </Card>

      {/* Right: Verification Cockpit */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            background: C.accent,
          }}
        >
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Verification Cockpit
          </p>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>
            {selectedRow
              ? `Analyse: ${selectedRow.virksomhed} — ${selectedRow.id}`
              : "Vælg en sag fra inbox"}
          </h3>
        </div>

        {selectedRow ? (
          <div style={{ padding: "0 0 16px" }}>
            {/* Simulated payslip preview */}
            <div
              style={{
                margin: "16px 20px 0",
                background: "#FAFAFA",
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "monospace",
                fontSize: 11,
              }}
            >
              <p style={{ color: C.subtext, margin: "0 0 6px", fontWeight: 600 }}>
                📄 Lønseddel — {selectedRow.virksomhed}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.text }}>
                <span>Grundløn</span><span style={{ background: "#FEF9C3", padding: "0 4px" }}>24.500,00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.subtext }}>
                <span>Pension (medarbejder)</span><span>2.400,00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.error }}>
                <span style={{ background: "#FEE2E2", padding: "0 4px" }}>Fritvalgskonto</span>
                <span style={{ background: "#FEE2E2", padding: "0 4px" }}>0,00 ← Fejl</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.subtext }}>
                <span>AM-bidrag (8%)</span><span>1.960,00</span>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700, color: C.text }}>
                <span>Nettoløn</span><span>18.041,00</span>
              </div>
            </div>

            {/* Comparison table */}
            <div style={{ margin: "14px 20px 0" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.subtext, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                Butiksoverenskomsten 2024
              </p>
              {COCKPIT_COMPARISON.map((row) => (
                <div
                  key={row.post}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 80px 28px",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: row.ok ? "transparent" : C.errorBg,
                    marginBottom: 4,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: C.text }}>{row.post}</span>
                  <span style={{ fontSize: 12, color: C.subtext, textAlign: "right" }}>{row.lonseddel}</span>
                  <span style={{ fontSize: 12, color: C.text, textAlign: "right", fontWeight: 500 }}>{row.forventet}</span>
                  {row.ok ? (
                    <CheckCircle2 size={14} color={C.ok} />
                  ) : (
                    <XCircle size={14} color={C.error} />
                  )}
                </div>
              ))}
            </div>

            {/* Vagtplan alert */}
            <div
              style={{
                margin: "12px 20px 0",
                padding: "10px 14px",
                background: C.warningBg,
                border: `1px solid ${C.warningBorder}`,
                borderRadius: 10,
                fontSize: 12,
              }}
            >
              <p style={{ fontWeight: 700, color: C.warning, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 5 }}>
                <AlertTriangle size={12} /> Vagtplan-match
              </p>
              <p style={{ color: C.text, margin: 0 }}>Vagtplan (ICS): 14/02 18:00–22:00</p>
              <p style={{ color: C.text, margin: "2px 0 0" }}>Lønseddel: 0 timer registreret</p>
              <p style={{ color: C.warning, margin: "4px 0 0", fontWeight: 600 }}>
                → Manglende aftentillæg jf. vagtskema
              </p>
            </div>

            {/* Actions */}
            <div style={{ margin: "14px 20px 0", display: "flex", gap: 10 }}>
              <button
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: C.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 9999,
                  padding: "10px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Download size={13} /> Generér Krav (PDF)
              </button>
              <button
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "transparent",
                  color: C.accent,
                  border: `1.5px solid ${C.accent}`,
                  borderRadius: 9999,
                  padding: "10px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Send size={13} /> Send til Medlem
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 300,
              color: C.subtext,
              gap: 8,
            }}
          >
            <Eye size={32} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: 13, margin: 0 }}>Klik på en sag for at åbne cockpit</p>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── VIEW 3: Virksomheds-analyse ──────────────────────────────────────────────
function VirksomhedsAnalyse() {
  const [companies, setCompanies] = useState(COMPANY_DATA);
  const [sortBy, setSortBy] = useState<"fejlrate" | "fejl" | "beloeb">("fejlrate");

  const toggleExpand = (name: string) => {
    setCompanies((prev) =>
      prev.map((c) => ({ ...c, expanded: c.name === name ? !c.expanded : c.expanded }))
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Synder-liste */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Synder-Listen</h3>
              <p style={{ fontSize: 11, color: C.subtext, margin: 0 }}>Top arbejdsgivere — systematiske fejl</p>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: "#fff",
                background: C.accent,
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              <Download size={12} /> Eksporter
            </button>
          </div>

          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 80px 70px 80px",
              gap: 8,
              padding: "8px 16px",
              background: C.bg,
              borderBottom: `1px solid ${C.border}`,
              fontSize: 10,
              fontWeight: 700,
              color: C.subtext,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <span>#</span>
            <span>Virksomhed</span>
            <button
              onClick={() => setSortBy("fejlrate")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontWeight: sortBy === "fejlrate" ? 700 : 600,
                color: sortBy === "fejlrate" ? C.accent : C.subtext,
                padding: 0,
                fontSize: "inherit",
                textTransform: "uppercase",
                letterSpacing: "inherit",
              }}
            >
              Fejlrate {sortBy === "fejlrate" && "↓"}
            </button>
            <span>Fejl</span>
            <span>Beløb</span>
          </div>

          {[...companies]
            .sort((a, b) => (sortBy === "fejlrate" ? b.fejlrate - a.fejlrate : b.fejl - a.fejl))
            .map((company, i) => (
              <React.Fragment key={company.name}>
                <div
                  onClick={() => toggleExpand(company.name)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr 80px 70px 80px",
                    gap: 8,
                    padding: "11px 16px",
                    borderBottom: `1px solid ${C.border}`,
                    cursor: "pointer",
                    background: company.expanded ? C.accentSoft : "transparent",
                    transition: "background 120ms",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: i < 3 ? C.error : C.subtext,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{company.name}</span>
                    {company.subs.length > 0 && (
                      <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                        {company.subs.map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 9,
                              color: C.subtext,
                              background: C.bg,
                              borderRadius: 4,
                              padding: "1px 5px",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: C.border,
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${company.fejlrate}%`,
                          height: "100%",
                          background: company.fejlrate > 40 ? C.error : company.fejlrate > 25 ? C.warning : C.ok,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.text, flexShrink: 0 }}>
                      {company.fejlrate}%
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: C.subtext }}>{company.fejl.toLocaleString("da-DK")}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.error }}>{company.beloeb}</span>
                </div>
                {company.expanded && (
                  <div
                    style={{
                      padding: "10px 16px 12px 44px",
                      background: "#FDF8FF",
                      borderBottom: `1px solid ${C.border}`,
                      fontSize: 12,
                    }}
                  >
                    <p style={{ color: C.subtext, margin: "0 0 4px" }}>
                      Hyppigste fejl: <strong style={{ color: C.text }}>{company.type}</strong>
                    </p>
                    {company.subs.length > 0 && (
                      <p style={{ color: C.subtext, margin: 0 }}>
                        Underliggende enheder:{" "}
                        {company.subs.map((s, j) => (
                          <span key={s}>
                            <strong style={{ color: C.text }}>{s}</strong>
                            {j < company.subs.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                    )}
                    <button
                      style={{
                        marginTop: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: C.accent,
                        background: C.accentSoft,
                        border: `1px solid ${C.accentBorder}`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                    >
                      <Download size={10} /> Eksporter anonymiseret data (til OK-forhandling)
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
        </Card>

        {/* Trend chart */}
        <Card>
          <SectionTitle>Fejlrate efter 1. marts-regulering</SectionTitle>
          <p style={{ fontSize: 12, color: C.subtext, margin: "-8px 0 16px" }}>
            Bemærk spike ved ikrafttrædelse — arbejdsgivere opdaterer systemer for sent
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={TREND_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.accent} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="dato" tick={{ fontSize: 10, fill: C.subtext }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.subtext }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12 }}
                formatter={(val: number) => [`${val}%`, "Fejlrate"]}
              />
              <Area
                type="monotone"
                dataKey="fejlrate"
                stroke={C.accent}
                fill="url(#areaGradient)"
                strokeWidth={2.5}
                dot={(props) => {
                  const d = TREND_DATA[props.index];
                  if (d?.spike) {
                    return (
                      <circle
                        key={`dot-${props.index}`}
                        cx={props.cx}
                        cy={props.cy}
                        r={6}
                        fill={C.error}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }
                  return <circle key={`dot-${props.index}`} cx={props.cx} cy={props.cy} r={0} fill="none" />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: C.errorBg,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <AlertCircle size={14} color={C.error} />
            <span style={{ color: C.error, fontWeight: 600 }}>
              Marts 2024: +67% spike
            </span>
            <span style={{ color: C.subtext }}>
              — ny overenskomst trådte i kraft, men lønsystemer ikke opdateret
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── VIEW 4: Logik-motor ──────────────────────────────────────────────────────
function LogikMotor() {
  const [agreement, setAgreement] = useState("Landsoverenskomst for Butik");
  const [dragging, setDragging] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Parameter table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Parameter-tabel</h3>
            <p style={{ fontSize: 11, color: C.subtext, margin: 0 }}>SMT Solver inputs</p>
          </div>
          <select
            value={agreement}
            onChange={(e) => setAgreement(e.target.value)}
            style={{
              fontSize: 12,
              color: C.text,
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            <option>Landsoverenskomst for Butik</option>
            <option>Funktionæroverenskomst (HK/DE)</option>
            <option>Overenskomst for IT-området</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 90px 80px 100px",
            gap: 8,
            padding: "8px 20px",
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
            fontSize: 10,
            fontWeight: 700,
            color: C.subtext,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>Parameter</span>
          <span>Værdi</span>
          <span>Enhed</span>
          <span>Gyldig fra</span>
        </div>

        {LOGIC_PARAMS.map((p) => (
          <div
            key={p.param}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px 80px 100px",
              gap: 8,
              padding: "10px 20px",
              borderBottom: `1px solid ${C.border}`,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, fontFamily: "monospace", color: C.accent }}>
              {p.param}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                background: "#FAFAFA",
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: "2px 8px",
                textAlign: "right",
              }}
            >
              {p.value}
            </span>
            <span style={{ fontSize: 11, color: C.subtext }}>{p.unit}</span>
            <span style={{ fontSize: 11, color: C.subtext }}>{p.validFrom}</span>
          </div>
        ))}
      </Card>

      {/* Upload zone + logic rules */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <SectionTitle>Upload Lokalaftale</SectionTitle>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
            }}
            style={{
              border: `2px dashed ${dragging ? C.accent : C.border}`,
              borderRadius: 14,
              padding: "28px 20px",
              textAlign: "center",
              background: dragging ? C.accentSoft : "#FAFAFA",
              transition: "all 150ms",
            }}
          >
            <FileText size={28} color={dragging ? C.accent : C.subtext} style={{ margin: "0 auto 10px", display: "block" }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>
              Træk lokalaftale herind
            </p>
            <p style={{ fontSize: 11, color: C.subtext, margin: "0 0 12px" }}>
              PDF, DOCX — AI udtrækker parametre automatisk
            </p>
            <button
              style={{
                fontSize: 12,
                color: C.accent,
                background: C.accentSoft,
                border: `1px solid ${C.accentBorder}`,
                borderRadius: 9999,
                padding: "6px 16px",
                cursor: "pointer",
              }}
            >
              Vælg fil
            </button>
          </div>
        </Card>

        <Card>
          <SectionTitle>Logik-regler (Eksempel)</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { rule: "IF day_of_week == 7 THEN supplement += 42%", status: "active" },
              { rule: "IF hours > 37 AND hours <= 40 THEN rate *= 1.50", status: "active" },
              { rule: "IF hours > 40 THEN rate *= 2.00", status: "active" },
              { rule: "IF shift_start < 18:00 THEN evening_allowance = 0", status: "inactive" },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  background: "#FAFAFA",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: r.status === "active" ? C.accent : C.subtext,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{r.rule}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    color: r.status === "active" ? C.ok : C.subtext,
                    background: r.status === "active" ? C.okBg : C.bg,
                    borderRadius: 9999,
                    padding: "2px 7px",
                    fontWeight: 600,
                  }}
                >
                  {r.status === "active" ? "Aktiv" : "Inaktiv"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── VIEW 5: Sikkerhed & Audit ────────────────────────────────────────────────
function SikkerhedAudit() {
  const [logs, setLogs] = useState(INITIAL_LOG);
  const logRef = useRef<HTMLDivElement>(null);

  const NEW_LOG_ENTRIES = [
    { msg: "Batch validation: 18 lønsedler fra Netto analyseret", status: "pass" as const },
    { msg: "Zero-Trust policy refresh — 0 violations", status: "pass" as const },
    { msg: "User 'Lars B.' queried 'Salling Group' analytics", status: "log" as const },
    { msg: "AI inference: EU boundary check passed — no data left EU", status: "pass" as const },
    { msg: "GDPR deletion request processed — user_id anonymized", status: "log" as const },
  ];

  const entryIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const entry = NEW_LOG_ENTRIES[entryIndex.current % NEW_LOG_ENTRIES.length];
      entryIndex.current++;
      setLogs((prev) => [{ time, ...entry }, ...prev.slice(0, 19)]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    pass: { color: "#4ADE80", label: "PASS" },
    block: { color: C.error, label: "BLOCKED" },
    log: { color: C.accentText, label: "LOGGED" },
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Left: Status + Cloud info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Big shield */}
        <Card
          style={{
            background: "linear-gradient(135deg, #0D1526 0%, #1A2545 100%)",
            border: `1px solid ${C.accentBorder}`,
            textAlign: "center",
            padding: "32px 24px",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(74, 222, 128, 0.12)",
              border: "2px solid rgba(74, 222, 128, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <ShieldCheck size={40} color="#4ADE80" />
          </div>
          <p style={{ color: "#4ADE80", fontWeight: 800, fontSize: 20, margin: "0 0 4px" }}>
            System Healthy
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>
            Alle systemer operationelle — sidst tjekket 14:07:22
          </p>
        </Card>

        {/* Cloud info cards */}
        {[
          {
            icon: <Globe size={16} color={C.accentText} />,
            label: "Hosting",
            value: "StackIT (Frankfurt/Vienna)",
            sub: "EU Data Resident — GDPR Art. 44",
          },
          {
            icon: <Lock size={16} color="#4ADE80" />,
            label: "US Cloud Act Shield",
            value: "Protected: YES",
            sub: "Ingen dataoverførsel til USA",
          },
          {
            icon: <Server size={16} color={C.accentText} />,
            label: "Kryptering",
            value: "TLS 1.3 + AES-256 at rest",
            sub: "Nøgler håndteret af EU HSM",
          },
        ].map((item) => (
          <Card key={item.label} style={{ padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: C.accentSoft,
                  border: `1px solid ${C.accentBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 10, color: C.subtext, margin: "0 0 1px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 1px" }}>
                  {item.value}
                </p>
                <p style={{ fontSize: 11, color: C.subtext, margin: 0 }}>{item.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Right: Live log stream */}
      <Card style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#080F1D",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4ADE80",
                boxShadow: "0 0 6px #4ADE80",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Zero-Trust Audit Log</span>
          </div>
          <RefreshCw size={14} color="rgba(255,255,255,0.4)" />
        </div>

        <div
          ref={logRef}
          style={{
            flex: 1,
            background: "#0A111E",
            fontFamily: "monospace",
            fontSize: 11,
            padding: "12px 0",
            overflowY: "auto",
            maxHeight: 460,
          }}
        >
          {logs.map((entry, i) => {
            const sc = statusColors[entry.status];
            return (
              <div
                key={i}
                style={{
                  padding: "5px 16px",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  background: i === 0 ? "rgba(79,70,229,0.08)" : "transparent",
                  transition: "background 500ms",
                  borderLeft: i === 0 ? `2px solid ${C.accent}` : "2px solid transparent",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0, minWidth: 60 }}>
                  {entry.time}
                </span>
                <span
                  style={{
                    color: sc.color,
                    fontWeight: 700,
                    flexShrink: 0,
                    minWidth: 58,
                    fontSize: 10,
                  }}
                >
                  [{sc.label}]
                </span>
                <span style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>
                  {entry.msg}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  active,
  onSelect,
  collapsed,
  onToggle,
}: {
  active: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      style={{
        width: collapsed ? 60 : 220,
        flexShrink: 0,
        background: C.sidebar,
        borderRight: `1px solid ${C.sidebarBorder}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 250ms cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "20px 16px" : "20px 20px",
          borderBottom: `1px solid ${C.sidebarBorder}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          minHeight: 64,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: C.accent,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, margin: 0, lineHeight: 1 }}>
              PayTjek
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, margin: 0 }}>
              Fagforenings-portal
            </p>
          </div>
        )}
      </div>

      {/* Org badge */}
      {!collapsed && (
        <div
          style={{
            padding: "10px 16px",
            margin: "12px 12px 4px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10,
            border: `1px solid ${C.sidebarBorder}`,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Organisation
          </p>
          <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, margin: 0 }}>HK Handel</p>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 8px" }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              title={collapsed ? label : undefined}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 14px" : "10px 14px",
                borderRadius: 10,
                border: "none",
                background: isActive ? C.accent : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                marginBottom: 2,
                transition: "background 150ms, color 150ms",
                whiteSpace: "nowrap",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.sidebarBorder}` }}>
        {!collapsed && (
          <div
            style={{
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              MH
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Mette Høgh
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, margin: 0 }}>Sektorformand</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            fontSize: 12,
            borderRadius: 8,
            whiteSpace: "nowrap",
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><Menu size={16} /> Skjul menu</>}
        </button>
      </div>
    </aside>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function UnionDashboard() {
  const [activeView, setActiveView] = useState("strategisk");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const VIEW_TITLES: Record<string, { title: string; sub: string }> = {
    strategisk: { title: "Strategisk Dashboard", sub: "Overordnet overblik — HK Handel 2025" },
    sagsbehandling: { title: "Sagsbehandling", sub: "Triage inbox & Verification Cockpit" },
    virksomheder: { title: "Virksomheds-analyse", sub: "Synder-liste & Trends" },
    logik: { title: "Logik-motor", sub: "Overenskomst-konfiguration" },
    sikkerhed: { title: "Sikkerhed & Audit", sub: "Trust Center — GDPR & Zero-Trust" },
  };

  const current = VIEW_TITLES[activeView];

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: C.bg,
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#1E2535",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            maxWidth: 440,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 6,
            padding: "5px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Lock size={11} color="rgba(255,255,255,0.3)" />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            dashboard.paytjek.dk/hk-handel/overblik
          </span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <Bell size={15} color="rgba(255,255,255,0.4)" style={{ cursor: "pointer" }} />
          <Settings size={15} color="rgba(255,255,255,0.4)" style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* App layout */}
      <div style={{ display: "flex", height: "calc(100vh - 80px)", minHeight: 640 }}>
        <Sidebar
          active={activeView}
          onSelect={setActiveView}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Main content */}
        <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          {/* Top bar */}
          <div
            style={{
              padding: "16px 28px",
              borderBottom: `1px solid ${C.border}`,
              background: C.card,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                {current.title}
              </h1>
              <p style={{ fontSize: 12, color: C.subtext, margin: 0 }}>{current.sub}</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Badge color={C.ok} bg={C.okBg}>
                <CheckCircle2 size={10} /> Live data
              </Badge>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#fff",
                  background: C.accent,
                  border: "none",
                  borderRadius: 9999,
                  padding: "7px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <Download size={13} /> Eksporter rapport
              </button>
            </div>
          </div>

          {/* View content */}
          <div style={{ flex: 1, padding: "24px 28px", overflow: "auto" }}>
            {activeView === "strategisk" && <StrategiskDashboard />}
            {activeView === "sagsbehandling" && <Sagsbehandling />}
            {activeView === "virksomheder" && <VirksomhedsAnalyse />}
            {activeView === "logik" && <LogikMotor />}
            {activeView === "sikkerhed" && <SikkerhedAudit />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default UnionDashboard;
