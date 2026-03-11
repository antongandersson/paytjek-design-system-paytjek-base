import { useState } from "react";
import { Search, MessageCircle, Mail, Phone, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Hvordan uploader jeg min lønseddel?",
    answer: "Du kan uploade din lønseddel på flere måder: Tag et billede med dit kamera, vælg et eksisterende billede fra dit galleri, eller upload en PDF-fil. Gå til 'Løntjek' i menuen og følg instruktionerne."
  },
  {
    question: "Hvad sker der med mine data?",
    answer: "Dine data behandles fortroligt og sikkert. Vi bruger kryptering og følger GDPR. Dine lønsedler analyseres af AI og gemmes kun så længe det er nødvendigt for at give dig service."
  },
  {
    question: "Hvordan synkroniserer jeg min kalender?",
    answer: "Gå til 'Kalender' og tryk på 'Synkroniser'. Du kan forbinde din arbejdsgivers kalender, Google Calendar, eller importere en ICS-fil."
  },
  {
    question: "Hvad gør jeg hvis der er fejl i min løn?",
    answer: "Når vores AI finder fejl, kan du sende sagen direkte til din fagforening med ét klik. De vil så tage kontakt til din arbejdsgiver på dine vegne."
  },
  {
    question: "Hvem er Ernest?",
    answer: "Ernest er vores AI-assistent der kan besvare spørgsmål om løn, overenskomster, og arbejdsret. Klik på chat-ikonet for at starte en samtale."
  },
  {
    question: "Hvordan ændrer jeg mit password?",
    answer: "Gå til 'Profil' → 'Indstillinger' → 'Sikkerhed'. Her kan du ændre dit password og aktivere to-faktor autentificering."
  },
];

export default function WebHelp() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Blue Header Banner with Search */}
      <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl">
        <h1 className="text-3xl font-bold text-primary-foreground mb-2">Hjælp & Support</h1>
        <p className="text-primary-foreground/80 mb-6">
          Find svar på dine spørgsmål eller kontakt os
        </p>
        
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Søg efter hjælp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg bg-white border-0"
          />
        </div>
      </div>

      {/* Contact Options - Action Cards style */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-accent border-0 cursor-pointer hover:scale-[1.02] transition-transform">
          <CardContent className="p-4 md:p-6 h-28 flex flex-col items-center justify-center text-center">
            <MessageCircle className="h-8 w-8 text-accent-foreground mb-2" />
            <span className="font-bold text-accent-foreground text-sm">Chat med Ernest</span>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary border-0 cursor-pointer hover:scale-[1.02] transition-transform">
          <CardContent className="p-4 md:p-6 h-28 flex flex-col items-center justify-center text-center">
            <Mail className="h-8 w-8 text-secondary-foreground mb-2" />
            <span className="font-bold text-secondary-foreground text-sm">Send en email</span>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/10 border-0 cursor-pointer hover:scale-[1.02] transition-transform">
          <CardContent className="p-4 md:p-6 h-28 flex flex-col items-center justify-center text-center">
            <Phone className="h-8 w-8 text-primary mb-2" />
            <span className="font-bold text-foreground text-sm">Ring til os</span>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Ofte stillede spørgsmål</h2>
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
        
        <Card className="border-border/50">
          <CardContent className="p-4 md:p-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                  <AccordionTrigger className="text-left font-bold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFaq.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Ingen resultater fundet. Prøv at søge efter noget andet.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* External Resources */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Nyttige links</h2>
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
        
        <div className="space-y-2">
          <Card className="border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-bold">Privatlivspolitik</span>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card className="border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-bold">Vilkår og betingelser</span>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card className="border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-bold">Cookie-politik</span>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
