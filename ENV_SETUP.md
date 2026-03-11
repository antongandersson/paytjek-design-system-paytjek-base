# Environment Variables Setup

## Ernest AI Chatbot

For at aktivere Ernest chatbot'en i production skal følgende miljøvariabler sættes:

### Vercel Environment Variables

Gå til [vercel.com](https://vercel.com) → Dit projekt → **Settings** → **Environment Variables**

Tilføj følgende:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `VITE_LIGHTRAG_URL` | `https://ernst-production.up.railway.app` | Production, Preview, Development |
| `VITE_LIGHTRAG_API_KEY` | *(valgfri - hvis du tilføjer authentication)* | Production, Preview, Development |

### Lokal udvikling

Opret en `.env.local` fil i projekt-roden:

```bash
# Ernest AI Backend (Railway)
VITE_LIGHTRAG_URL=https://ernst-production.up.railway.app

# Eller brug lokal Ernest hvis du udvikler:
# VITE_LIGHTRAG_URL=http://localhost:8093

# Optional API key
# VITE_LIGHTRAG_API_KEY=your-key-here
```

## Efter opsætning

1. **Vercel**: Redeploy projektet efter at have tilføjet environment variables
2. **Lokal**: Genstart development serveren (`bun run dev`)

## Sådan tester du at det virker

1. Gå til din deployed site på Vercel
2. Åbn appen
3. Klik på Ernest chatbot-knappen (nederst til højre)
4. Stil et spørgsmål som "Hvad er aftentillæg?"
5. Ernest skulle nu svare med information fra FOA overenskomsterne
