/**
 * ============================================
 * BACKEND ENDPOINT EXAMPLE: Calendar Sync
 * ============================================
 * 
 * This is an example of how to implement the /api/calendar/sync endpoint
 * that parses ICS/iCal files and returns shifts.
 * 
 * You can use this with:
 * - Express.js
 * - Hono
 * - Next.js API Routes
 * - Any Node.js framework
 * 
 * Required packages:
 * - ical.js (npm install ical.js)
 * - or node-ical (npm install node-ical)
 */

// ============================================
// Types
// ============================================

interface Shift {
  id: string;
  date: string; // ISO date string
  type: "day" | "evening" | "night" | "day-off" | "meeting" | "sick";
  label: string;
  time?: string;
  hours?: number;
  location?: string;
  notes?: string;
}

interface CalendarSyncRequest {
  source: "ics" | "google" | "optima";
  icsUrl?: string;
}

interface CalendarSyncResponse {
  connection: {
    id: string;
    userId: string;
    source: string;
    icsUrl?: string;
    isActive: boolean;
    lastSynced: string;
    createdAt: string;
  };
  shifts: Shift[];
  syncedCount: number;
}

// ============================================
// ICS Parser Utility
// ============================================

/**
 * Parse ICS file content and extract events as shifts
 * 
 * Using ical.js library (recommended):
 * npm install ical.js @types/ical.js
 */
async function parseIcsFromUrl(icsUrl: string): Promise<Shift[]> {
  // Fetch the ICS file
  const response = await fetch(icsUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ICS file: ${response.statusText}`);
  }
  
  const icsContent = await response.text();
  
  // Using ical.js to parse
  // @ts-ignore - ical.js types
  const ICAL = await import('ical.js');
  
  const jcalData = ICAL.parse(icsContent);
  const vcalendar = new ICAL.Component(jcalData);
  const vevents = vcalendar.getAllSubcomponents('vevent');
  
  const shifts: Shift[] = [];
  
  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);
    
    const startDate = event.startDate.toJSDate();
    const endDate = event.endDate.toJSDate();
    
    // Calculate hours
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    // Determine shift type based on start time
    const startHour = startDate.getHours();
    let type: Shift["type"] = "day";
    
    if (startHour >= 6 && startHour < 14) {
      type = "day";
    } else if (startHour >= 14 && startHour < 22) {
      type = "evening";
    } else {
      type = "night";
    }
    
    // Check for special event types in summary/description
    const summary = event.summary?.toLowerCase() || "";
    const description = event.description?.toLowerCase() || "";
    
    if (summary.includes("fri") || summary.includes("off") || summary.includes("ferie")) {
      type = "day-off";
    } else if (summary.includes("syg") || summary.includes("sick")) {
      type = "sick";
    } else if (summary.includes("møde") || summary.includes("meeting")) {
      type = "meeting";
    }
    
    // Format time string
    const formatTime = (date: Date) => 
      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    const time = `${formatTime(startDate)}-${formatTime(endDate)}`;
    
    shifts.push({
      id: event.uid || crypto.randomUUID(),
      date: startDate.toISOString(),
      type,
      label: event.summary || getDefaultLabel(type),
      time,
      hours: Math.round(hours * 10) / 10, // Round to 1 decimal
      location: event.location || undefined,
      notes: event.description || undefined,
    });
  }
  
  return shifts;
}

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

// ============================================
// Alternative: Using node-ical (simpler API)
// ============================================

/**
 * Alternative parser using node-ical
 * npm install node-ical
 */
async function parseIcsWithNodeIcal(icsUrl: string): Promise<Shift[]> {
  // @ts-ignore
  const ical = await import('node-ical');
  
  const events = await ical.async.fromURL(icsUrl);
  const shifts: Shift[] = [];
  
  for (const [key, event] of Object.entries(events)) {
    // @ts-ignore
    if (event.type !== 'VEVENT') continue;
    
    // @ts-ignore
    const startDate = new Date(event.start);
    // @ts-ignore
    const endDate = new Date(event.end);
    
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const startHour = startDate.getHours();
    
    let type: Shift["type"] = "day";
    if (startHour >= 14 && startHour < 22) type = "evening";
    else if (startHour >= 22 || startHour < 6) type = "night";
    
    // @ts-ignore
    const summary = (event.summary || "").toLowerCase();
    if (summary.includes("fri") || summary.includes("ferie")) type = "day-off";
    else if (summary.includes("syg")) type = "sick";
    
    const formatTime = (d: Date) => 
      `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    
    shifts.push({
      id: key,
      date: startDate.toISOString(),
      type,
      // @ts-ignore
      label: event.summary || getDefaultLabel(type),
      time: `${formatTime(startDate)}-${formatTime(endDate)}`,
      hours: Math.round(hours * 10) / 10,
      // @ts-ignore
      location: event.location,
      // @ts-ignore
      notes: event.description,
    });
  }
  
  return shifts;
}

// ============================================
// Express.js Endpoint Example
// ============================================

/**
 * POST /api/calendar/sync
 * 
 * Request body:
 * {
 *   "source": "ics",
 *   "icsUrl": "https://example.com/calendar.ics"
 * }
 */
// app.post('/api/calendar/sync', async (req, res) => {
async function handleCalendarSync(
  req: { body: CalendarSyncRequest; userId: string },
  res: { json: (data: any) => void; status: (code: number) => any }
) {
  try {
    const { source, icsUrl } = req.body;
    const userId = req.userId; // From auth middleware
    
    if (source === 'ics') {
      if (!icsUrl) {
        return res.status(400).json({
          success: false,
          error: { code: 'MISSING_URL', message: 'ICS URL is required' }
        });
      }
      
      // Validate URL format
      try {
        new URL(icsUrl);
      } catch {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_URL', message: 'Invalid URL format' }
        });
      }
      
      // Parse the ICS file
      const shifts = await parseIcsFromUrl(icsUrl);
      
      // Save connection to database
      const connection = await saveCalendarConnection({
        userId,
        source: 'ics',
        icsUrl,
        isActive: true,
        lastSynced: new Date().toISOString(),
      });
      
      // Save shifts to database
      await saveShifts(userId, shifts);
      
      return res.json({
        success: true,
        data: {
          connection,
          shifts,
          syncedCount: shifts.length,
        }
      });
    }
    
    // Handle other sources (Google, Optima)
    if (source === 'google') {
      // Implement Google Calendar OAuth flow
      // ...
    }
    
    if (source === 'optima') {
      // Implement Optima API integration
      // ...
    }
    
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_SOURCE', message: 'Invalid calendar source' }
    });
    
  } catch (error) {
    console.error('Calendar sync error:', error);
    return res.status(500).json({
      success: false,
      error: { 
        code: 'SYNC_FAILED', 
        message: error instanceof Error ? error.message : 'Failed to sync calendar' 
      }
    });
  }
}

// ============================================
// Database helpers (implement based on your DB)
// ============================================

async function saveCalendarConnection(data: any) {
  // Example with Prisma:
  // return prisma.calendarConnection.upsert({
  //   where: { userId: data.userId },
  //   update: data,
  //   create: { id: crypto.randomUUID(), ...data, createdAt: new Date() },
  // });
  
  return {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
}

async function saveShifts(userId: string, shifts: Shift[]) {
  // Example with Prisma:
  // await prisma.shift.deleteMany({ where: { userId } });
  // await prisma.shift.createMany({ data: shifts.map(s => ({ ...s, userId })) });
  
  console.log(`Saved ${shifts.length} shifts for user ${userId}`);
}

// ============================================
// Hono Example
// ============================================

/*
import { Hono } from 'hono';

const app = new Hono();

app.post('/api/calendar/sync', async (c) => {
  const body = await c.req.json<CalendarSyncRequest>();
  const userId = c.get('userId'); // From auth middleware
  
  // Same logic as above...
});
*/

// ============================================
// Next.js API Route Example
// ============================================

/*
// app/api/calendar/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = // Get from session
  
  // Same logic as above...
  
  return NextResponse.json({ success: true, data: { ... } });
}
*/

export { parseIcsFromUrl, parseIcsWithNodeIcal, handleCalendarSync };



