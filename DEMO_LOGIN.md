# 🔒 PayTjek Demo Login Guide (INTERNT)

⚠️ **FORTROLIGT DOKUMENT - KUN TIL INTERNT BRUG**

Dette dokument indeholder login credentials til demo versionen af PayTjek.
Del kun med autoriserede personer (team members, udvalgte kunder).

## 🔐 Login Credentials

**Demo login:**
```
Email:    sara@demo.dk
Password: demo1234
```

⚠️ **Disse credentials skal IKKE deles offentligt eller committes til offentlige repositories.**

## 📱 Sådan logger du ind

### Web Version
1. Gå til https://paytjek-design-system.vercel.app/app/auth?mode=login
2. Indtast email: `sara@demo.dk`
3. Indtast password: `demo1234`
4. Klik "Log ind"

### Mobile Version
1. Gå til https://paytjek-design-system.vercel.app/m/auth?mode=login
2. Indtast email: `sara@demo.dk`
3. Indtast password: `demo1234`
4. Klik "Log ind"

## ⚠️ Vigtig Information

**Kun email/password login er aktiveret:**
- ❌ Social Login (Google/Apple) er **deaktiveret**
- ❌ Face ID / Biometrics er **deaktiveret**
- ❌ Kontooprettelse (Signup) er **deaktiveret**
- ✅ Kun eksisterende demo credentials virker

Dette er for at beskytte Ernest chatbotten og andre funktioner mod uautoriseret adgang.

## 👤 Demo Bruger Information

Demo brugeren "Emil Hansen" har:
- **Stilling:** Warehouse Assistant
- **Arbejdsgiver:** Coolshop A/S
- **Fagforening:** HK Privat og HK HANDEL
- **Demo lønsedler:** Tilgængelig for upload (okt 2025 med fejl, dec 2025 med advarsel)

## 🚪 Log Ud

For at logge ud:
1. Gå til "Mere" i navigation
2. Vælg "Indstillinger"
3. Klik på "Log ud" knappen

## 🔒 Sikkerhed

Dette er en **BESKYTTET DEMO version**:
- ✅ Login er **påkrævet** for at tilgå appen
- ✅ Kun **hardcoded credentials** virker (`kim@demo.dk` / `demo1234`)
- ✅ Ernest chatbot er **fuldt beskyttet** bag login
- ✅ Social login og signup er **deaktiveret**
- ✅ Session gemmes i browser localStorage
- ⚠️ Ingen reel backend authentication (kun client-side validering)
- ⚠️ Ingen database - alt er mock data
- ⚠️ Til demonstrations- og præsentationsformål

**Beskyttelse:**
- Folk kan ikke bare tilgå Ernest chatbotten gratis
- Kun autoriserede demo brugere med credentials kan logge ind
- Alle andre login metoder er deaktiveret

## 💡 For Udviklere

Demo auth systemet er implementeret i:
- `src/lib/demoAuth.ts` - Login/logout funktioner
- `src/components/auth/ProtectedRoute.tsx` - Route beskyttelse
- `src/components/auth/LoginForm.tsx` - Login UI
- `src/App.tsx` - Protected routes setup

For at ændre login credentials, rediger `DEMO_CREDENTIALS` i `src/lib/demoAuth.ts`.

## 🎯 Præsentationstips

Ved kunde demos:
1. **Start på login skærmen** - vis den professionelle login flow
2. **Demonstrer forskellige login metoder** (email, social, biometrics)
3. **Vis lønseddel analyse** - upload en demo PDF
4. **Interager med Ernest** - stil spørgsmål om løn og overenskomst
5. **Log ud til sidst** - klar til næste demo

---

**Version:** Demo v1.0  
**Sidste opdateret:** Januar 2026
