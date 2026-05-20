import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  DollarSign,
  Heart,
  Umbrella,
  GraduationCap,
  Lock,
  Wrench,
  Shield,
} from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { cn } from "@/lib/utils";
import type { RightsSection } from "@/lib/demoUnionConfigs";

const sectionIcons: Record<RightsSection["icon"], React.ElementType> = {
  money: DollarSign,
  health: Heart,
  vacation: Umbrella,
  education: GraduationCap,
  protection: Lock,
  conditions: Wrench,
};

const sectionPreviews: Record<string, string> = {
  "Løn & tillæg": "Grundløn 32.195 kr · Branchetillæg · Genetillæg §7",
  "Fravær med løn": "Sygdom · Barns 1. sygedag · Hospitalsindlæggelse",
  "Ferie & fridage": "25 feriedage · 5 feriefridage · Særlig opsparing 10%",
  "Uddannelse": "2 ugers frihed/år · Kompetencefonden betaler",
  "Beskyttelse": "Funktionær · 4 mdr. varsel · Skriftlig opsigelse",
  "Arbejdsvilkår": "Uniform · Sundhedsordning · Spisetid · Pension 13%",
};

export default function ContractRights() {
  const navigate = useNavigate();
  const { demoConfig, basePath } = useDemo();
  const rights = demoConfig.contractIntelligence?.rights;

  if (!rights || rights.length === 0) {
    navigate(`${basePath}/contract`);
    return null;
  }

  return (
    <main className="animate-fade-in min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-foreground p-2 -ml-2 rounded-full hover:bg-muted"
            onClick={() => navigate(`${basePath}/contract`)}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Dine rettigheder</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pb-24 pt-4">
        <h2 className="text-base font-medium text-foreground mb-1">
          Baseret på din overenskomst
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          {demoConfig.collectiveAgreement}
        </p>

        <div className="space-y-0">
          {rights.map((section) => (
            <AccordionItem key={section.title} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}

function AccordionItem({ section }: { section: RightsSection }) {
  const [open, setOpen] = useState(false);
  const Icon = sectionIcons[section.icon] || Shield;
  const preview = sectionPreviews[section.title] ?? "";

  return (
    <div className="border-b border-border/30">
      <button
        className="w-full flex items-center justify-between py-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-primary shrink-0" />
          <span className="text-[13px] font-medium text-foreground">{section.title}</span>
        </div>
        <ChevronRight className={cn(
          "h-3.5 w-3.5 text-muted-foreground transition-transform",
          open && "rotate-90"
        )} />
      </button>

      {/* Preview text — only when collapsed */}
      {!open && preview && (
        <div className="pb-2 pl-[26px] text-[11px] text-muted-foreground leading-snug">
          {preview}
        </div>
      )}

      {/* Expanded content */}
      {open && (
        <div className="pb-3 pl-[26px] space-y-1.5 animate-fade-in">
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary/40 mt-[7px] shrink-0" />
              <div>
                <p className="text-xs text-foreground leading-snug">{item.text}</p>
                {item.reference && (
                  <p className="text-[10px] text-primary/60 mt-0.5">{item.reference}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
