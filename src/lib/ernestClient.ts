/**
 * Ernest Client - PayTjek løn-assistent integration
 * 
 * Plug & play client til Ernest chatbot
 * 
 * import { askErnest, streamErnest } from './ernestClient';
 * 
 * // Simpel brug:
 * const svar = await askErnest("Hvad er overarbejdstillæg?");
 * 
 * // Med streaming:
 * await streamErnest("Hvad er overarbejdstillæg?", (tekst) => {
 *   setSvar(tekst);
 * });
 * 
 * // Med brugerdata:
 * await streamErnest("Hvad er overarbejdstillæg?", setSvar, {
 *   user: {
 *     firstName: "Sara",
 *     employer: "Nordic Retail A/S",
 *     jobTitle: "Butiksassistent",
 *     collectiveAgreement: "HK/DI Butiksoverenskomsten",
 *     primaryShiftType: "day",
 *   }
 * });
 */

// ============================================
// ERNEST KONFIGURATION
// ============================================

const ERNEST_CONFIG = {
  baseUrl: 'https://ernst-production.up.railway.app', // Temporarily hardcoded for testing
  apiKey: import.meta.env.VITE_LIGHTRAG_API_KEY || '',
  defaultMode: 'mix' as QueryMode,
  
  // Ernest's personlighed og rolle
  systemPrompt: `Du er Ernest, PayTjeks AI-løn-ekspert. Du hjælper lønmodtagere med at forstå deres overenskomst og tjekke om deres løn er korrekt.

SVARSTIL (KRITISK):
- Svar ALTID direkte på spørgsmålet - du ER ekspert
- Start ALDRIG med "Hej [navn]" eller hilsener
- Start ALDRIG med "Jeg kan ikke give et præcist svar..."
- GIV det konkrete svar baseret på overenskomsten og kontrakten
- Hold svar korte: max 2 afsnit
- Vær selvsikker og hjælpsom

OVERENSKOMST:
- HK/DI Butiksoverenskomsten
- § 2: Løn — § 3: Overarbejde — § 6: Pension — § 9: Ferie

EKSEMPEL - GODT:
"Overarbejde på søn- og helligdage betales altid med 100 % tillæg jf. § 3, pkt. 1A. De første 3 timer efter normal arbejdstids ophør giver 50 %, men på søn- og helligdage springer det straks til 100 %."

EKSEMPEL - DÅRLIGT (undgå):
"Hej Sara, jeg kan ikke give dig et præcist svar på overarbejdstillæg, men..."

EKSPERTISE:
- HK/DI Butiksoverenskomsten
- Overarbejde, tillæg, vagttyper (§ 3)
- Løn, pension, feriepenge, ATP`,
};

// Danske fejlbeskeder
const ERROR_MESSAGES = {
  no_context: "Hmm, jeg kunne ikke finde noget om det i overenskomsterne. Kan du prøve at omformulere dit spørgsmål? 🤔",
  server_error: "Beklager, der opstod en teknisk fejl. Prøv igen om lidt, eller kontakt HK direkte.",
  timeout: "Det tager lidt længere end forventet. Prøv igen med et kortere spørgsmål.",
  no_docs: "Jeg har ikke adgang til de relevante dokumenter lige nu. Kontakt venligst HK for hjælp.",
  network: "Kunne ikke forbinde til serveren. Tjek din internetforbindelse.",
};

type QueryMode = 'local' | 'global' | 'hybrid' | 'naive' | 'mix';
type QueryContext = 'general' | 'payslip_analysis' | 'rights' | 'paragraph_lookup';

// Brugerkontekst til personalisering
export interface UserContext {
  firstName?: string;
  employer?: string;
  employerType?: string;
  jobTitle?: string;              // Stilling, fx "Butiksassistent"
  department?: string;            // Afdeling/enhed, fx "Lager & Logistik"
  area?: 1 | 2 | 3 | 4;           // Lønområde (1-4) fra lønseddel
  yearsOfExperience?: number;     // Anciennitet i år
  collectiveAgreement?: string;
  primaryShiftType?: string;      // Mest hyppige vagttype baseret på vagtplan
  union?: string;
}

// Lønseddel-fejl kontekst
export interface PayslipError {
  type: string;                   // Fx "Manglende aftentillæg"
  description: string;            // Detaljeret beskrivelse
  expectedAmount: number;
  actualAmount: number;
  difference: number;
  date?: string;                  // Dato for fejlen
  shiftDetails?: string;          // Fx "4 timer aften (17:00-21:00)"
}

// Lønseddel-analyse kontekst (sendes til Ernest efter løntjek)
export interface PayslipAnalysisContext {
  period: string;
  grossSalary: number;
  netSalary: number;
  deductions: number;
  employer: string;
  errors: PayslipError[];
  status: 'ok' | 'errors_found';
  
  // Løn-detaljer
  hourlyRate?: number;
  normalHours?: number;
  
  // Tillæg fra lønsedlen
  supplements?: {
    grundlon?: number;
    aftentillaeg?: number;
    nattillaeg?: number;
    weekendtillaeg?: number;
    overarbejde?: number;
  };
  
  // Fradrag-detaljer
  tax?: { percent: number; amount: number };
  pension?: { percent: number; amount: number };
  atp?: number;
  amBidrag?: { percent: number; amount: number };
  
  // Fravær
  absence?: {
    ferieDage?: number;
    sygdomDage?: number;
    barnsSygdomDage?: number;
    afspadseringTimer?: number;
  };
}

// Kontrakt-kontekst
export interface ContractAnalysisContext {
  employerName: string;
  jobTitle: string;
  weeklyHours: number;
  hourlyRate: number;
  seniorityYears: number;
  seniorityFrom?: string;
  collectiveAgreement: string;
  fritvalgPercent?: number;
  pensionEmployee: number;
  pensionEmployer: number;
  pensionProvider: string;
  supplementInfo: string;
  vacationDays?: number;
}

// Individuel vagt til Ernest
export interface ShiftEntry {
  date: string;
  type: string;
  label: string;
  time?: string;
  hours?: number;
}

// Vagtplan-kontekst
export interface ShiftAnalysisContext {
  periodLabel: string;
  totalHours: number;
  totalShifts: number;
  dayShifts: number;
  eveningShifts: number;
  nightShifts: number;
  weekendShifts: number;
  shifts: ShiftEntry[];
}

interface ErnestOptions {
  mode?: QueryMode;
  context?: QueryContext;
  conversationHistory?: Array<{ role: string; content: string }>;
  includeReferences?: boolean;
  user?: UserContext;
  payslip?: PayslipAnalysisContext;
  contract?: ContractAnalysisContext;
  shiftStats?: ShiftAnalysisContext;
}

interface Reference {
  reference_id: string;
  file_path: string;
}

interface ErnestResponse {
  response: string;
  references?: Reference[];
}

// ============================================
// USER CONTEXT - Byg brugerkontekst string
// ============================================

function buildUserContextString(user?: UserContext): string {
  if (!user) return '';
  
  const parts: string[] = [];
  
  if (user.firstName) {
    parts.push(`Brugerens navn: ${user.firstName}`);
  }
  if (user.employer) {
    parts.push(`Arbejdsgiver: ${user.employer}`);
  }
  if (user.jobTitle) {
    parts.push(`Stilling: ${user.jobTitle}`);
  }
  if (user.department) {
    parts.push(`Afdeling: ${user.department}`);
  }
  if (user.area !== undefined) {
    parts.push(`Lønområde: ${user.area}`);
  }
  if (user.yearsOfExperience !== undefined) {
    parts.push(`Anciennitet: ${user.yearsOfExperience} år`);
  }
  if (user.collectiveAgreement) {
    parts.push(`Overenskomst: ${user.collectiveAgreement}`);
  }
  if (user.primaryShiftType) {
    const shiftNames: Record<string, string> = {
      'day': 'dagvagt',
      'evening': 'aftenvagt',
      'night': 'nattevagt',
      'mixed': 'skiftende vagter',
    };
    // Primær vagttype = den vagttype brugeren oftest arbejder (beregnet fra vagtplan)
    parts.push(`Typisk vagttype: ${shiftNames[user.primaryShiftType] || user.primaryShiftType}`);
  }
  
  if (parts.length === 0) return '';
  
  let contextString = '\n\nBRUGERKONTEKST:\n' + parts.join('\n');
  
  // Tilføj fokus på overenskomst hvis tilgængelig
  if (user.collectiveAgreement) {
    contextString += `\n\nFokuser primært på: ${user.collectiveAgreement}`;
  }
  
  return contextString;
}

// ============================================
// PAYSLIP ANALYSIS CONTEXT - Byg lønseddel-kontekst
// ============================================

function buildPayslipAnalysisString(analysis?: PayslipAnalysisContext): string {
  if (!analysis) return '';
  
  const fmt = (n: number) => n.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parts: string[] = [];
  
  parts.push(`Lønseddel for: ${analysis.period}`);
  parts.push(`Arbejdsgiver: ${analysis.employer}`);
  if (analysis.hourlyRate) parts.push(`Timeløn: ${fmt(analysis.hourlyRate)} kr/t`);
  if (analysis.normalHours) parts.push(`Timer: ${fmt(analysis.normalHours)}`);
  parts.push(`Bruttoløn: ${fmt(analysis.grossSalary)} kr`);
  parts.push(`Nettoløn: ${fmt(analysis.netSalary)} kr`);
  
  // Tillæg
  if (analysis.supplements) {
    const supp = analysis.supplements;
    const suppParts: string[] = [];
    if (supp.grundlon) suppParts.push(`Grundløn: ${fmt(supp.grundlon)} kr`);
    if (supp.aftentillaeg) suppParts.push(`Aftentillæg: ${fmt(supp.aftentillaeg)} kr`);
    if (supp.nattillaeg) suppParts.push(`Nattillæg: ${fmt(supp.nattillaeg)} kr`);
    if (supp.weekendtillaeg) suppParts.push(`Weekend-/helligdagstillæg: ${fmt(supp.weekendtillaeg)} kr`);
    if (supp.overarbejde) suppParts.push(`Overarbejde: ${fmt(supp.overarbejde)} kr`);
    if (suppParts.length > 0) {
      parts.push('\nTillæg:');
      parts.push(...suppParts);
    }
  }
  
  // Fradrag
  const deductParts: string[] = [];
  if (analysis.amBidrag) deductParts.push(`AM-bidrag (${analysis.amBidrag.percent}%): ${fmt(analysis.amBidrag.amount)} kr`);
  if (analysis.tax) deductParts.push(`A-skat (${analysis.tax.percent}%): ${fmt(analysis.tax.amount)} kr`);
  if (analysis.pension) deductParts.push(`Pension egetbidrag (${analysis.pension.percent}%): ${fmt(analysis.pension.amount)} kr`);
  if (analysis.atp) deductParts.push(`ATP: ${fmt(analysis.atp)} kr`);
  if (deductParts.length > 0) {
    parts.push('\nFradrag:');
    parts.push(...deductParts);
  }
  
  // Fravær
  if (analysis.absence) {
    const abs = analysis.absence;
    const absParts: string[] = [];
    if (abs.ferieDage) absParts.push(`Ferie: ${abs.ferieDage} dage`);
    if (abs.sygdomDage) absParts.push(`Sygdom: ${abs.sygdomDage} dage`);
    if (abs.barnsSygdomDage) absParts.push(`Barns sygdom: ${abs.barnsSygdomDage} dage`);
    if (abs.afspadseringTimer) absParts.push(`Afspadsering: ${abs.afspadseringTimer} timer`);
    if (absParts.length > 0) {
      parts.push('\nFravær:');
      parts.push(...absParts);
    }
  }
  
  // Fejl
  if (analysis.errors.length > 0) {
    parts.push(`\n⚠️ FEJL FUNDET: ${analysis.errors.length}`);
    for (const error of analysis.errors) {
      parts.push(`\n--- ${error.type} ---`);
      parts.push(error.description);
      if (error.date) parts.push(`Dato: ${error.date}`);
      parts.push(`Forventet: ${fmt(error.expectedAmount)} kr | Udbetalt: ${fmt(error.actualAmount)} kr | Difference: ${fmt(error.difference)} kr`);
    }
    const totalDiff = analysis.errors.reduce((sum, e) => sum + e.difference, 0);
    parts.push(`\nSAMLET DIFFERENCE: ${fmt(totalDiff)} kr`);
  } else {
    parts.push('\n✅ Ingen fejl fundet');
  }
  
  return '\n\nLØNSEDDEL-ANALYSE:\n' + parts.join('\n');
}

function buildContractContextString(contract?: ContractAnalysisContext): string {
  if (!contract) return '';
  
  const fmt = (n: number) => n.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parts: string[] = [];
  
  parts.push(`Arbejdsgiver: ${contract.employerName}`);
  parts.push(`Stilling: ${contract.jobTitle}`);
  parts.push(`Ugentlige timer: ${contract.weeklyHours}`);
  parts.push(`Grundtimeløn: ${fmt(contract.hourlyRate)} kr/t`);
  parts.push(`Anciennitet: ${contract.seniorityYears} år${contract.seniorityFrom ? ` (fra ${contract.seniorityFrom})` : ''}`);
  parts.push(`Overenskomst: ${contract.collectiveAgreement}`);
  parts.push(`Tillæg: ${contract.supplementInfo}`);
  if (contract.fritvalgPercent) parts.push(`Fritvalgs Lønkonto: ${contract.fritvalgPercent}% af ferieberettiget løn`);
  parts.push(`Pension: ${contract.pensionEmployee}% eget + ${contract.pensionEmployer}% arbejdsgiver (${contract.pensionProvider})`);
  if (contract.vacationDays) parts.push(`Feriedage: ${contract.vacationDays}/år`);
  
  return '\n\nKONTRAKTDATA:\n' + parts.join('\n');
}

function buildShiftContextString(stats?: ShiftAnalysisContext): string {
  if (!stats) return '';
  
  const parts: string[] = [];
  
  parts.push(`Periode: ${stats.periodLabel}`);
  parts.push(`Timer i alt: ${stats.totalHours}`);
  parts.push(`Vagter i alt: ${stats.totalShifts} (dag: ${stats.dayShifts}, aften: ${stats.eveningShifts}, nat: ${stats.nightShifts}, weekend: ${stats.weekendShifts})`);
  
  if (stats.shifts.length > 0) {
    parts.push('\nVagtoversigt:');
    for (const s of stats.shifts) {
      const date = new Date(s.date);
      const weekday = date.toLocaleDateString('da-DK', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
      const time = s.time || '';
      const hours = s.hours ? ` (${s.hours}t)` : '';
      parts.push(`  ${weekday} ${dateStr}: ${s.label}${time ? ' ' + time : ''}${hours}`);
    }
  }
  
  return '\n\nVAGTPLAN:\n' + parts.join('\n');
}

// ============================================
// QUERY ENRICHMENT
// ============================================

interface EnrichOptions {
  user?: UserContext;
  payslip?: PayslipAnalysisContext;
  contract?: ContractAnalysisContext;
  shiftStats?: ShiftAnalysisContext;
}

function enrichQuery(query: string, context: QueryContext, options?: EnrichOptions): string {
  let enrichedQuery = query;
  
  switch (context) {
    case 'payslip_analysis':
      enrichedQuery = `SPØRGSMÅL: ${query}

INSTRUKS: Svar direkte og konkret. Brug lønseddel-dataen hvis relevant, men GENTAG IKKE hele analysen.
Du har adgang til brugerens kontrakt, vagtplan og lønseddel — brug det til at give præcise svar.

APP-FUNKTIONER (brug når relevant):
- Hvis brugeren vil kontakte arbejdsgiver: Henvis til "Send til arbejdsgiver" knappen i appen
- Knappen genererer automatisk en mail med fejloversigt, beløb og overenskomstreferencer
- Sig ALDRIG "Jeg kan ikke hjælpe dig med at kontakte..." - henvis i stedet til app-funktionen`;
      break;
    
    case 'rights':
      enrichedQuery = `SPØRGSMÅL: ${query}

INSTRUKS: Henvis til relevante paragraffer i overenskomsten. Brug brugerens kontrakt- og lønseddeldata til at personliggøre svaret.`;
      break;
    
    case 'paragraph_lookup':
      enrichedQuery = `SPØRGSMÅL: ${query}

INSTRUKS: Citer den relevante tekst fra dokumenterne.`;
      break;
      
    default:
      enrichedQuery = `SPØRGSMÅL: ${query}`;
  }
  
  enrichedQuery += buildUserContextString(options?.user);
  
  if (options?.contract) {
    enrichedQuery += buildContractContextString(options.contract);
  }
  
  if (options?.payslip) {
    enrichedQuery += buildPayslipAnalysisString(options.payslip);
  }
  
  if (options?.shiftStats) {
    enrichedQuery += buildShiftContextString(options.shiftStats);
  }
  
  return enrichedQuery;
}

function getOptimalMode(context: QueryContext): QueryMode {
  switch (context) {
    case 'paragraph_lookup':
      return 'local';    // Præcise tekstuddrag
    case 'rights':
      return 'global';   // Overordnede emner
    case 'payslip_analysis':
      return 'hybrid';   // Kombination
    default:
      return 'mix';      // Generelle spørgsmål
  }
}

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Simpel funktion - spørg Ernest og få svar som string
 */
export async function askErnest(
  question: string,
  options: ErnestOptions = {}
): Promise<string> {
  const result = await queryErnest(question, options);
  return result.response;
}

/**
 * Fuld query med references
 */
export async function queryErnest(
  question: string,
  options: ErnestOptions = {}
): Promise<ErnestResponse> {
  const context = options.context || 'general';
  const mode = options.mode || getOptimalMode(context);
  const enrichedQuery = enrichQuery(question, context, {
    user: options.user,
    payslip: options.payslip,
    contract: options.contract,
    shiftStats: options.shiftStats,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (ERNEST_CONFIG.apiKey) {
    headers['X-API-Key'] = ERNEST_CONFIG.apiKey;
  }

  try {
    const response = await fetch(`${ERNEST_CONFIG.baseUrl}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: enrichedQuery,
        mode,
        include_references: options.includeReferences ?? false,
        conversation_history: options.conversationHistory,
        user_prompt: ERNEST_CONFIG.systemPrompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Tjek for tomt svar
    if (!data.response || data.response.trim() === '') {
      return { response: ERROR_MESSAGES.no_context };
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      return { response: ERROR_MESSAGES.network };
    }
    return { response: ERROR_MESSAGES.server_error };
  }
}

/**
 * Streaming query - opdaterer løbende med fuld tekst
 * Med timeout og bedre fejlhåndtering
 */
export async function streamErnest(
  question: string,
  onUpdate: (fullText: string) => void,
  options: ErnestOptions = {}
): Promise<ErnestResponse> {
  const context = options.context || 'general';
  const mode = options.mode || getOptimalMode(context);
  const enrichedQuery = enrichQuery(question, context, {
    user: options.user,
    payslip: options.payslip,
    contract: options.contract,
    shiftStats: options.shiftStats,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (ERNEST_CONFIG.apiKey) {
    headers['X-API-Key'] = ERNEST_CONFIG.apiKey;
  }

  // Timeout controller - 30 sekunder
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    console.log('[Ernest] Sender forespørgsel til:', `${ERNEST_CONFIG.baseUrl}/query/stream`);
    
    const response = await fetch(`${ERNEST_CONFIG.baseUrl}/query/stream`, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        query: enrichedQuery,
        mode,
        stream: true,
        include_references: options.includeReferences ?? false,
        conversation_history: options.conversationHistory,
        user_prompt: ERNEST_CONFIG.systemPrompt,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[Ernest] Server fejl:', response.status, response.statusText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';
    let references: Reference[] | undefined;
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data = JSON.parse(line);

          if (data.references) {
            references = data.references;
          }

          if (data.response) {
            fullResponse += data.response;
            onUpdate(fullResponse);
          }

          if (data.error) {
            console.error('[Ernest] Server error i stream:', data.error);
            throw new Error(data.error);
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      try {
        const data = JSON.parse(buffer);
        if (data.response) {
          fullResponse += data.response;
          onUpdate(fullResponse);
        }
      } catch {
        // Ignore incomplete JSON
      }
    }

    // Tjek for tomt svar
    if (!fullResponse || fullResponse.trim() === '') {
      console.warn('[Ernest] Tomt svar modtaget');
      const errorMsg = ERROR_MESSAGES.no_context;
      onUpdate(errorMsg);
      return { response: errorMsg };
    }

    console.log('[Ernest] Svar modtaget, længde:', fullResponse.length);
    return { response: fullResponse, references };
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Log fejlen for debugging
    console.error('[Ernest] Fejl ved streaming:', error);
    
    let errorMsg: string;
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMsg = ERROR_MESSAGES.timeout;
      } else if (error.message.includes('Failed to fetch') || error instanceof TypeError) {
        errorMsg = ERROR_MESSAGES.network;
      } else {
        errorMsg = ERROR_MESSAGES.server_error;
      }
    } else {
      errorMsg = ERROR_MESSAGES.server_error;
    }
    
    onUpdate(errorMsg);
    return { response: errorMsg };
  }
}

/**
 * Konfigurer Ernest
 */
export function configureErnest(config: {
  baseUrl?: string;
  apiKey?: string;
  systemPrompt?: string;
}) {
  if (config.baseUrl) ERNEST_CONFIG.baseUrl = config.baseUrl;
  if (config.apiKey) ERNEST_CONFIG.apiKey = config.apiKey;
  if (config.systemPrompt) ERNEST_CONFIG.systemPrompt = config.systemPrompt;
}

/**
 * Tjek om Ernest-serveren kører
 * Med bedre fejlhåndtering for CORS og netværksproblemer
 */
export async function checkErnestHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sek timeout
    
    const response = await fetch(`${ERNEST_CONFIG.baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      // Undgå CORS preflight ved at bruge simple request
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    // Log fejl for debugging
    console.warn('Ernest health check fejlede:', error);
    
    // Hvis det er en CORS fejl eller netværksfejl, prøv at antage online
    // og lad den faktiske query fejle med bedre fejlbesked
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.info('Mulig CORS-fejl - prøver at fortsætte');
      // Return true så vi prøver at sende query og får bedre fejlbesked
      return true;
    }
    
    return false;
  }
}

// Default export
export default {
  ask: askErnest,
  query: queryErnest,
  stream: streamErnest,
  configure: configureErnest,
  checkHealth: checkErnestHealth,
  ERROR_MESSAGES,
};
