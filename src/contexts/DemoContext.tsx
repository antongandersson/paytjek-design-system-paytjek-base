import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import {
  getUnionConfig,
  HK_CONFIG,
  type UnionDemoConfig,
  type UnionId,
  UNION_CONFIGS,
} from "@/lib/demoUnionConfigs";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookedMeeting {
  date: Date;
  time: string;
  unionName: string;
}

interface DemoContextType {
  demoConfig: UnionDemoConfig;
  selectedUnionId: UnionId;
  setUnion: (id: UnionId) => void;
  showSwitcher: boolean;
  availableUnions: { id: UnionId; name: string; fullName: string }[];
  basePath: string;
  bookedMeeting: BookedMeeting | null;
  setBookedMeeting: (meeting: BookedMeeting | null) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DemoContext = createContext<DemoContextType>({
  demoConfig: HK_CONFIG,
  selectedUnionId: "hk",
  setUnion: () => {},
  showSwitcher: false,
  availableUnions: [],
  basePath: "/hk",
  bookedMeeting: null,
  setBookedMeeting: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

const AVAILABLE_UNIONS: { id: UnionId; name: string; fullName: string }[] = [
  { id: "hk", name: "HK", fullName: "HK – Handel, Transport og Service" },
  { id: "foa", name: "FOA", fullName: "FOA – Fag og Arbejde" },
  { id: "djoef", name: "Djøf", fullName: "Djøf – Danmarks Jurist- og Økonomforbund" },
  { id: "3f", name: "3F", fullName: "3F – Fagligt Fælles Forbund" },
  { id: "lederne", name: "Lederne", fullName: "Lederne" },
  { id: "sef", name: "Serviceforbundet", fullName: "Serviceforbundet / VSL" },
  { id: "sef-kontrakt", name: "SEF Kontrakttjek", fullName: "Serviceforbundet / VSL — Kontrakttjek" },
];

export function DemoProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  // Derive union directly from URL — no state, no race condition
  const selectedUnionId: UnionId = useMemo(() => {
    const firstSegment = location.pathname.split("/")[1];
    if (firstSegment && firstSegment in UNION_CONFIGS) {
      return firstSegment as UnionId;
    }
    return "hk";
  }, [location.pathname]);

  const setUnion = useCallback((_id: UnionId) => {
    // Navigation handles union switching now — this is a no-op
  }, []);

  const showSwitcher = false;
  const demoConfig = getUnionConfig(selectedUnionId);
  const basePath = `/${selectedUnionId}`;

  const [bookedMeeting, setBookedMeeting] = useState<BookedMeeting | null>(null);

  // ─── Inject CSS-tema + Google Fonts ────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    const { theme, googleFontsImport } = demoConfig;

    (Object.entries(theme) as [string, string][]).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    const fontId = `demo-font-${demoConfig.id}`;
    const existing = document.getElementById(fontId);
    if (!existing) {
      document
        .querySelectorAll("link[data-demo-font]")
        .forEach((el) => el.remove());

      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = googleFontsImport;
      link.setAttribute("data-demo-font", "true");
      document.head.appendChild(link);
    }

    return () => {
      document
        .querySelectorAll("link[data-demo-font]")
        .forEach((el) => el.remove());
    };
  }, [demoConfig]);

  return (
    <DemoContext.Provider
      value={{
        demoConfig,
        selectedUnionId,
        setUnion,
        showSwitcher,
        availableUnions: AVAILABLE_UNIONS,
        basePath,
        bookedMeeting,
        setBookedMeeting,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDemo(): DemoContextType {
  return useContext(DemoContext);
}
