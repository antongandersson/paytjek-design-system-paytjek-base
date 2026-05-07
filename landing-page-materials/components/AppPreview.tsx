/**
 * PayTjek Landing Page — App Preview Section (Tilgang B)
 *
 * Viser PayTjek-appens flow i animerede iPhone-frames med scroll-reveal.
 * Ingen eksterne dependencies ud over React.
 *
 * Stack: React 18+ · Tailwind CSS (eller inline styles) · Ingen ikoner-lib nødvendig
 *
 * Usage:
 *   import { AppPreview } from "./components/AppPreview";
 *   <AppPreview />
 */

import React, { useEffect, useRef, useState } from "react";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg: "#060C18",
  surface: "#0D1526",
  border: "rgba(79,70,229,0.18)",
  accent: "#4F46E5",
  accentHover: "#4338CA",
  accentSoft: "rgba(79,70,229,0.10)",
  accentGlow: "rgba(79,70,229,0.30)",
  accentText: "#818CF8",
  white: "#EEF2FF",
  muted: "#94A3B8",
  phoneBg: "#1C1C1E",
  screenBg: "#F5F7F8",
  text: "#102029",
  subtext: "#5F6B73",
  divider: "#E5E7EB",
  ok: "#146B68",
  okBg: "#F0FDF9",
  error: "#DC2626",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
};

// ─── Phone dimensions ───────────────────────────────────────────────────────
const SIZES = {
  sm: { w: 206, h: 422, radius: 42, island: 90, islandH: 26, padding: 9 },
  md: { w: 232, h: 474, radius: 46, island: 100, islandH: 28, padding: 10 },
  lg: { w: 260, h: 532, radius: 50, island: 112, islandH: 30, padding: 11 },
} as const;

type PhoneSize = keyof typeof SIZES;

// ─── Phone Frame ────────────────────────────────────────────────────────────
function PhoneFrame({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: PhoneSize;
}) {
  const d = SIZES[size];
  return (
    <div
      style={{
        width: d.w,
        height: d.h,
        background: C.phoneBg,
        borderRadius: d.radius,
        padding: d.padding,
        boxShadow: `
          0 40px 100px rgba(0,0,0,0.6),
          0 0 0 1px rgba(255,255,255,0.07),
          inset 0 0 0 1px rgba(255,255,255,0.04)
        `,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: d.padding + 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: d.island,
          height: d.islandH,
          background: "#000",
          borderRadius: 20,
          zIndex: 50,
        }}
      />
      {/* Screen */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: d.radius - d.padding,
          overflow: "hidden",
          background: C.screenBg,
          position: "relative",
        }}
      >
        {children}
      </div>
      {/* Home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 5,
          background: "rgba(255,255,255,0.22)",
          borderRadius: 3,
        }}
      />
    </div>
  );
}

// ─── Step Indicator ─────────────────────────────────────────────────────────
function StepBar({ active }: { active: 1 | 2 | 3 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingTop: 52,
        paddingBottom: 4,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {[1, 2, 3].map((n, i) => (
        <React.Fragment key={n}>
          {i > 0 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background: active > i ? C.accent : C.divider,
                borderRadius: 1,
                maxWidth: 32,
              }}
            />
          )}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: active >= n ? C.accent : C.divider,
              color: active >= n ? "#fff" : "#9CA3AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: active === n ? 700 : 500,
              flexShrink: 0,
            }}
          >
            {active > n ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              n
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Screen 1 — Upload ──────────────────────────────────────────────────────
function UploadScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.screenBg }}>
      <StepBar active={1} />
      <div style={{ textAlign: "center", padding: "14px 16px 10px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 3px", fontFamily: "inherit" }}>
          Upload lønseddel
        </h2>
        <p style={{ fontSize: 11, color: C.subtext, margin: 0 }}>PDF, PNG eller JPEG</p>
      </div>

      <div style={{ flex: 1, padding: "0 14px 0" }}>
        <div
          style={{
            height: "100%",
            border: `2px dashed ${C.divider}`,
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "0 16px",
            background: "rgba(255,255,255,0.55)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "#fff",
              borderRadius: "50%",
              boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>Tryk for at uploade</p>
          <p style={{ fontSize: 11, color: C.subtext, textAlign: "center", margin: 0, lineHeight: 1.4 }}>
            Eller træk din<br />fil herind
          </p>
          <div
            style={{
              border: `1.5px solid ${C.accent}`,
              color: C.accent,
              borderRadius: 9999,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            Vælg fil
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 14px 16px" }}>
        <div
          style={{
            height: 44,
            background: C.divider,
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9CA3AF",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Start Løntjek
        </div>
      </div>
    </div>
  );
}

// ─── Screen 2 — Analysis ────────────────────────────────────────────────────
const ANALYSIS_STEPS = [
  { label: "Læser dokument", done: true },
  { label: "Tjekker grundløn", done: true },
  { label: "Analyserer tillæg", active: true },
  { label: "Sammenligner vagter", pending: true },
  { label: "Tjekker overenskomst", pending: true },
];

function AnalysisScreen() {
  const progress = 55;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const filled = (progress / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.screenBg }}>
      <StepBar active={2} />

      {/* Circular progress */}
      <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 10px" }}>
        <div style={{ position: "relative", width: 110, height: 110 }}>
          <svg width="110" height="110" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke={C.divider} strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={C.accent}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circ}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1 }}>{progress}%</span>
            <span style={{ fontSize: 10, color: C.subtext, marginTop: 2 }}>Analyserer…</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ flex: 1, padding: "0 14px", display: "flex", flexDirection: "column", gap: 7, overflow: "hidden" }}>
        {ANALYSIS_STEPS.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              background: s.active ? C.accentSoft : "#fff",
              borderRadius: 12,
              border: `1px solid ${s.active ? C.border : C.divider}`,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: s.done ? C.accent : s.active ? C.accentSoft : C.divider,
                border: s.active ? `2px solid ${C.accent}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {s.done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {s.active && (
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
              )}
            </div>
            <span
              style={{
                fontSize: 12,
                color: s.pending ? "#9CA3AF" : C.text,
                fontWeight: s.active ? 600 : 400,
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen 3 — Report ──────────────────────────────────────────────────────
const OK_ITEMS = ["Grundløn", "ATP og pension", "Feriegodtgørelse"];

function ReportScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.screenBg }}>
      <StepBar active={3} />

      <div style={{ padding: "12px 14px 8px" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: "0 0 8px", fontFamily: "inherit" }}>
          Din rapport
        </h2>
        {/* Error badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "#FEE2E2",
            borderRadius: 9999,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            color: C.error,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          1 lønfejl fundet
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 14px", display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
        {/* Error card */}
        <div
          style={{
            background: C.errorBg,
            border: `1px solid ${C.errorBorder}`,
            borderRadius: 14,
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Søn- og helligdagstillæg</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.error }}>−66 kr</span>
          </div>
          <p style={{ fontSize: 10, color: C.subtext, margin: 0, lineHeight: 1.45 }}>
            Betalt 50% tillæg på søndag.<br />
            Overenskomsten kræver 100%.
          </p>
        </div>

        {/* OK items */}
        {OK_ITEMS.map((label) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: `1px solid ${C.divider}`,
              borderRadius: 14,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 12, color: C.text }}>{label}</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: C.ok,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              OK
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "8px 14px 16px" }}>
        <div
          style={{
            height: 44,
            background: C.accent,
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 18px rgba(79,70,229,0.40)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22 11 13 2 9l20-7z" />
          </svg>
          Send til leder
        </div>
      </div>
    </div>
  );
}

// ─── Feature icon ────────────────────────────────────────────────────────────
function FeatureIcon({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    );
  if (idx === 1)
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Phone definitions ───────────────────────────────────────────────────────
const PHONES = [
  {
    screen: <UploadScreen />,
    size: "md" as PhoneSize,
    delay: 0,
    offset: 48,   // push down from baseline
    label: "Upload lønseddel",
    sub: "PDF, PNG eller JPEG",
  },
  {
    screen: <AnalysisScreen />,
    size: "lg" as PhoneSize,
    delay: 160,
    offset: 0,    // tallest — sits at bottom
    label: "AI analyserer",
    sub: "Tjekker mod overenskomst",
  },
  {
    screen: <ReportScreen />,
    size: "md" as PhoneSize,
    delay: 320,
    offset: 48,
    label: "Rapport klar",
    sub: "Klar besked om fejl",
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export function AppPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: C.bg,
        padding: "96px 24px 80px",
        overflow: "hidden",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Eyebrow ── */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: C.accentText,
          margin: "0 0 14px",
        }}
      >
        Se produktet
      </p>

      {/* ── Heading ── */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: C.white,
          margin: "0 0 18px",
          fontFamily: "'Plus Jakarta Sans', Inter, -apple-system, sans-serif",
          lineHeight: 1.15,
        }}
      >
        Fra lønseddel til svar{" "}
        <br />
        <span style={{ color: C.accentText }}>på 30 sekunder</span>
      </h2>

      {/* ── Sub-heading ── */}
      <p
        style={{
          textAlign: "center",
          color: C.muted,
          fontSize: "1.0625rem",
          lineHeight: 1.75,
          margin: "0 auto 64px",
          maxWidth: 520,
        }}
      >
        Upload din lønseddel — Ernest tjekker den mod din overenskomst og finder fejl du aldrig ville have set selv.
      </p>

      {/* ── Phone frames ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 12,
          marginBottom: 64,
        }}
      >
        {PHONES.map((p, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              marginBottom: p.offset,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0) scale(1)" : "translateY(72px) scale(0.96)",
              transition: `opacity 0.75s cubic-bezier(.22,.68,0,1.2) ${p.delay}ms,
                           transform 0.75s cubic-bezier(.22,.68,0,1.2) ${p.delay}ms`,
            }}
          >
            {/* Indigo glow behind center phone */}
            {i === 1 && (
              <div
                style={{
                  position: "absolute",
                  inset: -60,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}
            <div style={{ position: "relative", zIndex: 1 }}>
              <PhoneFrame size={p.size}>{p.screen}</PhoneFrame>
            </div>
          </div>
        ))}
      </div>

      {/* ── Feature pills ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(24px, 6vw, 64px)",
          flexWrap: "wrap",
          maxWidth: 640,
          margin: "0 auto 56px",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease 480ms, transform 0.7s ease 480ms",
        }}
      >
        {PHONES.map((p, i) => (
          <div key={i} style={{ textAlign: "center", minWidth: 130 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: C.accentSoft,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
                color: C.accentText,
              }}
            >
              <FeatureIcon idx={i} />
            </div>
            <p
              style={{
                color: C.white,
                fontWeight: 600,
                fontSize: "0.9375rem",
                margin: "0 0 4px",
              }}
            >
              {p.label}
            </p>
            <p style={{ color: C.muted, fontSize: "0.8125rem", margin: 0 }}>{p.sub}</p>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div
        style={{
          textAlign: "center",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease 600ms, transform 0.6s ease 600ms",
        }}
      >
        <a
          href="#kontakt"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: ctaHover ? C.accentHover : C.accent,
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 9999,
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            boxShadow: ctaHover
              ? "0 8px 32px rgba(79,70,229,0.55)"
              : "0 4px 20px rgba(79,70,229,0.40)",
            transform: ctaHover ? "translateY(-2px)" : "translateY(0)",
            transition: "background 180ms, box-shadow 180ms, transform 180ms",
          }}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
        >
          Prøv gratis — ingen kreditkort
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>

        <p style={{ color: C.muted, fontSize: "0.8125rem", margin: "12px 0 0" }}>
          Allerede over 500 lønsedler tjekket · GDPR-compliant
        </p>
      </div>
    </section>
  );
}

export default AppPreview;
