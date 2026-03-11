import { useState, useRef, useEffect, useCallback } from "react";
import { X, Mic, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { createPortal } from "react-dom";
import { streamErnest, checkErnestHealth, type PayslipAnalysisContext, type ContractAnalysisContext, type ShiftAnalysisContext } from "@/lib/ernestClient";
import { useUser } from "@/contexts/UserContext";
import { usePayslip } from "@/contexts/PayslipContext";
import { useContract } from "@/contexts/ContractContext";
import { useCalendar } from "@/contexts/CalendarContext";
import { api } from "@/lib/api/client";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ernest';
  timestamp: Date;
}

type ErnestContext = "global" | "analysis";

interface ErnestChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMessage?: string;
  context?: ErnestContext;
  // Fjernet: payslipAnalysis hentes nu fra PayslipContext
}

const ErnestMascotSVG = () => (
  <svg width="22" height="35" viewBox="0 0 22 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <g clipPath="url(#clip0_ernest)">
      <path d="M17.9679 12.3344C17.3172 11.9874 16.6324 11.7496 15.8867 11.7241C15.7137 10.8517 15.1349 10.2609 14.3782 9.9369C12.3019 9.04998 10.2353 9.08274 8.2467 10.2439C7.89943 10.4465 7.62892 10.7365 7.39985 11.0653C6.67606 10.9197 5.94008 10.9803 5.20898 10.9391C5.27966 10.7959 5.35155 10.6527 5.42344 10.5084C5.80727 9.65178 6.5603 9.49769 7.40106 9.35694C9.38966 9.0245 11.388 9.05483 13.3863 9.08881C14.5013 9.10822 15.6137 9.27201 16.7116 9.49162C16.9712 9.54379 17.1905 9.67119 17.3075 9.94418C17.4025 10.1638 17.5439 10.364 17.6633 10.5727C17.7644 11.1599 17.8668 11.7471 17.9679 12.3344Z" fill="#98C6E3"/>
      <path d="M14.4076 32.9192C15.4823 32.7639 16.4888 32.4594 17.4051 31.8321C18.5797 31.0301 19.1841 29.926 19.4144 28.5622C19.5789 27.5904 19.4851 26.6149 19.5046 25.6418C19.5448 23.7248 19.4083 21.803 19.6154 19.8908C19.7007 19.1046 19.8604 18.3281 20.2174 17.6098C20.4294 17.1827 20.8851 16.9728 21.2824 17.0941C21.7234 17.2276 22.0829 17.6656 21.9842 18.106C21.3165 21.0665 21.7222 24.0694 21.587 27.0505C21.5407 28.0514 21.4481 29.0561 21.1568 30.0243C20.5378 32.0796 19.1938 33.504 17.2077 34.255C14.4917 35.2815 11.7452 35.296 9.11076 34.0027C7.03201 32.9835 5.85615 31.2291 5.42968 28.959C5.33707 28.4627 5.34073 27.9714 5.33829 27.48C5.32611 25.0789 5.33098 22.6777 5.33342 20.2766C5.33342 20.0898 5.26762 19.8617 5.54666 19.7901C6.15103 19.8398 6.73104 19.6724 7.32079 19.5923C7.48163 19.7586 7.42436 19.9672 7.42436 20.1602C7.43045 22.6595 7.4134 25.1589 7.44508 27.6583C7.45726 28.6496 7.58155 29.6494 8.14571 30.5047C9.19484 32.0942 10.7533 32.7663 12.6115 32.8476C13.2013 33.0442 13.8069 32.9095 14.4076 32.9192Z" fill="#98C6E3"/>
      <path d="M9.5066 14.7852L12.1666 14.7428V15.8542L9.37744 15.768L9.5066 14.7852Z" fill="#98C6E3"/>
      <path d="M5.95617 18.9723C8.08339 18.9723 9.80784 17.2645 9.80784 15.1577C9.80784 13.051 8.08339 11.3431 5.95617 11.3431C3.82895 11.3431 2.10449 13.051 2.10449 15.1577C2.10449 17.2645 3.82895 18.9723 5.95617 18.9723Z" fill="#A8C8D9"/>
      <path d="M15.7394 19.0585C17.8666 19.0585 19.591 17.3506 19.591 15.2439C19.591 13.1371 17.8666 11.4293 15.7394 11.4293C13.6121 11.4293 11.8877 13.1371 11.8877 15.2439C11.8877 17.3506 13.6121 19.0585 15.7394 19.0585Z" fill="#98C6E3"/>
      <path d="M15.7029 18.1182C17.2575 18.1182 18.5176 16.8449 18.5176 15.2742C18.5176 13.7035 17.2575 12.4302 15.7029 12.4302C14.1484 12.4302 12.8882 13.7035 12.8882 15.2742C12.8882 16.8449 14.1484 18.1182 15.7029 18.1182Z" fill="#FAFAFA"/>
      <path d="M15.8782 17.3077C16.9032 17.3077 17.734 16.3891 17.734 15.256C17.734 14.1229 16.9032 13.2043 15.8782 13.2043C14.8533 13.2043 14.0225 14.1229 14.0225 15.256C14.0225 16.3891 14.8533 17.3077 15.8782 17.3077Z" fill="#101320"/>
      <path d="M16.5519 15.0849C16.8716 15.0849 17.1307 14.8552 17.1307 14.5717C17.1307 14.2883 16.8716 14.0585 16.5519 14.0585C16.2323 14.0585 15.9731 14.2883 15.9731 14.5717C15.9731 14.8552 16.2323 15.0849 16.5519 15.0849Z" fill="#FAFAFA"/>
      <path d="M5.86685 20.1225C8.42881 20.1225 10.5057 17.8997 10.5057 15.1577C10.5057 12.4157 8.42881 10.1929 5.86685 10.1929C3.3049 10.1929 1.22803 12.4157 1.22803 15.1577C1.22803 17.8997 3.3049 20.1225 5.86685 20.1225Z" fill="#009de0"/>
      <path d="M17.7644 18.174C17.7657 20.9209 17.8351 23.6714 17.7474 26.4159C17.6718 28.8049 16.1499 30.6006 13.7885 31.098C12.2288 31.4268 10.8275 31.0653 9.61391 30.0522C8.77802 29.3533 8.37347 28.3997 8.19557 27.3465C8.05301 26.5118 8.07982 25.6673 8.09687 24.8253C8.1115 24.1082 8.40759 23.709 8.92302 23.6484C9.6066 23.5683 10.0453 24.1325 9.93803 24.9405C9.82836 25.768 9.87588 26.5931 10.1232 27.389C10.5022 28.6059 11.6037 29.2914 12.9843 29.2162C14.176 29.1507 15.2324 28.2444 15.4664 27.0711C15.5431 26.6828 15.5821 26.2922 15.5809 25.8918C15.5711 23.4919 15.5785 21.092 15.5797 18.6921C16.3607 18.737 17.0638 18.4627 17.7644 18.174Z" fill="#98C6E3"/>
      <path d="M11.2454 21.5385C10.7227 21.6343 10.178 21.3601 9.6443 21.0653C9.44325 20.9537 9.28485 20.7886 9.16543 20.5812C9.03627 20.3543 9.15934 20.2184 9.29581 20.0667C9.44812 19.8969 9.54195 19.9733 9.70279 20.0837C10.4509 20.5982 11.271 20.8153 12.1666 20.5314C12.5236 20.4186 12.8404 20.2257 13.1316 19.9818C13.3108 19.8326 13.5289 19.7537 13.7409 19.9854C13.9371 20.2002 13.8469 20.364 13.6958 20.546C13.089 21.274 12.2958 21.5627 11.2454 21.5385Z" fill="#101320"/>
      <path d="M1.84127 26.1053C1.64753 25.9646 1.68287 25.671 1.90342 25.5775C2.10812 25.4902 2.27628 25.3798 2.27993 25.1492C2.28481 24.7962 2.40544 24.5911 2.85263 24.4552C3.18893 24.3521 3.22671 23.999 3.17918 23.7903C3.10851 23.4749 3.15725 23.3099 3.52889 23.1619C3.72751 23.0806 3.94928 23.2128 3.97121 23.4264C4.01629 23.8753 4.05285 24.3242 4.05041 24.7768C4.04797 25.2172 4.62311 25.273 5.01668 25.4344C5.03496 25.4416 5.0508 25.4501 5.06664 25.4611C5.11416 25.4914 5.16168 25.5217 5.2092 25.5521C5.22992 25.58 5.27013 25.6042 5.31399 25.6297C5.41026 25.6843 5.46996 25.7874 5.46874 25.8966C5.46265 26.4742 5.42488 27.0529 5.35908 27.6426C5.35664 27.6608 5.35299 27.6777 5.34811 27.6947C5.3408 27.7178 5.33593 27.7421 5.33349 27.7663C5.29694 27.776 5.25916 27.7857 5.22261 27.7967C3.91394 27.5346 2.81729 27.0092 1.94972 26.1951C1.9156 26.1623 1.87905 26.1332 1.84127 26.1053Z" fill="#98C6E3"/>
      <path d="M0.147461 26.2351L1.85945 26.7205L5.82932 19.6299L4.11733 19.1446L0.147461 26.2351Z" fill="#009de0"/>
      <path d="M1.45602 27.1698C1.92331 26.8627 2.09629 26.3032 1.84239 25.9201C1.58848 25.537 1.00383 25.4754 0.53654 25.7825C0.0692461 26.0896 -0.103739 26.6491 0.150167 27.0321C0.404073 27.4152 0.988721 27.4769 1.45602 27.1698Z" fill="#009de0"/>
      <path d="M2.12163 21.8212C1.52456 21.9085 -0.942896 22.4569 0.420604 25.4538C0.480311 25.586 0.633842 25.7547 0.760566 25.8263C1.22969 26.0908 2.12163 26.2922 2.33487 25.6843C2.45915 25.3312 2.4031 25.6164 1.39175 24.2599C1.35885 24.2162 1.3491 24.0415 1.51116 24.0767L2.45306 24.6348C2.55663 24.6955 2.6797 24.7246 2.79668 24.6979C2.96727 24.6591 3.14882 24.5086 3.05378 24.0148C3.0355 23.9238 2.99164 23.8377 2.92828 23.7709C2.78693 23.6217 2.50302 23.3511 2.22398 23.2407C2.22398 23.2407 2.12528 23.0927 2.27394 23.1218C2.36167 23.1388 2.68945 23.3038 2.94046 23.4361C3.15979 23.5513 3.43761 23.4931 3.57774 23.2893C3.6874 23.1291 3.75442 22.918 3.62891 22.679C3.40836 22.2555 2.65168 21.9498 2.36046 21.8466C2.28491 21.8175 2.20327 21.809 2.12163 21.8212Z" fill="#98C6E3" stroke="#A8C8D9" strokeWidth="0.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.40948 17.0929C7.4344 17.0929 8.26526 16.1744 8.26526 15.0412C8.26526 13.9081 7.4344 12.9896 6.40948 12.9896C5.38457 12.9896 4.55371 13.9081 4.55371 15.0412C4.55371 16.1744 5.38457 17.0929 6.40948 17.0929Z" fill="#101320"/>
      <path d="M7.08172 14.8714C7.40137 14.8714 7.6605 14.6416 7.6605 14.3582C7.6605 14.0747 7.40137 13.8449 7.08172 13.8449C6.76206 13.8449 6.50293 14.0747 6.50293 14.3582C6.50293 14.6416 6.76206 14.8714 7.08172 14.8714Z" fill="#FAFAFA"/>
      <path d="M5.76726 11.1684C7.83261 11.1417 9.64817 12.8379 9.78343 14.9721C9.94549 17.5455 7.9374 19.3072 5.88667 19.3242C3.71165 19.3424 1.84978 17.554 1.82785 15.2305C1.8047 12.7299 3.67266 11.1915 5.76726 11.1684ZM9.08279 15.4623C9.15956 13.4518 7.3513 11.86 5.67709 11.8794C4.0309 11.8976 2.61987 13.4166 2.5955 15.2038C2.56748 17.247 4.07964 18.6302 5.9939 18.629C7.53895 18.6278 9.13519 17.0857 9.08279 15.4623Z" fill="#FAFAFA"/>
      <path d="M21.3823 9.0051C21.375 9.00874 21.3664 9.01238 21.3591 9.01602C20.0895 9.62752 17.8742 12.6717 1.35016 8.29653C1.35016 8.29653 -1.29642 7.38777 2.0508 6.65373L5.40533 6.08226C5.40777 6.08226 5.40898 6.08105 5.4102 6.07862C5.46991 5.94759 7.78749 0.896629 7.8472 0.855377C7.90813 0.814125 8.7696 -1.01795 10.9081 0.803205C10.9775 0.862656 11.3711 1.49114 12.2192 0.814125C12.2204 0.812911 14.6842 -0.641833 15.2971 0.638196C15.2971 0.638196 16.2207 2.15361 17.2638 6.1405C17.2638 6.14293 17.265 6.14414 17.2662 6.14414C17.3393 6.16234 19.2158 6.64766 21.4505 7.69838L21.4871 7.719C21.548 7.78088 21.888 8.09149 21.8685 8.37176C21.8465 8.70056 21.3945 8.99903 21.3823 9.0051Z" fill="#101320"/>
      <path d="M5.27832 5.91968C5.27832 5.91968 12.632 8.43848 17.1916 6.1684" stroke="#FAFAFA" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5863 4.00388L13.8989 4.84519L14.7439 5.15651L13.8989 5.46782L13.5863 6.30914L13.2736 5.46782L12.4287 5.15651L13.2736 4.84519L13.5863 4.00388Z" fill="#FAFAFA"/>
    </g>
    <defs>
      <clipPath id="clip0_ernest">
        <rect width="22" height="35" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// ============================================
// MESSAGE CONTENT - Formaterer Ernest's svar
// ============================================

interface ParsedMessage {
  content: string;
  references: string[];
}

function parseMessage(text: string): ParsedMessage {
  // Split på references sektion
  const referencesMatch = text.match(/###?\s*References?\s*[\n\r]+([\s\S]*?)$/i);
  
  if (referencesMatch) {
    const content = text.slice(0, referencesMatch.index).trim();
    const referencesText = referencesMatch[1];
    
    // Parse references (format: - [1] filename.pdf eller * [1] filename.pdf)
    const references = referencesText
      .split(/[\n\r]+/)
      .map(line => line.replace(/^[\s\-\*]*\[\d+\]\s*/, '').trim())
      .filter(Boolean);
    
    return { content, references };
  }
  
  return { content: text, references: [] };
}

function formatMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="space-y-1.5 my-2">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="text-primary mt-0.5">•</span>
              <span>{formatInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) {
      flushList();
      return;
    }
    
    // Bullet points
    if (trimmed.match(/^[\*\-•]\s+/)) {
      const content = trimmed.replace(/^[\*\-•]\s+/, '');
      listItems.push(content);
      return;
    }
    
    // Numbered list
    if (trimmed.match(/^\d+\.\s+/)) {
      const content = trimmed.replace(/^\d+\.\s+/, '');
      listItems.push(content);
      return;
    }
    
    flushList();
    
    // Regular paragraph
    elements.push(
      <p key={`p-${index}`} className="mb-2 last:mb-0">
        {formatInlineMarkdown(trimmed)}
      </p>
    );
  });
  
  flushList();
  return elements;
}

function formatInlineMarkdown(text: string): React.ReactNode {
  // Process bold text **text** and emojis
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  
  // Bold pattern
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add bold text
    parts.push(
      <strong key={`bold-${key++}`} className="font-semibold text-slate-900">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

interface MessageContentProps {
  content: string;
  sender: 'user' | 'ernest';
}

function MessageContent({ content, sender }: MessageContentProps) {
  const [showRefs, setShowRefs] = useState(false);
  
  if (sender === 'user') {
    return <p className="text-sm leading-relaxed">{content}</p>;
  }
  
  const { content: mainContent, references } = parseMessage(content);
  
  return (
    <div className="text-sm leading-relaxed">
      {formatMarkdown(mainContent)}
      
      {references.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-200">
          <button
            onClick={() => setShowRefs(!showRefs)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            <FileText size={12} />
            <span>{references.length} kilde{references.length > 1 ? 'r' : ''}</span>
            {showRefs ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          
          {showRefs && (
            <div className="mt-2 space-y-1">
              {references.map((ref, i) => (
                <div 
                  key={i}
                  className="text-xs text-slate-500 bg-slate-100 rounded px-2 py-1 truncate"
                  title={ref}
                >
                  📄 {ref.replace(/\.pdf$/i, '')}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Context-based messages and quick replies (statisk del)
const globalContextConfig = {
  initialMessage: "Hej! Jeg er Ernest, din løn-assistent. Spørg mig om overenskomst, løn eller dine rettigheder. 👋",
  quickReplies: [
    "Hvad er min overenskomst?",
    "Hvordan beregnes feriepenge?",
    "Hvad er ATP?",
  ],
};

// Dynamisk analyse-kontekst baseret på lønseddel-data
function getAnalysisContextConfig(analysis?: PayslipAnalysisContext) {
  if (!analysis) {
    return {
      initialMessage: "Jeg har analyseret din lønseddel. Spørg mig om detaljerne! 🔍",
      quickReplies: [
        "Ser min løn korrekt ud?",
        "Hvad er mine tillæg?",
        "Har jeg ret til mere?",
      ],
    };
  }
  
  const errorCount = analysis.errors.length;
  const totalDiff = analysis.errors.reduce((sum, e) => sum + e.difference, 0);
  
  if (errorCount === 0) {
    return {
      initialMessage: `✅ Godt nyt! Jeg har gennemgået din lønseddel for ${analysis.period} og fundet ingen fejl. Din bruttoløn er ${analysis.grossSalary.toLocaleString('da-DK')} kr og nettoløn ${analysis.netSalary.toLocaleString('da-DK')} kr.`,
      quickReplies: [
        "Er mine tillæg korrekte?",
        "Hvad kan jeg forvente næste måned?",
        "Hvordan ser min pension ud?",
      ],
    };
  }
  
  return {
    initialMessage: `Hej! 👋 Jeg har kigget på din lønseddel for ${analysis.period}.\n\nJeg fandt ${errorCount} ${errorCount === 1 ? 'ting' : 'ting'} du bør tjekke - i alt ca. **${Math.abs(totalDiff).toLocaleString('da-DK')} kr**.\n\nSpørg mig om detaljerne!`,
    quickReplies: [
      "Forklar fejlene",
      "Hvad skal jeg gøre?",
      "Hjælp mig med at kontakte arbejdsgiver",
    ],
  };
}

// Kombiner kontekst-konfigurationer
function getContextConfig(context: ErnestContext, analysis?: PayslipAnalysisContext) {
  if (context === 'analysis') {
    return getAnalysisContextConfig(analysis);
  }
  return globalContextConfig;
}

export function ErnestChatSheet({ open, onOpenChange, initialMessage, context = "global" }: ErnestChatSheetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  
  const { user } = useUser();
  const { getErnestPayslipContext, hasActiveAnalysis } = usePayslip();
  const { contractDetails, hasDetails: hasContract } = useContract();
  const { isConnected: calendarConnected, getMonthStats, shifts } = useCalendar();
  
  const [apiPayslipContext, setApiPayslipContext] = useState<PayslipAnalysisContext | undefined>(undefined);
  
  const localPayslipContext = context === 'analysis' ? getErnestPayslipContext() : undefined;
  const payslipAnalysis = localPayslipContext || apiPayslipContext;

  const contractContext: ContractAnalysisContext | undefined = hasContract && contractDetails ? (() => {
    const supp = contractDetails.supplements;
    let supplementInfo = '';
    if (supp.type === 'agreement') {
      supplementInfo = `${supp.description} (${supp.rules.map(r => `${r.label}: ${r.rule}`).join(', ')})`;
    } else {
      const parts: string[] = [];
      if (supp.evening?.rate) parts.push(`Aften: ${supp.evening.rate} kr/t`);
      if (supp.saturday?.rate) parts.push(`Lørdag: ${supp.saturday.rate} kr/t`);
      if (supp.sunday?.rate) parts.push(`Søn-/helligdag: ${supp.sunday.rate} kr/t`);
      supplementInfo = parts.join(', ') || 'Ingen';
    }
    return {
      employerName: contractDetails.employer?.name || '',
      jobTitle: contractDetails.employment?.title || '',
      weeklyHours: contractDetails.employment?.weeklyHours || 37,
      hourlyRate: contractDetails.salary?.hourlyRate || 0,
      seniorityYears: contractDetails.salary?.seniorityYears || 0,
      seniorityFrom: contractDetails.salary?.seniorityFrom,
      collectiveAgreement: contractDetails.collectiveAgreement?.name || '',
      fritvalgPercent: contractDetails.salary?.fritvalgPercent,
      pensionEmployee: contractDetails.pension?.employeePercent || 0,
      pensionEmployer: contractDetails.pension?.employerPercent || 0,
      pensionProvider: contractDetails.pension?.provider || '',
      supplementInfo,
      vacationDays: contractDetails.vacation?.daysPerYear,
    };
  })() : undefined;

  const shiftContext: ShiftAnalysisContext | undefined = (() => {
    if (!calendarConnected || !shifts || shifts.length === 0) return undefined;
    const now = new Date();
    const stats = getMonthStats(now.getFullYear(), now.getMonth());

    const currentMonthShifts = shifts
      .filter(s => {
        const d = new Date(s.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && s.type !== 'day-off';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(s => ({
        date: s.date,
        type: s.type,
        label: s.label,
        time: s.time,
        hours: s.hours,
      }));

    return {
      periodLabel: `${now.toLocaleString('da-DK', { month: 'long' })} ${now.getFullYear()}`,
      totalHours: stats.totalHours,
      totalShifts: stats.totalShifts,
      dayShifts: stats.dayShifts,
      eveningShifts: stats.eveningShifts,
      nightShifts: stats.nightShifts,
      weekendShifts: stats.weekendShifts,
      shifts: currentMonthShifts,
    };
  })();

  // Hent dynamisk kontekst-config baseret på lønseddel-analyse
  const config = getContextConfig(context, payslipAnalysis);

  // Tjek om Ernest-serveren er tilgængelig + hent seneste lønseddel fra API
  useEffect(() => {
    if (open) {
      checkErnestHealth().then(setIsOnline);
      
      // 🆕 Hent seneste lønseddel fra API hvis vi ikke har lokal data
      if (!localPayslipContext) {
        api.getLatestPayslipAnalysis().then(result => {
          if (result.success && result.data) {
            console.log('[Ernest] Hentet lønseddel fra API:', result.data.period);
            // Konverter API format til Ernest format
            setApiPayslipContext({
              period: result.data.period,
              employer: result.data.employer,
              grossSalary: result.data.bruttolon,
              netSalary: result.data.nettolon,
              deductions: result.data.bruttolon - result.data.nettolon,
              status: result.data.status === 'ok' ? 'ok' : 'errors_found',
              errors: result.data.discrepancies.map(d => ({
                type: d.field,
                description: d.description,
                expectedAmount: 0,
                actualAmount: 0,
                difference: d.difference,
              })),
            });
          }
        });
      }
    }
  }, [open, localPayslipContext]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: '1',
        content: initialMessage || config.initialMessage,
        sender: 'ernest',
        timestamp: new Date()
      }]);
      setShowQuickReplies(true);
    }
  }, [open, initialMessage, config.initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after closing
    setTimeout(() => {
      setMessages([]);
      setShowQuickReplies(true);
      setInputValue("");
    }, 300);
  };

  // Fallback-svar hvis LightRAG ikke er tilgængelig
  const getFallbackResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    const responses = config.responses;

    if (context === "global") {
      if (lowerInput.includes("overenskomst")) return responses.overenskomst;
      if (lowerInput.includes("ferie") || lowerInput.includes("ferieberegn")) return responses.feriepenge;
      if (lowerInput.includes("atp")) return responses.atp;
    } else {
      if (lowerInput.includes("fejl") || lowerInput.includes("hvor kommer")) return responses.fejl;
      if (lowerInput.includes("penge") || lowerInput.includes("tilbage")) return responses.penge;
      if (lowerInput.includes("fagforening")) return responses.fagforening;
    }

    return responses.default;
  };

  // Opdater streaming besked
  const updateStreamingMessage = useCallback((content: string) => {
    if (!streamingMessageIdRef.current) return;
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === streamingMessageIdRef.current 
          ? { ...msg, content } 
          : msg
      )
    );
  }, []);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setShowQuickReplies(false);

    // Opret placeholder for Ernest's svar
    const ernestMessageId = (Date.now() + 1).toString();
    streamingMessageIdRef.current = ernestMessageId;
    
    const ernestPlaceholder: Message = {
      id: ernestMessageId,
      content: '',
      sender: 'ernest',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, ernestPlaceholder]);
    setIsStreaming(true);

    try {
      // Tjek om serveren er tilgængelig
      const serverAvailable = await checkErnestHealth();
      
      // Debug logging
      console.log('[ErnestChat] Context:', context);
      console.log('[ErnestChat] PayslipAnalysis:', payslipAnalysis);
      console.log('[ErnestChat] User:', user?.firstName);
      
      if (!serverAvailable) {
        // Brug fallback hvis serveren ikke er tilgængelig
        updateStreamingMessage(getFallbackResponse(messageText));
      } else {
        // Brug Ernest med streaming - context mappes fra component context
        const ernestContext = context === 'analysis' ? 'payslip_analysis' : 'general';
        
        console.log('[ErnestChat] Sender til Ernest med context:', ernestContext);
        console.log('[ErnestChat] Antal fejl i analyse:', payslipAnalysis?.errors?.length || 0);
        
        await streamErnest(messageText, updateStreamingMessage, { 
          context: ernestContext,
          user: user ? {
            firstName: user.firstName,
            employer: user.employer,
            employerType: user.employerType,
            jobTitle: user.jobTitle,
            department: user.department,
            area: user.area,
            yearsOfExperience: user.yearsOfExperience,
            collectiveAgreement: user.collectiveAgreement,
            primaryShiftType: user.primaryShiftType,
            union: user.union,
          } : undefined,
          payslip: context === 'analysis' ? payslipAnalysis : undefined,
          contract: contractContext,
          shiftStats: shiftContext,
        });
      }
      
    } catch (error) {
      console.error('Fejl ved Ernest-chat:', error);
      // Brug fallback ved fejl
      updateStreamingMessage(getFallbackResponse(messageText));
    } finally {
      setIsStreaming(false);
      streamingMessageIdRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!open) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none bg-black/20 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* The Chat Window */}
      <div 
        className="pointer-events-auto w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* A. HEADER - THE ONLY BLUE PART */}
        <div className="bg-primary p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo Container - White Circle */}
            <div className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center">
              <ErnestMascotSVG />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl font-urbanist">Ernest</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : isOnline === false ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                <span className="text-white/70 text-xs">
                  {isOnline ? 'AI-assistent' : isOnline === false ? 'Offline-tilstand' : 'Forbinder...'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-white hover:opacity-80 transition-opacity"
            aria-label="Luk chat"
          >
            <X size={24} />
          </button>
        </div>

        {/* B. CHAT BODY - LIGHT GREY */}
        <div className="flex-1 bg-[#F3F4F6] p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 ${
                  message.sender === 'ernest'
                    ? 'bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100'
                    : 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                }`}
              >
                <MessageContent content={message.content} sender={message.sender} />
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isStreaming && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 p-3">
                <div className="flex gap-1.5 items-center px-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Quick Replies */}
          {showQuickReplies && messages.length === 1 && !isStreaming && (
            <div className="flex flex-wrap gap-2 mt-4">
              {config.quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSendMessage(reply)}
                  className="bg-white border border-gray-200 text-slate-700 px-3 py-2 rounded-full text-sm hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* C. FOOTER - INPUT FIELD */}
        <div className="bg-white p-4 border-t border-gray-100 shrink-0">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isStreaming}
              placeholder={isStreaming ? "Ernest skriver..." : "Skriv dit spørgsmål..."}
              className="w-full bg-white border border-gray-200 rounded-full py-3 px-4 pr-12 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
              aria-label="Tal besked"
              disabled={isStreaming}
            >
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
