import { useState } from "react";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { UploadDrawer } from "@/components/layout/UploadDrawer";
import { FileText, MoreHorizontal, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { useNavigate } from "react-router-dom";
import { ErnestFAB } from "@/components/ernest/ErnestFAB";

type TabType = "payslips" | "requests";

interface PayslipReport {
  id: string;
  month: string;
  errorsFound: number;
}

interface Request {
  id: string;
  title: string;
  description: string;
  requestId: string;
  date: string;
  status: "pending" | "closed";
}

const payslipReports: PayslipReport[] = [
  { id: "1", month: "Oktobers rapport", errorsFound: 1 },
  { id: "2", month: "Septembers rapport", errorsFound: 0 },
  { id: "3", month: "Augusts rapport", errorsFound: 1 },
];

const requests: Request[] = [
  {
    id: "1",
    title: "Lønrelateret sag",
    description: "Oktobers lønseddel",
    requestId: "Anmodning #4568",
    date: "Sendt 06/11/25",
    status: "pending",
  },
  {
    id: "2",
    title: "Lønrelateret sag",
    description: "August lønseddel",
    requestId: "Anmodning #4562",
    date: "Sendt 06/11/25",
    status: "closed",
  },
  {
    id: "3",
    title: "Oktobers lønseddel",
    description: "",
    requestId: "Anmodning #4567",
    date: "Sendt 06/11/25",
    status: "pending",
  },
];

export default function History() {
  const [activeTab, setActiveTab] = useState<TabType>("payslips");
  const [navTab, setNavTab] = useState("historie");
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavTabChange = (tab: string) => {
    setNavTab(tab);
    if (tab === "hjem") {
      navigate("/home");
    } else if (tab === "kalender") {
      navigate("/calendar");
    } else if (tab === "mere") {
      navigate("/more");
    } else if (tab === "lontjek") {
      setUploadDrawerOpen(true);
    }
  };

  const handleCenterClick = () => {
    setUploadDrawerOpen(true);
  };

  const handleUploadOption = (option: string) => {
    navigate("/lontjek");
  };

  return (
    <MobileContainer>
      <AppHeader />
      
      {/* Green Header Section */}
      <div className="bg-accent px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground">Historie</h1>
      </div>

      {/* Segmented Control */}
      <div className="bg-card -mt-4 mx-4 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex">
          <button
            onClick={() => setActiveTab("payslips")}
            className={`flex-1 py-4 text-center font-semibold transition-all rounded-2xl ${
              activeTab === "payslips"
                ? "bg-accent text-foreground"
                : "bg-card text-muted-foreground"
            }`}
          >
            Lønsedler
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-4 text-center font-semibold transition-all rounded-2xl ${
              activeTab === "requests"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground"
            }`}
          >
            Anmodninger
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 pb-28">
        {activeTab === "payslips" ? (
          <PayslipsView reports={payslipReports} onCheckPayslip={() => navigate("/lontjek")} />
        ) : (
          <RequestsView requests={requests} />
        )}
      </div>

      <ErnestFAB />

      <BottomNavigation
        activeTab={navTab}
        onTabChange={handleNavTabChange}
        onCenterClick={handleCenterClick}
      />

      <UploadDrawer
        open={uploadDrawerOpen}
        onOpenChange={setUploadDrawerOpen}
        onOptionSelect={handleUploadOption}
      />
    </MobileContainer>
  );
}

function PayslipsView({ 
  reports, 
  onCheckPayslip 
}: { 
  reports: PayslipReport[]; 
  onCheckPayslip: () => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Analyseret lønsedler</h2>
      
      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">{report.month}</p>
                <p className="text-sm text-muted-foreground">
                  {report.errorsFound} fejl fundet
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-6 space-y-3">
        <p className="text-center text-muted-foreground">Tjek andre lønsedler nu!</p>
        <Button 
          onClick={onCheckPayslip}
          className="w-full h-14 rounded-2xl text-lg font-semibold"
        >
          Tjek lønseddel
        </Button>
      </div>
    </div>
  );
}

function RequestsView({ requests }: { requests: Request[] }) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="p-4 bg-card border border-border rounded-2xl space-y-3"
        >
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground">{request.title}</h3>
            <Chip
              variant={request.status === "pending" ? "pending" : "success"}
              size="sm"
            >
              {request.status === "pending" ? "Igangværende" : "Lukket"}
            </Chip>
          </div>
          
          {request.description && (
            <p className="text-sm text-muted-foreground">{request.description}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{request.requestId}</span>
            <span>{request.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
