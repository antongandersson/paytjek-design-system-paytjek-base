/**
 * PayTjek — App Preview Page (til landing page / pitch)
 *
 * Viser de rigtige app-screens skaleret ned i iPhone-frames.
 * Besøg /app-preview — brug til screenshot, screen recording eller pitch.
 *
 * Screens: UploadScreen → AnalysisScreen (mid-analyse) → ReportScreen (med fejl)
 */

import React, { useEffect, useRef, useState } from "react";
import { UploadScreen } from "@/components/lontjek/UploadScreen";
import { AnalysisScreen } from "@/components/lontjek/AnalysisScreen";
import { ReportScreen } from "@/components/lontjek/ReportScreen";
import type { AnalysisStep } from "@/components/lontjek/AnalysisStepList";
import { useDemo } from "@/contexts/DemoContext";

// ─── Mock props til de frosne preview-screens ─────────────────────────────────
const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: "read",      label: "Læser dokument",        status: "completed" },
  { id: "grundlon",  label: "Tjekker grundløn",       status: "completed" },
  { id: "tillaeg",   label: "Analyserer tillæg",      status: "active" },
  { id: "vagter",    label: "Sammenligner vagter",     status: "pending" },
  { id: "agreement", label: "Tjekker overenskomst",   status: "pending" },
];

// ReportScreen henter automatisk Oktober-demo (med søn/helligdagsfejl) i dev mode.
// Ingen props nødvendige — se ReportScreen.tsx linje 120.

// ─── Dimensioner ──────────────────────────────────────────────────────────────
const CONTENT_W = 375; // Appens design-bredde (standard mobil)

const SIDE   = { outerW: 212, outerH: 436, innerW: 194, innerH: 418, pad: 9,  r: 42 };
const CENTER = { outerW: 244, outerH: 498, innerW: 224, innerH: 478, pad: 10, r: 46 };

type PhoneConfig = typeof SIDE;

// ─── Phone Frame ─────────────────────────────────────────────────────────────
function PhoneFrame({
  cfg,
  children,
  inView,
  delay,
  offsetBottom,
  perspective3d,
}: {
  cfg: PhoneConfig;
  children: React.ReactNode;
  inView: boolean;
  delay: number;
  offsetBottom: number;
  perspective3d?: boolean;
}) {
  const scale = cfg.innerW / CONTENT_W;
  const contentH = cfg.innerH / scale;

  // 3D transform for the hero center phone (like the reference image)
  const perspectiveTransform = perspective3d
    ? "perspective(1100px) rotateX(6deg) rotateY(-14deg) rotateZ(3deg) translateY(-8px)"
    : undefined;

  const perspectiveShadow = perspective3d
    ? "40px 60px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)"
    : "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 0 1px rgba(255,255,255,0.04)";

  return (
    <div
      style={{
        position: "relative",
        marginBottom: offsetBottom,
        opacity: inView ? 1 : 0,
        transform: inView
          ? perspectiveTransform ?? "translateY(0) scale(1)"
          : "translateY(64px) scale(0.96)",
        transition: `opacity 0.8s cubic-bezier(.22,.68,0,1.2) ${delay}ms,
                     transform 0.8s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
        flexShrink: 0,
      }}
    >
      {/* Indigo glow bag center phone */}
      {perspective3d && (
        <div
          style={{
            position: "absolute",
            inset: -60,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.30) 0%, transparent 68%)",
            pointerEvents: "none",
            zIndex: 0,
            filter: "blur(8px)",
          }}
        />
      )}

      {/* Phone body */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: cfg.outerW,
          height: cfg.outerH,
          background: "#1C1C1E",
          borderRadius: cfg.r,
          padding: cfg.pad,
          boxShadow: perspectiveShadow,
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: cfg.pad + 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: Math.round(cfg.innerW * 0.46),
            height: 26,
            background: "#000",
            borderRadius: 20,
            zIndex: 50,
          }}
        />

        {/* Screen container */}
        <div
          style={{
            width: cfg.innerW,
            height: cfg.innerH,
            borderRadius: cfg.r - cfg.pad,
            overflow: "hidden",
            background: "#F5F7F8",
          }}
        >
          {/* Scaled real app content */}
          <div
            style={{
              width: CONTENT_W,
              height: contentH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {children}
          </div>
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
    </div>
  );
}

// ─── Feature pill ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    label: "Upload lønseddel",
    sub: "PDF, PNG eller JPEG",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    label: "AI analyserer",
    sub: "Tjekker mod overenskomst",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    label: "Rapport klar",
    sub: "Klar besked om lønfejl",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AppPreviewPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const { demoConfig } = useDemo();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Start animation immediately on mount (siden er dedikeret til preview)
    setInView(true);
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 65% 35%, #1A1008 0%, #060C18 55%, #060C18 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 24px 80px",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Eyebrow ── */}
      <p
        style={{
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#818CF8",
          margin: "0 0 14px",
        }}
      >
        PayTjek — App Demo
      </p>

      {/* ── Union logo (vises kun når non-HK union er valgt) ── */}
      {demoConfig.id !== "hk" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
            padding: "8px 16px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <img
            src={demoConfig.logo}
            alt={demoConfig.name}
            style={{ height: 28, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
            i samarbejde med PayTjek
          </span>
        </div>
      )}

      {/* ── Heading ── */}
      <h1
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#EEF2FF",
          margin: "0 0 16px",
          textAlign: "center",
          lineHeight: 1.15,
          fontFamily: "'Plus Jakarta Sans', Inter, -apple-system, sans-serif",
        }}
      >
        {demoConfig.pitchTagline.split(" ").slice(0, -2).join(" ")}{" "}
        <span style={{ color: "#818CF8" }}>{demoConfig.pitchTagline.split(" ").slice(-2).join(" ")}</span>
      </h1>

      <p
        style={{
          color: "#94A3B8",
          fontSize: "1.0625rem",
          lineHeight: 1.75,
          margin: "0 0 56px",
          maxWidth: 500,
          textAlign: "center",
        }}
      >
        {demoConfig.pitchSub}
      </p>

      {/* ── Phone frames ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 14,
          marginBottom: 60,
          flexWrap: "nowrap",
        }}
      >
        {/* Screen 1 — Upload */}
        <PhoneFrame cfg={SIDE} inView={inView} delay={0} offsetBottom={48}>
          <UploadScreen
            onFileSelect={() => {}}
            onStartAnalysis={() => {}}
            isAnalyzing={false}
          />
        </PhoneFrame>

        {/* Screen 2 — Home dashboard med fejl (center, 3D perspektiv) */}
        <PhoneFrame cfg={CENTER} inView={inView} delay={160} offsetBottom={0} perspective3d>
          <ReportScreen onGoHome={() => {}} />
        </PhoneFrame>

        {/* Screen 3 — Analyse flow */}
        <PhoneFrame cfg={SIDE} inView={inView} delay={320} offsetBottom={48}>
          <AnalysisScreen
            progress={62}
            analysisSteps={ANALYSIS_STEPS}
            isComplete={false}
            onViewReport={() => {}}
          />
        </PhoneFrame>
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
        {FEATURES.map((f, i) => (
          <div key={i} style={{ textAlign: "center", minWidth: 130 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(79,70,229,0.10)",
                border: "1px solid rgba(79,70,229,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
                color: "#818CF8",
              }}
            >
              {f.icon}
            </div>
            <p style={{ color: "#EEF2FF", fontWeight: 600, fontSize: "0.9375rem", margin: "0 0 4px" }}>
              {f.label}
            </p>
            <p style={{ color: "#94A3B8", fontSize: "0.8125rem", margin: 0 }}>{f.sub}</p>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div style={{ textAlign: "center" }}>
        <a
          href="/m/welcome"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#4F46E5",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 9999,
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(79,70,229,0.40)",
          }}
        >
          Prøv selv — gratis
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
        <p style={{ color: "#94A3B8", fontSize: "0.8125rem", margin: "12px 0 0" }}>
          Ingen kreditkort · GDPR-compliant · Data forlader ikke EU
        </p>
      </div>
    </div>
  );
}
