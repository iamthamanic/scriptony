# 🧠 CONTRIBUTING.md – Entwicklungsrichtlinien für Scriptony

Willkommen im Code von **Scriptony**!

Damit der Code dauerhaft sauber, modular und skalierbar bleibt – egal ob durch Menschen oder KI (z. B. Lovable) entwickelt – gelten folgende verbindliche Regeln für alle Beiträge und neuen Features.

---

## 📁 Projektstruktur (Feature-Driven Development – FDD)

Alle neuen Features werden unter `src/features/[featureName]/` angelegt.

Jedes Feature-Modul besteht aus folgender Struktur:

src/features/[featureName]/
├── components/ → UI-Komponenten (ohne Logik!)
├── hooks/ → Lokale Zustandshooks, UI-Logik, Modalfunktionen etc.
├── services/ → Supabase, GPT, API, externe Funktionen
├── store.ts → Zustand für das Feature (z. B. Zustand, Jotai)
├── types.ts → (Optional) Eigene Typdefinitionen
└── index.tsx → Einstiegspunkt für das Feature

markdown
Kopieren
Bearbeiten

**Beispiele für Feature-Namen:**
- `creativeGym/`
- `scriptEditor/`
- `adminSystem/`
- `uploadSystem/`

---

## 🧱 Komponentenrichtlinien

- Wiederverwendbare UI-Komponenten gehören in `src/components/`
- Feature-spezifische Komponenten gehören in `features/[feature]/components/`
- **Keine API-Aufrufe oder Zustand in UI-Komponenten!**
- Komponenten sollten nur eine Aufgabe erfüllen

---

## ✍️ Codequalität

- TypeScript läuft im `strict` Mode
- ESLint muss fehlerfrei durchlaufen (`npm run lint`)
- Prettier sorgt für konsistente Formatierung (`npm run format`)

🚫 Verboten:
```tsx
onClick={() => { doStuff(); }}
✅ Erlaubt:

tsx
Kopieren
Bearbeiten
onClick={handleClick}
✅ Automatische Checks & Tools
Prettier: automatisches Formatieren

ESLint: statische Analyse

Pre-commit Hooks: z. B. via Husky

CI Check: Alle Pull Requests durchlaufen Lint + TS Check
