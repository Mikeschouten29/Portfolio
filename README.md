# Portfolio: Mike Schouten

Een persoonlijke portfolio-website over sport, AI en data, gemaakt voor de minor **Future-proof met AI!**.
Gebouwd met React, TypeScript, Vite, Tailwind CSS, Lucide-iconen en Motion. Alle gegevens zijn in de site zelf te bewerken en worden opgeslagen in LocalStorage.

## Starten

```bash
npm install
npm run dev
```

Open daarna http://localhost:5173.

| Script            | Wat het doet                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Ontwikkelserver met hot reload            |
| `npm run lint`    | ESLint-controle                           |
| `npm run build`   | TypeScript-check + productiebuild (`dist/`) |
| `npm run preview` | Productiebuild lokaal bekijken            |

## Functies

- **Home**: naam, introductie, profiel, opleiding, minor, bio, talenten, passies, toekomstdoelen en contact (e-mail, telefoon, LinkedIn)
- **Prompt Library**: prompts met categorie, leeruitkomsten, rol, context, taak, output, AI-tools en tags. Met zoeken, filters en een kopieerknop
- **Show & Grow**: een presentatie per sprint (titeldia, één dia per story met "wat ik heb geleerd" en de criteria, en een afsluitdia met reflectie, feedback en volgende stappen). Bladeren met de pijltjestoetsen, met optie voor volledig scherm
- **Onderzoek Sportmarketing**: onderzoeksvraag, deelvragen, methode, bronnen, resultaten en inzichten
- **Roadmap**: doelen en projecten met planning, voortgang en prioriteit
- **Sprints**: acht sprints met user stories, acceptatiecriteria, feedback, zelfevaluatie, LU1 tot en met LU5, reflectie, Show & Grow en bewijslinks
- **Tijdlijn**: alle sprints op een tijdlijn
- **Dashboard**: voortgang per leeruitkomst en per sprint, plus een matrix van sprint × leeruitkomst

### Licht en donker

Met de zon/maan-knop in de header wissel je tussen de lichte en donkere modus. De keuze wordt onthouden. Bij een eerste bezoek volgt de site de instelling van je apparaat. De kleuren per modus staan in `src/index.css` (`@theme` voor donker, `:root[data-theme='light']` voor licht).

### Bewerken en opslaan

1. Klik rechtsboven op **Bewerken**. Alle teksten worden invulvelden en je kunt items toevoegen of verwijderen.
2. Wijzigingen worden direct opgeslagen in LocalStorage van je browser.
3. Via **Data** kun je een **JSON-back-up exporteren**, een back-up **importeren** of alles **resetten** naar de voorbeelddata.

> LocalStorage is per browser en per apparaat. Exporteer een JSON-back-up voordat je van browser wisselt of je browsergegevens wist.

### Directe links

Elke pagina en sprint heeft een eigen URL, bijvoorbeeld `#/sprints/3`, `#/show-grow/2`, `#/dashboard` of `#/prompts/p1`. Met **Kopieer link** zet je die op je klembord.

## Projectstructuur

```
src/
├── main.tsx                 # Startpunt: providers + App
├── App.tsx                  # Layout en routering (hash-routes)
├── index.css                # Tailwind + thema (kleuren, lettertypes)
├── types.ts                 # TypeScript-types voor alle data
├── data/sampleData.ts       # Voorbeelddata (ook gebruikt bij reset)
├── context/                 # PortfolioProvider (data + opslag), ToastProvider
├── hooks/                   # usePortfolio, useToast, useCopy, useHashRoute
├── lib/                     # storage (LocalStorage/JSON), supabase (online opslag), clipboard, utils
├── components/              # Herbruikbare UI: Header, DataMenu, PageHeader, editable-velden, ui
└── pages/                   # Eén bestand per sectie
```

## Supabase (online opslag)

**Hoe het werkt**

- Het hele portfolio staat als één JSON-document in de tabel `portfolio` (rij `main`) in Supabase.
- **Bezoekers**: de site haalt bij het openen die rij op, dus iedereen ziet jouw nieuwste versie.
- **Jij**: klik op **Bewerken** en log in. Elke wijziging wordt na 0,8 seconde automatisch opgeslagen in Supabase.
- **Beveiliging**: iedereen mag lezen, maar alleen het e-mailadres uit `supabase/schema.sql` mag opslaan (Row Level Security).
- LocalStorage blijft als reservekopie. Zonder anon key werkt de site volledig lokaal, zoals voorheen.
- De status zie je in het **Data**-menu: *Gelijk met Supabase*, *Opslaan…*, *Alleen in deze browser* of een foutmelding.

**Eenmalig instellen**

1. Supabase → **SQL Editor** → plak de inhoud van `supabase/schema.sql` → **Run**.
2. Supabase → **Authentication → Users → Add user → Create new user**: je e-mailadres en een wachtwoord, met *Auto Confirm User* aan.
3. Supabase → **Project Settings → API**: kopieer de **anon public** key.
4. Lokaal: zet die in `.env` (zie `.env.example`) en herstart `npm run dev`.
5. Vercel → project → **Settings → Environment Variables**: voeg `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` toe en klik daarna bij **Deployments** op **Redeploy**.

**Zelf controleren**

- Supabase → **Table Editor → portfolio**: na je eerste wijziging verschijnt rij `main`, en `updated_at` verandert bij elke opslag.
- Open je Vercel-link in een privévenster: je ziet je nieuwste versie zonder in te loggen.

## Aanpassen

- **Eigen gegevens**: gebruik de bewerkmodus, of pas `src/data/sampleData.ts` aan als je de standaarddata wilt wijzigen.
- **Kleuren**: in `src/index.css` onder `@theme`.
- **Leeruitkomsten**: de titels en omschrijvingen van LU1 tot en met LU5 bewerk je op het Dashboard, in de bewerkmodus.
