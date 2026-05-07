import { useDemo } from "@/contexts/DemoContext";
import type { UnionId } from "@/lib/demoUnionConfigs";

/**
 * DemoSwitcher — vises kun når ?switcher=true er i URL.
 * Intern brug: giver mulighed for at skifte fagforening under demo-forberedelse.
 * Vises ALDRIG i et pitch-møde med mindre URL-param er sat.
 */
export function DemoSwitcher() {
  const { showSwitcher, selectedUnionId, setUnion, availableUnions, demoConfig } = useDemo();

  if (!showSwitcher) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        background: "#1C1C1E",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      {/* Union logo */}
      <img
        src={demoConfig.logo}
        alt={demoConfig.name}
        style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 6 }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Demo mode
        </span>
        <select
          value={selectedUnionId}
          onChange={(e) => setUnion(e.target.value as UnionId)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            outline: "none",
            padding: 0,
          }}
        >
          {availableUnions.map((u) => (
            <option key={u.id} value={u.id} style={{ background: "#1C1C1E", color: "#fff" }}>
              {u.name} — {u.fullName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
