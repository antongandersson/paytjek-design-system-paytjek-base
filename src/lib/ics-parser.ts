/**
 * Simple ICS Parser for frontend demo purposes
 * 
 * Note: In production, this should be done on the backend
 * to avoid CORS issues and for security reasons.
 * 
 * This uses a CORS proxy for demo purposes.
 */

import type { Shift } from "@/components/calendar/CalendarGrid";

// CORS proxy for demo (in production, use your own backend)
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

interface ICSEvent {
  uid: string;
  summary: string;
  dtstart: Date;
  dtend: Date;
  location?: string;
  description?: string;
}

/**
 * Parse ICS date string to JavaScript Date
 * Handles both DATE and DATE-TIME formats
 */
function parseICSDate(dateStr: string): Date {
  // Remove any timezone suffix for simple parsing
  const cleanStr = dateStr.replace(/Z$/, "");
  
  // DATE-TIME format: 20250115T070000
  if (cleanStr.includes("T")) {
    const year = parseInt(cleanStr.substring(0, 4));
    const month = parseInt(cleanStr.substring(4, 6)) - 1;
    const day = parseInt(cleanStr.substring(6, 8));
    const hour = parseInt(cleanStr.substring(9, 11)) || 0;
    const minute = parseInt(cleanStr.substring(11, 13)) || 0;
    const second = parseInt(cleanStr.substring(13, 15)) || 0;
    
    return new Date(year, month, day, hour, minute, second);
  }
  
  // DATE format: 20250115
  const year = parseInt(cleanStr.substring(0, 4));
  const month = parseInt(cleanStr.substring(4, 6)) - 1;
  const day = parseInt(cleanStr.substring(6, 8));
  
  return new Date(year, month, day);
}

/**
 * Unfold ICS content (handle line continuations)
 */
function unfoldICS(content: string): string {
  return content.replace(/\r\n[ \t]/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * Parse ICS content string into events
 */
function parseICSContent(content: string): ICSEvent[] {
  const unfolded = unfoldICS(content);
  const lines = unfolded.split("\n");
  
  const events: ICSEvent[] = [];
  let currentEvent: Partial<ICSEvent> | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === "BEGIN:VEVENT") {
      currentEvent = {};
    } else if (trimmedLine === "END:VEVENT" && currentEvent) {
      if (currentEvent.uid && currentEvent.dtstart && currentEvent.dtend) {
        events.push(currentEvent as ICSEvent);
      } else if (currentEvent.uid && currentEvent.dtstart) {
        // If no end date, assume same day
        currentEvent.dtend = new Date(currentEvent.dtstart);
        currentEvent.dtend.setHours(currentEvent.dtstart.getHours() + 8); // Default 8 hours
        events.push(currentEvent as ICSEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      // Parse property
      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex === -1) continue;
      
      let propName = trimmedLine.substring(0, colonIndex);
      const propValue = trimmedLine.substring(colonIndex + 1);
      
      // Handle properties with parameters (e.g., DTSTART;TZID=Europe/Copenhagen:20250115T070000)
      const semiIndex = propName.indexOf(";");
      if (semiIndex !== -1) {
        propName = propName.substring(0, semiIndex);
      }
      
      switch (propName.toUpperCase()) {
        case "UID":
          currentEvent.uid = propValue;
          break;
        case "SUMMARY":
          currentEvent.summary = propValue.replace(/\\,/g, ",").replace(/\\n/g, "\n");
          break;
        case "DTSTART":
          currentEvent.dtstart = parseICSDate(propValue);
          break;
        case "DTEND":
          currentEvent.dtend = parseICSDate(propValue);
          break;
        case "LOCATION":
          currentEvent.location = propValue.replace(/\\,/g, ",");
          break;
        case "DESCRIPTION":
          currentEvent.description = propValue.replace(/\\n/g, "\n").replace(/\\,/g, ",");
          break;
      }
    }
  }
  
  return events;
}

/**
 * Determine shift type based on start time and summary
 */
function determineShiftType(event: ICSEvent): Shift["type"] {
  const summary = (event.summary || "").toLowerCase();
  
  // Check for special keywords first
  if (
    summary.includes("fri") ||
    summary.includes("ferie") ||
    summary.includes("off") ||
    summary.includes("holiday") ||
    summary.includes("sh-dag") ||
    summary.includes("helligdag") ||
    summary.includes("søgnehelligdag")
  ) {
    return "day-off";
  }
  if (summary.includes("syg") || summary.includes("sick")) {
    return "sick";
  }
  if (summary.includes("møde") || summary.includes("meeting")) {
    return "meeting";
  }
  
  // Determine by time
  const hour = event.dtstart.getHours();
  
  if (hour >= 6 && hour < 14) {
    return "day";
  } else if (hour >= 14 && hour < 22) {
    return "evening";
  } else {
    return "night";
  }
}

/**
 * Get default label for shift type
 */
function getDefaultLabel(type: Shift["type"]): string {
  const labels: Record<Shift["type"], string> = {
    "day": "Dagvagt",
    "evening": "Aftenvagt",
    "night": "Nattevagt",
    "day-off": "Fridag",
    "meeting": "Møde",
    "sick": "Sygdom",
  };
  return labels[type];
}

/**
 * Format time string from dates
 */
function formatTimeRange(start: Date, end: Date): string {
  const formatTime = (d: Date) => 
    `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  
  return `${formatTime(start)}-${formatTime(end)}`;
}

/**
 * Calculate hours between two dates
 */
function calculateHours(start: Date, end: Date): number {
  const diffMs = end.getTime() - start.getTime();
  const hours = diffMs / (1000 * 60 * 60);
  return Math.round(hours * 10) / 10; // Round to 1 decimal
}

/**
 * Convert ICS events to Shift objects
 */
function eventsToShifts(events: ICSEvent[]): Shift[] {
  return events.map((event, index) => {
    const type = determineShiftType(event);
    const hours = calculateHours(event.dtstart, event.dtend);
    
    return {
      id: event.uid || `shift-${index}`,
      date: event.dtstart,
      type,
      label: event.summary || getDefaultLabel(type),
      time: formatTimeRange(event.dtstart, event.dtend),
      hours: hours > 0 ? hours : undefined,
    };
  });
}

/**
 * Parse ICS content string directly
 * 
 * @param content - The ICS file content as string
 * @returns Shift[] - Array of parsed shifts
 */
export function parseICSString(content: string): Shift[] {
  // Validate it's actually ICS content
  if (!content.includes("BEGIN:VCALENDAR")) {
    throw new Error("Ugyldig ICS fil: Mangler VCALENDAR");
  }
  
  // Parse the ICS content
  const events = parseICSContent(content);
  
  if (events.length === 0) {
    throw new Error("Ingen begivenheder fundet i kalenderen");
  }
  
  // Convert to shifts
  const shifts = eventsToShifts(events);
  
  // Sort by date
  shifts.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return shifts;
}

/**
 * Parse ICS from a File object
 * 
 * @param file - The ICS file
 * @returns Promise<Shift[]> - Array of parsed shifts
 */
export async function parseICSFile(file: File): Promise<Shift[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const shifts = parseICSString(content);
        resolve(shifts);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Kunne ikke læse filen"));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Fetch and parse ICS from URL
 * 
 * @param icsUrl - The ICS calendar URL
 * @returns Promise<Shift[]> - Array of parsed shifts
 */
export async function fetchAndParseICS(icsUrl: string): Promise<Shift[]> {
  // Try direct fetch first (works if CORS is enabled on the server)
  let content: string;
  
  try {
    // First try direct fetch
    const directResponse = await fetch(icsUrl);
    if (directResponse.ok) {
      content = await directResponse.text();
    } else {
      throw new Error("Direct fetch failed");
    }
  } catch {
    // Fall back to CORS proxy for demo
    console.log("Direct fetch failed, trying CORS proxy...");
    
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(icsUrl)}`;
    const proxyResponse = await fetch(proxyUrl);
    
    if (!proxyResponse.ok) {
      throw new Error(`Kunne ikke hente kalender: ${proxyResponse.statusText}`);
    }
    
    content = await proxyResponse.text();
  }
  
  return parseICSString(content);
}

/**
 * Validate ICS URL format
 */
export function validateICSUrl(url: string): { valid: boolean; error?: string } {
  if (!url.trim()) {
    return { valid: false, error: "URL er påkrævet" };
  }
  
  try {
    const parsed = new URL(url);
    
    // Allow webcal:// protocol (convert to https)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:" && parsed.protocol !== "webcal:") {
      return { valid: false, error: "Ugyldig URL protokol" };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: "Ugyldig URL format" };
  }
}

/**
 * Normalize ICS URL (convert webcal:// to https://)
 */
export function normalizeICSUrl(url: string): string {
  return url.replace(/^webcal:\/\//i, "https://");
}

