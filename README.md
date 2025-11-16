# 🌟 StandBy Web

Die Web-Version der **StandBy App** – deine All-in-One-Lösung für ein selbstständiges Leben. Budget verwalten, Rezepte finden, Termine planen – alles an einem Ort.

## 📋 Inhaltsverzeichnis

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Voraussetzungen](#-voraussetzungen)
- [Installation](#-installation)
- [Konfiguration](#-konfiguration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Projektstruktur](#-projektstruktur)
- [Migriert von Mobile](#-migriert-von-mobile)

## ✨ Features

### ✅ Vollständig Implementiert

- **Authentifizierung**
  - Login & Registrierung
  - Session-Management mit Supabase
  - Passwort-Reset Flow (E-Mail-basiert)
  - Update Password Page
  - Protected Routes mit Auth Guard

- **Dashboard**
  - Echtzeit-Statistiken (Balance, Rezepte, Events, Favoriten)
  - Paralleles Laden mit Promise.all
  - Quick Navigation zu allen Modulen
  - Responsive Sidebar

- **Budget-Management** 💰
  - Transaktionen (CRUD) mit Kategorien & Icons
  - Einnahmen & Ausgaben Tracking
  - **Charts & Visualisierungen**:
    - Income vs Expenses Bar Chart (letzte 6 Monate)
    - Spending by Category Pie Chart
  - **Sparziele**:
    - Vollständige CRUD-Funktionalität
    - Progress Tracking mit Prozentanzeige
    - Quick Add/Subtract Buttons
    - Zieldatum-Verwaltung
    - Overall Progress Summary
  - Kategorie-System mit 8 Ausgaben & 5 Einnahmen-Kategorien

- **Rezepte** 🍳
  - 300+ deutsche Rezepte (via Seed Data)
  - **Smart Filtering**:
    - Mahlzeitentyp (Frühstück, Mittagessen, Abendessen, Snack)
    - Ernährungsform (Vegetarisch, Vegan, Glutenfrei, Laktosefrei)
    - Schwierigkeit (Einfach, Mittel, Schwer)
    - Max. Zubereitungszeit
    - Max. Kosten pro Portion
  - Favoriten-System (Toggle & View)
  - **Einkaufsliste-Integration**
  - Rezept-Details mit:
    - Schritt-für-Schritt Anleitung
    - Nährwertangaben
    - Zutaten mit Mengen
    - Unsplash-Bilder

- **Einkaufsliste** 🛒
  - Zutaten aus Rezepten hinzufügen
  - Manuelle Items hinzufügen (Name, Menge, Einheit)
  - Check/Uncheck Items
  - Bulk Delete (alle abgehakten)
  - Gruppierung (Unchecked / Checked)

- **Kalender** 📅
  - Event-Management (CRUD)
  - Kategorien (Personal, Work, University, Sport, Social, Other)
  - All-Day Events Support
  - Reminder-System (5min, 15min, 30min, 1h, 1 Tag)
  - Upcoming Events View
  - Monatsansicht

- **Einstellungen** ⚙️
  - **Profil bearbeiten** (Name, Avatar URL)
  - **Theme Switcher** (Hell, Dunkel, System)
  - Zukunft: Benachrichtigungen, Account-Löschen

- **CI/CD & Testing** 🧪
  - GitHub Actions Workflows (CI, Test, Deploy)
  - Vitest für Unit Tests
  - Playwright für E2E Tests
  - Issue & PR Templates
  - Contributing Guide

### 🚧 Geplant für zukünftige Versionen

- Budget-Limits pro Kategorie (Backend fertig)
- Export-Funktionen (CSV/PDF)
- Recurring Calendar Events
- Benachrichtigungs-System
- Mobile Offline-Support (PWA)
- Analytics Dashboard

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 16** (Turbopack) - App Router mit Server Components
- **React 19** - Neueste React-Features
- **TypeScript 5.7** - Strict Mode für Type-Safety

### Styling & UI
- **Tailwind CSS 3.4** - Utility-First CSS Framework
- **shadcn/ui** - High-Quality React Components (Radix UI)
- **Lucide Icons** - Moderne Icon-Bibliothek

### State Management & Data Fetching
- **Zustand** - Lightweight State Management
- **TanStack Query v5** - Server State & Caching
- **React Hook Form + Zod** - Formular-Handling mit Validierung

### Charts & Visualizations
- **Recharts 2.13** - React Charts Library
  - Bar Charts (Einnahmen/Ausgaben)
  - Pie Charts (Kategorien)
  - Responsive & Customizable

### Backend & Database
- **Supabase** - PostgreSQL Database + Auth + Real-time
  - Row Level Security (RLS)
  - Auto-generated APIs
  - Real-time subscriptions
  - Auto-Profile Creation Triggers

### Validierung & Utils
- **Zod** - Schema-Validierung
- **date-fns 3.6** - Datum-Utilities mit i18n (Deutsch)
- **clsx + tailwind-merge** - Class-Namen Management

### Testing & CI/CD
- **Vitest 2.1** - Unit & Integration Tests
- **Playwright 1.48** - E2E Testing
- **Testing Library** - React Component Testing
- **GitHub Actions** - Automated CI/CD Pipeline
- **Husky + lint-staged** - Pre-commit Hooks

### Development Tools
- **ESLint 9** - Code Linting
- **Prettier 3.4** - Code Formatting
- **TypeScript** - Type Checking

## 📦 Voraussetzungen

- **Node.js** >= 18.17.0
- **npm** >= 9.0.0
- **Supabase Account** (kostenlos bei [supabase.com](https://supabase.com))

## 🚀 Installation

### 1. Repository klonen

```bash
# Falls noch nicht geschehen
git clone <your-repo-url>
cd standby-web
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein neues Projekt
2. Navigiere zu **Settings** → **API**
3. Kopiere:
   - `Project URL`
   - `anon/public` API Key

### 4. Datenbank einrichten

#### Option A: Automatisches Setup-Script (empfohlen)

```bash
# Macht das Setup-Script ausführbar (nur einmal nötig)
chmod +x scripts/setup-env.sh

# Führe das Setup-Script aus
./scripts/setup-env.sh
```

Das Script fragt dich nach deinen Supabase-Credentials und erstellt automatisch die `.env.local` Datei.

#### Option B: Manuelle Einrichtung

1. Öffne den **SQL Editor** in Supabase
2. Kopiere den gesamten Inhalt von `supabase/schema.sql`
3. Führe das SQL-Skript aus (RUN oder Ctrl/Cmd + Enter)
4. Optional: Führe `supabase/seed.sql` aus für 10 Beispiel-Rezepte

Das Schema erstellt automatisch:
- ✅ Alle Tabellen (profiles, transactions, budgets, savings_goals, recipes, calendar_events, etc.)
- ✅ Row Level Security (RLS) Policies für Datensicherheit
- ✅ Database Triggers für auto-update timestamps
- ✅ Auto-Profile-Erstellung bei User-Registrierung
- ✅ 10 deutsche Beispiel-Rezepte (via seed.sql)

📖 **Detaillierte Anleitung:** Siehe `supabase/README.md`

## ⚙️ Konfiguration

### Environment Variables

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
cp .env.example .env.local
```

Fülle die Werte aus:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=StandBy
```

## 💻 Development

### Development Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Weitere Befehle

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler
npm run format           # Format with Prettier
npm run format:check     # Check formatting

# Testing
npm test                 # Run all tests (watch mode)
npm run test:unit        # Run unit tests with coverage
npm run test:integration # Run integration tests
npm run test:e2e         # Run E2E tests with Playwright
npm run test:e2e:ui      # Run E2E tests in UI mode
```

## 🌐 Deployment

### Vercel (Empfohlen)

1. Push dein Projekt zu GitHub
2. Importiere das Projekt auf [vercel.com](https://vercel.com)
3. Konfiguriere die Environment Variables
4. Deploy!

```bash
# Oder via Vercel CLI
npm install -g vercel
vercel
```

### Andere Plattformen

Das Projekt kann auf jeder Plattform deployed werden, die Next.js unterstützt:
- Netlify
- Railway
- Render
- AWS Amplify
- Cloudflare Pages

## 📁 Projektstruktur

```
standby-web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth Route Group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # Protected Dashboard Routes
│   │   │   ├── budget/
│   │   │   ├── recipes/
│   │   │   ├── calendar/
│   │   │   └── settings/
│   │   ├── layout.tsx           # Root Layout
│   │   ├── page.tsx             # Landing Page
│   │   └── globals.css          # Global Styles
│   │
│   ├── components/              # React Components
│   │   ├── ui/                  # shadcn/ui Base Components
│   │   ├── auth/                # Auth Components (AuthGuard)
│   │   ├── layout/              # Layout Components (Header, Sidebar)
│   │   ├── budget/              # Budget-spezifische Components
│   │   ├── recipes/             # Recipe-spezifische Components
│   │   ├── calendar/            # Calendar-spezifische Components
│   │   └── providers/           # Context Providers
│   │
│   └── lib/                     # Core Logic
│       ├── services/            # API Services (Supabase)
│       │   ├── supabase.ts
│       │   ├── auth.service.ts
│       │   └── budget.service.ts
│       ├── hooks/               # Custom React Hooks
│       │   └── use-toast.ts
│       ├── store/               # Zustand Stores
│       │   ├── auth.store.ts
│       │   ├── budget.store.ts
│       │   └── theme.store.ts
│       ├── types/               # TypeScript Types
│       │   ├── user.ts
│       │   ├── budget.ts
│       │   ├── recipe.ts
│       │   └── calendar.ts
│       └── utils.ts             # Utility Functions
│
├── supabase/                    # Database Schema & Seeds
│   ├── schema.sql              # Complete database schema with RLS
│   ├── seed.sql                # 10 sample recipes
│   └── README.md               # Database setup guide
│
├── scripts/                     # Utility Scripts
│   └── setup-env.sh            # Interactive environment setup
│
├── public/                      # Static Assets
├── .env.example                 # Environment Variables Template
├── .eslintrc.json              # ESLint Configuration
├── .prettierrc                 # Prettier Configuration
├── next.config.js              # Next.js Configuration
├── tailwind.config.ts          # Tailwind Configuration
├── tsconfig.json               # TypeScript Configuration
├── package.json
└── README.md
```

## 🔄 Migriert von Mobile

Diese Web-Version wurde aus der React Native Mobile-App portiert. Folgendes wurde übernommen:

### Direkt übernommen
- ✅ **Types** - Alle TypeScript-Definitionen
- ✅ **Services** - Supabase-API-Layer (angepasst für Web)
- ✅ **Stores** - Zustand State Management
- ✅ **Utils** - Utility-Funktionen
- ✅ **Business Logic** - Komplette App-Logik

### Angepasst für Web
- 🔄 **Navigation** - React Navigation → Next.js App Router
- 🔄 **Styling** - React Native Paper → shadcn/ui + Tailwind
- 🔄 **Storage** - AsyncStorage → LocalStorage/Cookies
- 🔄 **Charts** - Victory Native → Recharts (geplant)

### Web-spezifische Verbesserungen
- ✨ Server-Side Rendering (SSR)
- ✨ SEO-Optimierung
- ✨ Bessere Performance
- ✨ Responsive Design für alle Bildschirmgrößen

## 🧪 Testing

```bash
# Tests ausführen (wenn implementiert)
npm test

# Mit Coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork das Projekt
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt ist privat und für den persönlichen Gebrauch bestimmt.

## 🆘 Support & Hilfe

Bei Fragen oder Problemen:
1. Prüfe die [Supabase Dokumentation](https://supabase.com/docs)
2. Prüfe die [Next.js Dokumentation](https://nextjs.org/docs)
3. Erstelle ein Issue im Repository

## 🎯 Roadmap

### Phase 1: Core Features (✅ Abgeschlossen)
- [x] Authentifizierung
- [x] Dashboard
- [x] Budget-Übersicht
- [x] Theme System

### Phase 2: Budget-Modul (🚧 In Arbeit)
- [ ] Transaktionen hinzufügen/bearbeiten
- [ ] Sparziele-Management
- [ ] Statistiken mit Charts
- [ ] Budget-Limits

### Phase 3: Rezepte-Modul
- [ ] Rezepte-Browser
- [ ] Filter & Suche
- [ ] Favoriten
- [ ] Einkaufsliste

### Phase 4: Kalender-Modul
- [ ] Event-Management
- [ ] Kalender-Ansichten
- [ ] Erinnerungen
- [ ] Recurring Events

### Phase 5: Polish & Optimierung
- [ ] Performance-Optimierung
- [ ] Tests
- [ ] PWA-Support
- [ ] Analytics

---

**Erstellt mit ❤️ für ein selbstständiges Leben**
