import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ErnestChatSheet } from "./ErnestChatSheet";
import { usePayslip } from "@/contexts/PayslipContext";
import ernestAvatar from "@/assets/ernest-avatar.svg";

export function ErnestFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem('ernest_welcome_seen') === 'true';
  });
  const location = useLocation();
  
  // Hent lønseddel-status fra global context
  const { hasActiveAnalysis, currentAnalysis } = usePayslip();

  // Bestem context baseret på lokation og analyse-status
  const isOnLontjekPage = location.pathname.includes("/lontjek");
  const ernestContext = isOnLontjekPage && hasActiveAnalysis ? "analysis" : "global";

  // Vis notifikation hvis der er en aktiv analyse med fejl
  useEffect(() => {
    if (hasActiveAnalysis && currentAnalysis?.validation) {
      const errorCount = currentAnalysis.validation.discrepancies?.length || 0;
      if (errorCount > 0) {
        setShowNotification(true);
      }
    }
  }, [hasActiveAnalysis, currentAnalysis]);

  // Vis velkomst-notifikation første gang
  useEffect(() => {
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 2000); // Vis efter 2 sekunder
      return () => clearTimeout(timer);
    }
  }, [hasSeenWelcome]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowNotification(false);
    
    // Marker at brugeren har set Ernest
    if (!hasSeenWelcome) {
      localStorage.setItem('ernest_welcome_seen', 'true');
      setHasSeenWelcome(true);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all active:scale-95"
        aria-label="Chat med Ernest"
      >
        <img src={ernestAvatar} alt="Ernest" className="w-14 h-14" />
        
        {/* Notifikations-badge */}
        {showNotification && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center">
              <span className="text-[10px] text-white font-bold">!</span>
            </span>
          </span>
        )}
      </button>
      
      {/* 
        Context er dynamisk:
        - "analysis" på løntjek-siden med aktiv analyse (sender lønseddel-data)
        - "global" ellers (sender kun bruger-data)
      */}
      <ErnestChatSheet 
        open={isOpen} 
        onOpenChange={setIsOpen}
        context={ernestContext}
      />
    </>
  );
}
