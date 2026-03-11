import { useState } from "react";
import { X } from "lucide-react";
import { ErnestChatSheet } from "./ErnestChatSheet";
import ernestAvatar from "@/assets/ernest-avatar.svg";

interface ErnestWelcomeBubbleProps {
  onDismiss?: () => void;
}

const quickReplies = [
  "Hvad kan du hjælpe med?",
  "Tjek min lønseddel",
];

export function ErnestWelcomeBubble({ onDismiss }: ErnestWelcomeBubbleProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleQuickReply = () => {
    setIsChatOpen(true);
  };

  const handleBubbleClick = () => {
    setIsChatOpen(true);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-40 right-4 z-30 animate-fade-in max-w-[280px]">
        {/* Chat Bubble */}
        <div 
          className="bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-100 p-4 cursor-pointer hover:shadow-2xl transition-shadow"
          onClick={handleBubbleClick}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            aria-label="Luk besked"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Header with avatar */}
          <div className="flex items-start gap-3 mb-3">
            <img src={ernestAvatar} alt="Ernest" className="w-8 h-8 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">Ernest</p>
              <p className="text-xs text-muted-foreground">Din løn-assistent</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-foreground leading-relaxed mb-3">
            Hej! Jeg er Ernest. Har du spørgsmål om løn eller overenskomst? 👋
          </p>

          {/* Quick Replies */}
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickReply();
                }}
                className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Pointer to FAB */}
        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45" />
      </div>

      <ErnestChatSheet 
        open={isChatOpen} 
        onOpenChange={setIsChatOpen}
        context="global"
      />
    </>
  );
}
