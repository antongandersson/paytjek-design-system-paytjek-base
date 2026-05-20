import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { HomeHeader } from "@/components/home/HomeHeader";
import { QuickActions } from "@/components/home/ActionCards";
import { PaymentWidget } from "@/components/home/PaymentWidget";
import {
  StatusHero,
  DashboardContextRow,
  WorkBreakdown,
  PayTrendChart,
  YtdSummary,
} from "@/components/home/AggregatedWidgets";
import { usePayslip } from "@/contexts/PayslipContext";
import { useCalendar } from "@/contexts/CalendarContext";
import { useApp } from "@/contexts/AppContext";
import { useUser } from "@/contexts/UserContext";
import { useContract } from "@/contexts/ContractContext";
import { useDemo } from "@/contexts/DemoContext";
import { Video, Clock, ChevronRight, Upload, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OutletContextType {
  setUploadDrawerOpen: (open: boolean) => void;
}

export default function MobileHome() {
  const navigate = useNavigate();
  const { setUploadDrawerOpen } = useOutletContext<OutletContextType>();

  const { getDashboardData, hasDashboardData, isAnalyzing } = usePayslip();
  const { isConnected: hasCalendar, shifts } = useCalendar();
  const { updateSetupStatus } = useApp();
  const { user } = useUser();
  const { hasContract, contractDetails } = useContract();
  const { demoConfig, basePath, bookedMeeting } = useDemo();

  const dashboardData = getDashboardData();
  const agg = dashboardData.aggregated;
  const isContractOnly = demoConfig.demoProfile === "contract-only";

  useEffect(() => {
    updateSetupStatus({
      hasCalendar,
      hasPayslip: hasDashboardData,
      hasProfile: !!user?.firstName,
    });
  }, [hasCalendar, hasDashboardData, user, updateSetupStatus]);

  const handleUploadClick = () => {
    setUploadDrawerOpen(true);
  };

  return (
    <main className="px-4 py-5 space-y-4 pb-24 animate-fade-in">
      {/* 1. Greeting */}
      <HomeHeader
        name={user?.firstName}
        hasPayslipData={hasDashboardData}
        hasCalendar={hasCalendar}
        hasContract={hasContract}
      />

      {/* 2. Contract-only: rent dashboard med kontraktkort + upload + rettigheder */}
      {isContractOnly ? (
        <>
          {/* Kontraktkort */}
          {hasContract && contractDetails ? (
            <Card
              className="border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate(`${basePath}/contract`)}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="h-3 w-3" /> Kontrakt
                  </p>
                  {demoConfig.demoContractAnalysis && demoConfig.demoContractAnalysis.deviations > 0
                    ? <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">{demoConfig.demoContractAnalysis.deviations} mangler</span>
                    : <span className="text-[10px] font-semibold bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Alt OK</span>
                  }
                </div>
                <p className="text-base font-bold text-foreground">{contractDetails.employer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {contractDetails.salary.trinLabel} · Fuldtid · {(contractDetails.employment.weeklyHours * 4.33).toFixed(2).replace(".", ",")} t/md
                </p>
                {demoConfig.demoContractAnalysis && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-green-600 font-semibold">✓ {demoConfig.demoContractAnalysis.compliant}/{demoConfig.demoContractAnalysis.totalClauses} OK</span>
                    {demoConfig.demoContractAnalysis.deviations > 0 && (
                      <span className="text-amber-600 font-semibold">⚠ {demoConfig.demoContractAnalysis.deviations} mangler</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60">
              <CardContent className="p-4 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="h-3 w-3" /> Kontrakt
                </p>
                <p className="text-sm text-muted-foreground">Ikke uploadet</p>
              </CardContent>
            </Card>
          )}

          {/* Upload knap */}
          <button
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            onClick={() => navigate(`${basePath}/contract`)}
          >
            <Upload className="h-4 w-4" />
            {hasContract ? "Se kontrakt" : "Upload kontrakt"}
          </button>

          {/* Rettigheder-teaser — kun efter upload */}
          {hasContract && contractDetails && demoConfig.contractIntelligence?.rights && (
            <Card
              className="border-l-4 border-l-primary border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate(`${basePath}/contract/rights`)}
            >
              <CardContent className="p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  🛡️ Dine rettigheder
                </p>
                <p className="text-sm text-foreground">
                  Grundløn {contractDetails.salary.trinLabel}: {contractDetails.salary.hourlyRate.toFixed(2).replace(".", ",")} kr/t
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fuld løn under sygdom · {contractDetails.employment.noticePeriodMonths} mdr. opsigelsesvarsel
                </p>
                <p className="text-xs text-primary font-semibold mt-2 flex items-center gap-1">
                  Se alle rettigheder <ChevronRight className="h-3 w-3" />
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <>
          {/* Standard dashboards for non-contract-only profiles */}
          <StatusHero stats={agg} />

          <DashboardContextRow
            contractDetails={contractDetails}
            shifts={shifts}
            hasCalendar={hasCalendar}
            hasPayslipData={hasDashboardData}
            demoProfile={demoConfig.demoProfile}
            demoContractComparison={demoConfig.demoContractComparison}
            demoContractAnalysis={demoConfig.demoContractAnalysis}
          />

          <QuickActions
            onCheckPayslip={handleUploadClick}
            onViewSchedule={() => navigate(`${basePath}/calendar`)}
            onViewPackage={() => navigate(`${basePath}/package`)}
            onUploadContract={() => navigate(`${basePath}/contract`)}
            careerUnlocked={hasContract && hasDashboardData}
            demoProfile={demoConfig.demoProfile}
            hasContract={hasContract}
          />
        </>
      )}

      {/* 5. Næste møde (vises kun når en booking er foretaget) */}
      {bookedMeeting && (
        <Card
          className="border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => navigate(`${basePath}/booking`)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Næste møde
                </p>
                <p className="text-sm font-bold text-foreground">
                  Lønrådgivning — {bookedMeeting.unionName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3" />
                  <span className="capitalize">
                    {bookedMeeting.date.toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span>· kl. {bookedMeeting.time}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. Seneste lønudbetaling — skjules i contract-only */}
      {!isContractOnly && (
        <PaymentWidget
          amount={dashboardData.paymentAmount}
          daysLeft={dashboardData.paymentDaysLeft}
          month={dashboardData.paymentMonth}
          isLoading={isAnalyzing}
          onUploadClick={handleUploadClick}
        />
      )}

      {/* Arbejdstid + trend — skjules i contract-only */}
      {!isContractOnly && (
        <>
          <WorkBreakdown
            stats={agg}
            contractWeeklyHours={contractDetails?.employment.weeklyHours}
          />

          <PayTrendChart stats={agg} />

          {agg.payslipsChecked >= 2 && (
            <YtdSummary
              stats={agg}
              pensionProvider={contractDetails?.pension.provider}
            />
          )}
        </>
      )}
    </main>
  );
}
