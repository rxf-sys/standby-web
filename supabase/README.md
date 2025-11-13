# Supabase Database Setup

Diese Anleitung hilft dir, die Supabase-Datenbank für StandBy einzurichten.

## 📋 Voraussetzungen

- Ein Supabase-Account (kostenlos: [supabase.com](https://supabase.com))
- Node.js >= 18.17.0

## 🚀 Quick Start

### 1. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und melde dich an
2. Klicke auf "New Project"
3. Wähle einen Projektnamen (z.B. "standby-web")
4. Wähle ein starkes Passwort für die Datenbank
5. Wähle eine Region (z.B. "Frankfurt" für Deutschland)
6. Klicke auf "Create new project"

### 2. Environment Variables einrichten

1. In deinem Supabase-Projekt: **Settings** → **API**
2. Kopiere folgende Werte:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (API Key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Erstelle eine `.env.local` Datei im Root des Projekts:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://deinprojekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key-hier
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=StandBy
```

### 3. Datenbank-Schema anwenden

1. In deinem Supabase-Projekt: **SQL Editor**
2. Klicke auf "New query"
3. Öffne die Datei `supabase/schema.sql` in einem Texteditor
4. Kopiere den **gesamten Inhalt** und füge ihn in den SQL Editor ein
5. Klicke auf **RUN** (oder drücke `Ctrl/Cmd + Enter`)
6. Warte, bis die Abfrage erfolgreich ausgeführt wurde ✅

### 4. Seed-Daten laden (Optional, aber empfohlen)

1. Öffne erneut den **SQL Editor**
2. Klicke auf "New query"
3. Öffne die Datei `supabase/seed.sql`
4. Kopiere den **gesamten Inhalt** und füge ihn ein
5. Klicke auf **RUN**
6. Jetzt hast du 10 Beispiel-Rezepte in der Datenbank! 🎉

### 5. Authentifizierung konfigurieren

1. In Supabase: **Authentication** → **Providers**
2. Aktiviere **Email** Provider (sollte standardmäßig aktiv sein)
3. Optional: Aktiviere andere Providers (Google, GitHub, etc.)

### 6. Email Templates anpassen (Optional)

1. Gehe zu **Authentication** → **Email Templates**
2. Passe die Templates nach deinen Wünschen an (z.B. auf Deutsch)

## 📊 Erstellte Tabellen

Das Schema erstellt folgende Tabellen:

| Tabelle | Beschreibung |
|---------|--------------|
| `profiles` | Nutzerprofile (erweitert `auth.users`) |
| `user_preferences` | Theme, Sprache, Währung, Benachrichtigungen |
| `transactions` | Einnahmen und Ausgaben |
| `budgets` | Budget-Limits pro Kategorie |
| `savings_goals` | Sparziele |
| `recipes` | Rezepte (mit Zutaten, Anleitung, Nährwerten) |
| `user_favorite_recipes` | Favoriten-Rezepte pro Nutzer |
| `shopping_list_items` | Einkaufsliste |
| `calendar_events` | Kalender-Events |

## 🔒 Row Level Security (RLS)

Alle Tabellen haben Row Level Security (RLS) aktiviert:

- ✅ Nutzer können **nur ihre eigenen Daten** sehen und bearbeiten
- ✅ Rezepte sind **öffentlich lesbar** (für alle authentifizierten Nutzer)
- ✅ Automatische Profile-Erstellung bei Registrierung
- ✅ `updated_at` Felder werden automatisch aktualisiert

## 🧪 Datenbank testen

Nachdem du das Schema angewendet hast, kannst du es testen:

1. Starte die Entwicklungsumgebung: `npm run dev`
2. Öffne http://localhost:3000
3. Registriere einen neuen Account
4. Schaue in Supabase unter **Table Editor** → **profiles**
5. Dein Profil sollte automatisch erstellt worden sein! ✨

## 🔧 Troubleshooting

### "relation already exists"
- Das Schema wurde bereits angewendet
- Lösung: Du kannst die Tabellen in Supabase löschen und erneut erstellen

### "permission denied"
- RLS Policies blockieren den Zugriff
- Lösung: Stelle sicher, dass du eingeloggt bist

### "column does not exist"
- Veraltete TypeScript-Typen
- Lösung: Schema neu anwenden oder Typen aktualisieren

## 📚 Weiterführende Links

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## 🎯 Nächste Schritte

Nach der Datenbank-Einrichtung kannst du:

1. **Budget-Modul testen** - Transaktionen hinzufügen und anzeigen
2. **Rezepte durchstöbern** - Die 10 Seed-Rezepte ansehen
3. **Kalender-Events erstellen** - Events planen und verwalten
4. **Weitere Features implementieren** - Charts, Export, etc.

Viel Erfolg! 🚀
