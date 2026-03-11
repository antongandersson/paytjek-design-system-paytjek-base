import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Mail, Phone, FileText, ChevronRight } from "lucide-react";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HelpItem {
  icon: React.ElementType;
  label: string;
  description: string;
  id: string;
}

const helpItems: HelpItem[] = [
  { 
    icon: MessageCircle, 
    label: "Chat med Ernest", 
    description: "Få svar på dine spørgsmål",
    id: "chat"
  },
  { 
    icon: Mail, 
    label: "Send en email", 
    description: "support@paytjek.dk",
    id: "email"
  },
  { 
    icon: Phone, 
    label: "Ring til os", 
    description: "+45 70 20 30 40",
    id: "phone"
  },
  { 
    icon: FileText, 
    label: "FAQ", 
    description: "Ofte stillede spørgsmål",
    id: "faq"
  },
];

const faqItems = [
  {
    question: "Hvordan uploader jeg en lønseddel?",
    answer: "Tryk på Løntjek-knappen i bunden af skærmen og vælg enten at tage et billede eller uploade en PDF."
  },
  {
    question: "Hvad gør Ernest?",
    answer: "Ernest er din personlige løn-assistent. Han analyserer dine lønsedler og hjælper dig med at forstå din løn og dine rettigheder."
  },
  {
    question: "Er mine data sikre?",
    answer: "Ja, vi bruger ende-til-ende kryptering og gemmer aldrig dine lønsedler længere end nødvendigt for analysen."
  },
  {
    question: "Hvordan kontakter jeg min fagforening?",
    answer: "Efter en løntjek-analyse kan du sende en sag direkte til din fagforening ved at trykke på 'Start sag hos fagforening'."
  },
];

const Help = () => {
  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    if (id === "email") {
      window.location.href = "mailto:support@paytjek.dk";
    } else if (id === "phone") {
      window.location.href = "tel:+4570203040";
    }
  };

  return (
    <MobileContainer>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Hjælp & Support</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-8 space-y-6 animate-fade-in">
        {/* Contact Options */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Kontakt os</h2>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {helpItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/50",
                      index !== helpItems.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-foreground block">
                          {item.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Ofte stillede spørgsmål</h2>
          
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </MobileContainer>
  );
};

export default Help;





