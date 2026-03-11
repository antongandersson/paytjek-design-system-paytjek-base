# PayTjek API Integration Guide

## Calendar Sync - ICS Integration

### Frontend Flow

```
┌──────────────┐    ┌────────────────┐    ┌────────────────┐
│   User UI    │───▶│  Frontend API  │───▶│  Backend API   │
│              │    │    Client      │    │                │
│  1. Enter    │    │                │    │ 2. Fetch ICS   │
│     ICS URL  │    │  POST /api/    │    │    from URL    │
│              │    │  calendar/sync │    │                │
│              │    │                │    │ 3. Parse ICS   │
│              │    │  {             │    │    events      │
│              │    │    source:ics  │    │                │
│              │    │    icsUrl:...  │    │ 4. Convert to  │
│              │    │  }             │    │    Shifts      │
│              │    │                │    │                │
│  5. Show     │◀───│  Response:     │◀───│ 5. Save to DB  │
│     Calendar │    │  { shifts }    │    │    & return    │
└──────────────┘    └────────────────┘    └────────────────┘
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/calendar/sync` | POST | Sync calendar from ICS URL |
| `/api/calendar/connection` | GET | Get current connection status |
| `/api/calendar/disconnect` | DELETE | Remove calendar connection |
| `/api/calendar/shifts` | GET | Get all shifts |
| `/api/calendar/shifts?year=2025&month=1` | GET | Get shifts for month |
| `/api/calendar/stats` | GET | Get monthly statistics |
| `/api/calendar/resync` | POST | Force re-fetch from ICS |

### Request/Response Examples

#### Sync Calendar

**Request:**
```json
POST /api/calendar/sync
{
  "source": "ics",
  "icsUrl": "https://planday.com/export/abc123.ics"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "connection": {
      "id": "conn_123",
      "userId": "user_456",
      "source": "ics",
      "icsUrl": "https://planday.com/export/abc123.ics",
      "isActive": true,
      "lastSynced": "2025-01-06T10:30:00Z",
      "createdAt": "2025-01-06T10:30:00Z"
    },
    "shifts": [
      {
        "id": "shift_1",
        "date": "2025-01-07T07:00:00Z",
        "type": "day",
        "label": "Dagvagt",
        "time": "07:00-15:00",
        "hours": 8,
        "location": "Netto, Østerbro"
      },
      {
        "id": "shift_2",
        "date": "2025-01-08T15:00:00Z",
        "type": "evening",
        "label": "Aftenvagt",
        "time": "15:00-23:00",
        "hours": 8
      }
    ],
    "syncedCount": 2
  }
}
```

### Frontend Integration

```tsx
// In your Calendar component
import { useSyncCalendar, useAllShifts, useCalendarConnection } from '@/hooks/useCalendar';

function CalendarPage() {
  const { data: connection, isLoading: loadingConnection } = useCalendarConnection();
  const { data: shifts, isLoading: loadingShifts } = useAllShifts();
  const syncMutation = useSyncCalendar();

  const handleConnect = async (source: string, icsUrl?: string) => {
    try {
      await syncMutation.mutateAsync({ source, icsUrl });
      toast.success('Kalender synkroniseret!');
    } catch (error) {
      toast.error('Kunne ikke synkronisere kalender');
    }
  };

  const isConnected = !!connection?.isActive;

  return (
    <MobileCalendar
      isConnected={isConnected}
      isConnecting={syncMutation.isPending}
      shifts={shifts}
      isLoadingShifts={loadingShifts}
      onConnect={handleConnect}
    />
  );
}
```

### Backend Implementation Options

#### Option 1: Node.js with ical.js
```bash
npm install ical.js
```

#### Option 2: Node.js with node-ical (simpler)
```bash
npm install node-ical
```

#### Option 3: Python with icalendar
```bash
pip install icalendar requests
```

```python
from icalendar import Calendar
import requests

def parse_ics(url):
    response = requests.get(url)
    cal = Calendar.from_ical(response.text)
    
    shifts = []
    for event in cal.walk('VEVENT'):
        start = event.get('dtstart').dt
        end = event.get('dtend').dt
        
        shifts.append({
            'id': str(event.get('uid')),
            'date': start.isoformat(),
            'label': str(event.get('summary', '')),
            'time': f"{start.strftime('%H:%M')}-{end.strftime('%H:%M')}",
            'hours': (end - start).seconds / 3600,
        })
    
    return shifts
```

### Shift Type Detection

The backend should automatically detect shift types based on:

| Start Time | Type | Danish Label |
|------------|------|--------------|
| 06:00-13:59 | `day` | Dagvagt |
| 14:00-21:59 | `evening` | Aftenvagt |
| 22:00-05:59 | `night` | Nattevagt |

**Special cases (check event summary/description):**
- Contains "fri", "ferie", "off" → `day-off` (Fridag)
- Contains "syg", "sick" → `sick` (Sygdom)
- Contains "møde", "meeting" → `meeting` (Møde)

### Environment Variables

```env
# Frontend (.env)
VITE_API_URL=https://api.paytjek.dk

# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

### Error Handling

```json
// Error response format
{
  "success": false,
  "error": {
    "code": "INVALID_ICS_URL",
    "message": "The provided URL is not a valid ICS calendar"
  }
}
```

| Error Code | Description |
|------------|-------------|
| `MISSING_URL` | ICS URL not provided |
| `INVALID_URL` | URL format is invalid |
| `FETCH_FAILED` | Could not fetch ICS file |
| `PARSE_FAILED` | Could not parse ICS content |
| `INVALID_SOURCE` | Unknown calendar source |
| `UNAUTHORIZED` | User not authenticated |

### Automatic Re-sync

For production, consider setting up automatic re-sync:

```typescript
// Cron job every 6 hours
cron.schedule('0 */6 * * *', async () => {
  const connections = await db.calendarConnection.findMany({
    where: { isActive: true, source: 'ics' }
  });
  
  for (const conn of connections) {
    try {
      const shifts = await parseIcsFromUrl(conn.icsUrl);
      await saveShifts(conn.userId, shifts);
      await db.calendarConnection.update({
        where: { id: conn.id },
        data: { lastSynced: new Date() }
      });
    } catch (error) {
      console.error(`Failed to sync for user ${conn.userId}:`, error);
    }
  }
});
```



