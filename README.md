# NARA — Growth Studio

A production-ready marketing site and dual-role agency dashboard for **NARA**, a senior-only growth studio. Built with Next.js App Router, Tailwind CSS, Lucide icons, and a bespoke dark visual system — no remote images required.

## Quick start

**Requirements:** Node.js 18.17+ and npm 9+.

```bash
cd nara
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Production build

```bash
npm run build
npm run start
```

The production server runs on `http://localhost:3000` by default. Pass `-- -p 3210` to choose a port.

### Quality checks

```bash
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint via Next.js
npm run build       # optimized production build
```

## Experience map

| Route | Purpose |
| --- | --- |
| `/` | Homepage: hero, metrics ticker, services, method, selected work, testimonials, insights, contact |
| `/insights` | Editorial index |
| `/insights/paid-media-playbook` | Long-form article |
| `/insights/roas` | Long-form article |
| `/insights/creative-velocity` | Long-form article |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/dashboard?role=client` | Client workspace (Jordan Lee / AUREL) |
| `/dashboard?role=admin` | Agency workspace (Maya Chen / NARA) |

Switch roles from any dashboard page using the workspace switcher in the sidebar, or the account menu in the top bar. The URL updates to reflect the active role.

### Demo accounts

The dashboard is a fully interactive, front-end prototype. There is no authentication or backend.

- **Client:** Jordan Lee, Head of Growth at AUREL
- **Admin:** Maya Chen, Growth Director at NARA

All data is realistic mock data. Client additions, report uploads, ticket replies, and status changes live in React state for the current page session. Reloading the page restores the seeded dataset.

## What's included

### Public site
- Sticky, frosted navigation with a dismissible announcement bar and mobile overlay menu
- Animated hero console, revenue chart, live metrics ticker, and trust strip
- Five interactive service cards with detail modals
- Methodology timeline with a senior-pod visual
- Filterable case studies with bespoke CSS/SVG cover art and full-story modals
- Interactive ROI calculator with instant client-side revenue projections, live updates, and inline field validation
- Testimonials, editorial insights, and newsletter capture
- Validated lead form with success state, calendar booking, and WhatsApp links
- Branded 404 and error boundaries
- Structured data, Open Graph metadata, `sitemap.xml`, and `robots.txt`

### Client workspace
- KPI cards, interactive 7/30/90-day performance chart, spend allocation, and retention health
- Campaign table with search, platform/status filters, detail panels, and CSV export
- Report library with in-browser PDF preview, real downloadable PDFs, CSV data, monthly roadmap, and creative library
- Support inbox with filters, ticket composer, attachments, conversation threads, and replies
- Budget and creative requests through ticket categories and quick-start templates

### Agency workspace
- Agency command center with revenue, retainers, client health, portfolio table, support queue, team utilization, and activity feed
- Client CRUD with account managers, budgets, statuses, and confirmation before deletion
- Report uploader with client selection, type, period, notify option, and recent uploads
- Ticket desk with filters, priority sort, search, status toggles, quick replies, and conversation history
- CSV exports for the portfolio, campaigns, and ticket queue

## Design system

The palette and typography are defined in `tailwind.config.ts` and `app/globals.css`.

| Token | Value |
| --- | --- |
| Canvas | `#070709` |
| Surface | `#0F121C` |
| Primary | `#004BFF` |
| Hover / glow | `#2563EB` |
| Text | `#FFFFFF` |
| Secondary text | `#94A3B8` |
| Hairline | `rgba(255,255,255,0.08)` |
| Blue border | `rgba(0,75,255,0.2)` |

- **Display type:** Space Grotesk Variable
- **Body type:** Manrope Variable
- Fonts are bundled locally through `@fontsource-variable`, so there are no external font requests.
- All opacity modifiers from `0` to `100` are registered in Tailwind for fine-grained glass and border treatments.
- Motion respects `prefers-reduced-motion`.

## Project structure

```
app/
  page.tsx                 Homepage assembly
  layout.tsx               Fonts, metadata, skip link
  dashboard/page.tsx       Role-aware dashboard route
  insights/                Index and long-form article routes
  privacy/, terms/         Legal pages
  not-found.tsx            404 experience
  error.tsx                Route error boundary
  globals.css              Tokens, utilities, animations
  sitemap.ts, robots.ts    SEO routes
components/
  brand/                   Logo
  site/                    Marketing sections and article tools
  dashboard/               Client and admin views + shared shell
  ui/                      Buttons, modal, toast, reveal, avatar, headings
lib/
  data.ts                  Mock marketing and dashboard data
  insights-content.ts      Structured article content
  download.ts              CSV export helper
  generate-pdf.ts          Lightweight branded PDF generator
  utils.ts                 Class and format helpers
```

## Implementation notes

- **Modals** use a portal, focus trap, Escape handling, scroll lock, and stable focus restoration. The focus effect intentionally depends only on `open` so typing in a form never pulls focus out of the active field.
- **Charts** are hand-built SVG/CSS, keeping the experience fast and dependency-light.
- **ROI calculator:** the projection is calculated entirely in the browser from the budget and customer value inputs at a 4.8x multiplier. Results update live as you type, with inline validation and no network requests or backend dependency.
- **Downloads** are generated client-side: CSV exports use a UTF-8 BOM for Excel compatibility, and reports use a minimal, valid single-page PDF.
- **State sharing:** the client and admin views are rendered by the same `DashboardShell`, so a ticket created as a client is immediately visible in the agency ticket desk without a backend.
- **Accessibility:** semantic landmarks, skip link, visible focus states, labelled dialogs, `aria-current` navigation, keyboard-operable controls, and reduced-motion support are included.

## Deployment

Deploy to Vercel, Netlify, or any platform supporting Next.js 14. The project has no required environment variables. If you host it under a different domain, update `metadataBase` in `app/layout.tsx` and the base URL in `app/sitemap.ts` / `app/robots.ts`.

---

Designed and engineered as a complete NARA experience.
