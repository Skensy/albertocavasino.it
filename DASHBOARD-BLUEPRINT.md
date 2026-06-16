# 📋 Blueprint — Admin Dashboard per Next.js + GitHub Pages

Blueprint completo della dashboard admin realizzata per `albertocavasino.it`. Da usare come riferimento per replicare velocemente la stessa architettura su qualsiasi sito statico Next.js su GitHub Pages.

---

## Inventario file (6 core)

```
src/
├── data/site-content.json              ← Singola fonte di verità JSON
├── lib/
│   ├── content.ts                      ← Interfaccia TypeScript + import JSON
│   ├── content-context.tsx             ← React context + preview via localStorage
│   ├── github-api.ts                   ← GitHub Contents API (fetch/save) + Actions polling
│   ├── color-vars-injector.tsx         ← Inietta CSS custom properties dal JSON
│   ├── seo-injector.tsx                ← Inietta <title> + <meta description>
│   └── icons.tsx                       ← Mappa icone SVG per servizi e social
├── app/
│   ├── admin/
│   │   ├── page.tsx                    ← Dashboard completa (~1700 righe, file unico)
│   │   └── layout.tsx                  ← Wrapper minimo (bg scuro)
│   ├── layout.tsx                      ← Root: font, ColorVarsInjector, ContentProvider
│   └── page.tsx                        ← Sito principale (importa i componenti)
└── .github/
    └── workflows/
        └── deploy.yml                  ← GitHub Actions per build + deploy Pages
```

---

## Architettura

```
site-content.json (JSON unico)
       │
       ▼
 content.ts (interfaccia SiteContent + export tipizzato)
       │
       ├──► Componenti sito (importano dati build-time)
       │
       └──► content-context.tsx ← localStorage("preview_content") sovrascrive
                 │
                 ├──► ColorVarsInjector → <style>:root { --user-* }
                 ├──► SeoInjector → <title> + <meta>
                 └──► admin/page.tsx (dashboard)
                          │
                          └──► github-api.ts
                                   ├── fetchContent(token)     → GET Contents API
                                   ├── saveContent(token, json, sha) → PUT Contents API
                                   └── checkDeployStatus(token, commitSha) → GET Actions API
```

### Flusso dati

1. **Build-time**: `content.ts` importa `site-content.json` e lo esporta come `SiteContent` tipizzato. I componenti del sito lo usano direttamente.
2. **Preview**: `ContentProvider` al mount controlla `localStorage("preview_content")`. Se presente, sovrascrive i dati statici per la preview live.
3. **Admin**: La dashboard modifica il JSON in memoria → preview locale → salvataggio su GitHub tramite API.
4. **Publish**: `saveContent()` → commit su GitHub → `pollDeployStatus()` attende il completamento del workflow Actions.

---

## Setup per nuovo progetto

### 1. Copia file

Copia nella struttura del nuovo progetto:

```
src/data/site-content.json
src/lib/content.ts
src/lib/content-context.tsx
src/lib/github-api.ts
src/lib/color-vars-injector.tsx
src/lib/seo-injector.tsx
src/lib/icons.tsx
src/app/admin/page.tsx
src/app/admin/layout.tsx
.github/workflows/deploy.yml
```

### 2. Configura parametri progetto

**`src/lib/github-api.ts`** — Aggiorna owner/repo/path:

```typescript
const REPO_OWNER = "tuo-username";
const REPO_NAME = "nome-repo";
const FILE_PATH = "src/data/site-content.json";
```

**`src/app/admin/page.tsx`** — Imposta password (SHA-256):

```typescript
const ADMIN_PASSWORD_HASH = "hash-sha256-della-tua-password";
```

Genera l'hash con: `echo -n "tuaPassword" | sha256sum`

**`next.config.ts`** — Se usi GitHub Pages (project site):

```typescript
const nextConfig = {
  output: "export",
  basePath: "/nome-repo",
  images: { unoptimized: true },
};
```

### 3. Wrapper root layout

```tsx
// src/app/layout.tsx
import { ContentProvider } from "@/lib/content-context";
import ColorVarsInjector from "@/lib/color-vars-injector";
import SeoInjector from "@/lib/seo-injector";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <ColorVarsInjector />
      </head>
      <body>
        <SeoInjector />
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
```

### 4. Componenti e `useContent()`

I componenti del sito NON importano `content.ts` direttamente. Usano l'hook:

```tsx
import { useContent } from "@/lib/content-context";

export default function Hero() {
  const { hero } = useContent();
  // ...
}
```

Solo per SEO build-time (metadata Next.js) importa `staticContent`:

```tsx
import staticContent from "@/lib/content";
export const metadata = { title: staticContent.seo.title };
```

### 5. GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on: { push: { branches: [main] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions: { contents: read, pages: write, id-token: write }
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: "npm" }
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with: { path: "./out" }
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## Feature dashboard

### Login
- Password hascata con SHA-256 (Web Crypto API)
- GitHub PAT (Personal Access Token) salvato in `sessionStorage`
- Persiste al refresh, sparisce alla chiusura del tab

### Editor contenuti
- `update(path, value)` — aggiornamento generico tramite path annidato
- `updateArrItem(path, i, key, val)` — modifica item in array
- `addArrItem(path, template)` — aggiunge elemento con template default
- `removeArrItem(path, i)` — rimuove elemento
- Undo implicito: reset del form annulla modifiche non salvate

### Sezioni editabili (10)

| Sezione | Contenuto |
|---------|-----------|
| Generale | Nome sito, Ruolo, ColorPreview |
| Hero | bgImage, bgAlt, badge, headingLine1/Accent, subtitle, ctaText/Href |
| Chi Sono | photoUrl/Alt, title, paragraphs (HTML), skills (label+icon), stats (number+label) |
| Servizi | title, subtitle, items (title+description+iconName dropdown) |
| Portfolio | title, subtitle, projects (title+category+src) |
| Contatti | title, subtitle, email, phone, location, formLabels, sidebarTitle, socialTitle, socials |
| Navigazione | Array link (label+href) |
| Colori | primary, primaryHover, bgLight, bgDark, textPrimary, textSecondary, navBg, serviceNumber (color + opacity) |
| SEO | title, description |
| Footer | linkSectionTitle, socialSectionTitle, footerLinks, copyright |

### Coda modifiche
- "Accoda modifiche" → salva in `localStorage("pending_content")`
- Badge contatore pending
- Al login, possibilità di caricare o scartare le pending

### Publish
- "📤 Pubblica tutto" → `saveContent()` → commit su GitHub
- Polling: `checkDeployStatus()` via **Actions API** (`/actions/runs?head_sha=...`)
  - 30 tentativi × 4 secondi = 120 secondi max
- Feedback visivo: `saving` → `building` → `deployed` / `error`

### Preview live
- Salva modifiche in `localStorage("preview_content")`
- Apre `/_/` in nuovo tab (pagina separata che usa `localStorage`)

### Diff
- `getPendingDiff()` confronta JSON originale vs corrente
- Mostra solo campi modificati in un box formattato

---

## Sistema colori

### Valori predefiniti

```json
{
  "primary": "#FFA620",
  "primaryHover": "#E8960A",
  "bgLight": "#1C1C1C",
  "bgDark": "#000000",
  "textPrimary": "#FFFFFF",
  "textSecondary": "#8C8C8C",
  "navBg": "#000000",
  "serviceNumberColor": "#FFFFFF",
  "serviceNumberOpacity": 5
}
```

### Variabili CSS iniettate da `color-vars-injector.tsx`

```
--user-accent             → primary
--user-accent-hover       → primaryHover
--user-accent-rgb         → primary come "R G B"
--user-nav-bg-rgb         → navBg come "R G B"
--user-text-primary       → textPrimary
--user-text-secondary     → textSecondary
--user-bg                 → bgLight
--user-brand-50..950      → scala brand ancorata a textSecondary
--user-service-number     → rgba da serviceNumberColor + serviceNumberOpacity
```

### Brand scale (dark theme)

| Step | Valore | Origine |
|------|--------|---------|
| 50 | `bgLight` | #1C1C1C |
| 100 | `bgLight` | #1C1C1C |
| 200 | `tint(textSecondary, 0.5)` | #C6C6C6 |
| 300 | `tint(textSecondary, 0.35)` | #B4B4B4 |
| 400 | `textSecondary` | #8C8C8C |
| 500 | `shade(textSecondary, 0.2)` | #707070 |
| 600 | `shade(textSecondary, 0.38)` | #575757 |
| 700 | `shade(textSecondary, 0.55)` | #3F3F3F |
| 800 | `bgLight` | #1C1C1C |
| 900 | `textPrimary` | #FFFFFF |
| 950 | `bgDark` | #000000 |

### Dichiarazione `@theme inline` in globals.css

```css
@theme inline {
  --color-brand-50: var(--user-brand-50, #1C1C1C);
  --color-brand-100: var(--user-brand-100, #1C1C1C);
  --color-brand-200: var(--user-brand-200, #C6C6C6);
  --color-brand-300: var(--user-brand-300, #B4B4B4);
  --color-brand-400: var(--user-brand-400, #8C8C8C);
  --color-brand-500: var(--user-brand-500, #707070);
  --color-brand-600: var(--user-brand-600, #575757);
  --color-brand-700: var(--user-brand-700, #3F3F3F);
  --color-brand-800: var(--user-brand-800, #1C1C1C);
  --color-brand-900: var(--user-brand-900, #FFFFFF);
  --color-brand-950: var(--user-brand-950, #000000);
  --color-accent: #FFA620;
  --color-accent-rgb: 255 166 32;
  --color-service-number: var(--user-service-number, rgba(255,255,255,0.05));
}
```

---

## API GitHub

### `fetchContent(token)`
- `GET /repos/{owner}/{repo}/contents/src/data/site-content.json`
- Decodifica base64 → JSON string
- Restituisce `{ content: string, sha: string }`

### `saveContent(token, newContent, sha, message?)`
- `PUT /repos/{owner}/{repo}/contents/src/data/site-content.json`
- Codifica in base64
- Restituisce `{ contentSha: string, commitSha: string }`

### `checkDeployStatus(token, commitSha)`
- `GET /repos/{owner}/{repo}/actions/runs?head_sha={commitSha}&event=push&per_page=1`
- Controlla `workflow_runs[0].status` e `.conclusion`
- Restituisce `{ status: "in_progress" | "built" | "errored" | "unknown" }`
- ⚠️ **NON** usare `/pages/builds/latest` — non riflette i deploy via Actions

### PAT richiede permessi
- `Contents: Read & Write`
- `Actions: Read` (per polling status)

---

## Tipi TypeScript

```typescript
interface SiteContent {
  site: { name: string; role: string };
  nav: Array<{ label: string; href: string }>;
  hero: { bgImage, bgAlt, badge, headingLine1, headingAccent, subtitle, ctaText, ctaHref };
  about: {
    photoUrl: string; photoAlt: string; title: string;
    paragraphs: string[];
    skills: Array<{ label: string; icon: string }>;
    stats: Array<{ number: string; label: string }>;
  };
  services: {
    title: string; subtitle: string;
    items: Array<{ title: string; description: string; iconName: string }>;
  };
  portfolio: {
    title: string; subtitle: string;
    projects: Array<{ title: string; category: string; src: string }>;
  };
  contact: {
    title, subtitle, email, phone, location: string;
    formLabels: { name, namePlaceholder, email, emailPlaceholder, message, messagePlaceholder, submit };
    sidebarTitle: string; socialTitle: string;
    socials: Array<{ label: string; url: string; iconName: string }>;
  };
  footer: {
    linkSectionTitle: string; socialSectionTitle: string;
    footerLinks: string[]; copyright: string;
  };
  colors: {
    primary, primaryHover, bgLight, bgDark, textPrimary, textSecondary, navBg: string;
    serviceNumberColor: string; serviceNumberOpacity: number;
  };
  seo: { title: string; description: string };
}
```

---

## Gotchas & Avvertenze

1. **Pages API vs Actions API**: L'API `/pages/builds/latest` **NON riflette** i deploy fatti via `actions/deploy-pages@v4`. Usare sempre `/actions/runs?head_sha=...` per il polling.

2. **Repo privato + Pages**: GitHub Pages su repo privati richiede **piano a pagamento** (Pro/Team/Enterprise). Su Free plan, rendere il repo privato spegne il sito.

3. **`structuredClone()`**: Usato per deep copy dell'oggetto contenuto. Supportato in tutti i browser moderni (Chrome 98+, Firefox 94+, Safari 15.4+).

4. **Password**: SHA-256 lato client con Web Crypto API: `crypto.subtle.digest("SHA-256", ...)`. L'hash hardcoded è nel file admin.

5. **`useContent()`**: I componenti del sito DEVONO usare `useContent()` da `content-context.tsx`, non importare direttamente `content.ts`. Solo per metadata Next.js (build-time) si usa l'import statico.

6. **Preview locale**: La pagina `/_/` usa `localStorage("preview_content")`. Assicurarsi che `Next.js` non generi 404 per questa route (aggiungere una page di redirect).

7. **`basePath`**: Se si usa GitHub Pages project site (es. `https://owner.github.io/repo/`), `next.config.ts` deve avere `basePath: "/repo"`. Questo influenza TUTTI i link, incluse le chiamate API nell'admin.

8. **Admin + Edge Runtime**: L'admin page è `"use client"` — non può usare server actions o API routes. Tutto passa attraverso le GitHub API via fetch diretto.
