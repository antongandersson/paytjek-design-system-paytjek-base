import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Mail, Phone, ChevronRight } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Hvordan uploader jeg min lønseddel?",
    answer: "Du kan uploade din lønseddel på flere måder: Tag et billede med dit kamera, vælg et eksisterende billede fra dit galleri, eller upload en PDF-fil."
  },
  {
    question: "Hvad sker der med mine data?",
    answer: "Dine data behandles fortroligt og sikkert. Vi bruger kryptering og følger GDPR."
  },
  {
    question: "Hvem er Ernest?",
    answer: "Ernest er vores AI-assistent der kan besvare spørgsmål om løn, overenskomster, og arbejdsret."
  },
];

export default function MobileHelp() {
  const navigate = useNavigate();
  const { basePath } = useDemo();

  return (
    <main className="px-4 py-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`${basePath}/more`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Hjælp & Support</h1>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <span className="text-xs">Chat</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <Mail className="h-6 w-6 text-primary" />
          <span className="text-xs">Email</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <Phone className="h-6 w-6 text-primary" />
          <span className="text-xs">Ring</span>
        </Button>
      </div>

      {/* FAQ */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <h2 className="font-bold mb-4">Ofte stillede spørgsmål</h2>
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}





