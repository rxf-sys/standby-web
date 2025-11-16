# Contributing to StandBy Web

Vielen Dank für dein Interesse, zu StandBy beizutragen! 🎉

## 📋 Code of Conduct

Bitte lies und befolge unseren [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Wie kann ich beitragen?

### Bugs melden

Wenn du einen Bug findest:

1. Prüfe, ob der Bug bereits gemeldet wurde
2. Erstelle ein [Bug Report Issue](https://github.com/rxf-sys/standby-web/issues/new?template=bug_report.md)
3. Füge so viele Details wie möglich hinzu

### Features vorschlagen

Hast du eine Idee für ein neues Feature?

1. Erstelle ein [Feature Request Issue](https://github.com/rxf-sys/standby-web/issues/new?template=feature_request.md)
2. Beschreibe das Problem, das es lösen würde
3. Erkläre, wie es funktionieren sollte

### Code beitragen

#### Setup

```bash
# Repository forken und klonen
git clone https://github.com/DEIN-USERNAME/standby-web.git
cd standby-web

# Dependencies installieren
npm install

# Supabase konfigurieren
cp .env.example .env.local
# Füge deine Supabase Credentials ein

# Development Server starten
npm run dev
```

#### Entwicklungsprozess

1. **Branch erstellen**
   ```bash
   git checkout -b feature/mein-neues-feature
   # oder
   git checkout -b fix/bug-fix
   ```

2. **Code schreiben**
   - Folge unserem Code Style
   - Schreibe Tests für neue Features
   - Update die Dokumentation

3. **Tests ausführen**
   ```bash
   npm run lint        # Linting
   npm run type-check  # Type Checking
   npm test            # Tests
   npm run build       # Build Test
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: beschreibung des features"
   ```

   Commit Message Format:
   - `feat:` Neues Feature
   - `fix:` Bug Fix
   - `docs:` Dokumentation
   - `style:` Formatierung
   - `refactor:` Code Refactoring
   - `test:` Tests
   - `chore:` Build/Config Änderungen

5. **Pull Request erstellen**
   - Pushe deinen Branch
   - Erstelle einen PR auf GitHub
   - Fülle das PR Template aus
   - Warte auf Review

## 🎨 Code Style

- **TypeScript:** Strict Mode aktiviert
- **Formatting:** Prettier (automatisch bei Commit)
- **Linting:** ESLint
- **Components:** Funktionale React Components mit Hooks
- **Styling:** Tailwind CSS + shadcn/ui

## 🧪 Tests

- **Unit Tests:** Vitest
- **Integration Tests:** Vitest + Testing Library
- **E2E Tests:** Playwright

Alle neuen Features sollten Tests haben!

```bash
# Alle Tests
npm test

# Unit Tests
npm run test:unit

# Integration Tests
npm run test:integration

# E2E Tests
npm run test:e2e
```

## 📁 Projektstruktur

```
src/
├── app/              # Next.js App Router Pages
├── components/       # React Components
│   ├── ui/          # UI Components (shadcn/ui)
│   ├── budget/      # Budget Module Components
│   ├── recipes/     # Recipe Module Components
│   └── calendar/    # Calendar Module Components
├── lib/
│   ├── services/    # API Services
│   ├── store/       # Zustand State Management
│   ├── types/       # TypeScript Types
│   ├── utils/       # Utility Functions
│   ├── validations/ # Zod Schemas
│   └── constants/   # Constants
└── __tests__/       # Tests
```

## 🔒 Security

Bitte melde Sicherheitslücken **nicht** über öffentliche Issues. Sende stattdessen eine E-Mail an security@standby.app.

## 📝 Lizenz

Durch das Beitragen zu StandBy stimmst du zu, dass deine Beiträge unter der MIT Lizenz lizenziert werden.

## 💬 Fragen?

Bei Fragen kannst du:
- Ein Issue öffnen
- Eine Discussion starten
- Uns kontaktieren

Vielen Dank für deinen Beitrag! 🙏
