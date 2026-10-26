# NARA — Growth Studio

A production-ready marketing site and secure, dual-role agency workspace for **NARA**, a senior-only growth studio. Built with Next.js App Router, Tailwind CSS, Lucide icons, and a bespoke dark visual system.

## Quick start

**Requirements:** Node.js 18.17+ and npm 9+.

```bash
cd nara
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Environment setup

Workspace access and signed sessions require environment variables. Copy `.env.example` to `.env.local` and replace every placeholder.

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | HMAC signing secret for session cookies. Minimum 32 characters. |
| `AUTH_CLIENT_EMAIL` | Client workspace email address. |
| `AUTH_CLIENT_PASSWORD` | Client workspace password. |
| `AUTH_CLIENT_NAME` | Display name for the client account. |
| `AUTH_ADMIN_EMAIL` | Agency / owner workspace email address. |
| `AUTH_ADMIN_PASSWORD` | Agency / owner workspace password. |
| `AUTH_ADMIN_NAME` | Display name for the agency account. |

Generate a signing secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

`.env.local` is ignored by git. Never commit real credentials. The local working copy includes generated test credentials in `.env.local`; replace them before any shared or production deployment.

### Production build

```bash
npm run build
npm run start
```

The production server runs on `http://localhost:3000` by default. Pass `-- -p 3210` to choose a port.

### Quality checks

```bash
npm run typecheck   # TypeScript, no emit
npm run build       # optimized production build, including type validation
```

`npm run lint` is present in `package.json`, but this repository does not ship an ESLint config or dependency; Next.js will open its one-time setup prompt. Add a config and the ESLint packages if you want linting in CI.

## Experience map

| Route | Purpose |
| --- | --- |
| `/` | Homepage: hero, metrics ticker, services, method, selected work, ROI calculator, testimonials, insights, contact |
| `/insights` | Editorial index |
| `/insights/paid-media-playbook` | Long-form article |
| `/insights/roas` | Long-form article |
| `/insights/creative-velocity` | Long-form article |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/login` | Private workspace sign-in |
| `/dashboard` | Session-scoped client or agency workspace; redirects to `/login` when unauthenticated |

This app supports one client role and one agency / owner role, each tied to its own account. The dashboard does not accept a role query parameter, does not expose a role switcher, and is not linked from the public header, footer, landing page, or 404 page. Agency accounts also receive a **Content studio** area for editing public-site content; client accounts never render that navigation or view.

## Authentication and workspace security

- **Signed sessions.** After a successful sign-in, `/api/auth/login` issues an HMAC-SHA256 session in the `nara_session` cookie. The cookie is `HttpOnly`, `SameSite=Lax`, scoped to `/`, `Secure` on HTTPS, and expires after 8 hours.
- **Server-side authorization.** `middleware.ts` protects `/dashboard` and its subpaths. The dashboard page verifies the signed cookie again on the server and passes only the trusted role to the workspace shell. Invalid or expired sessions are sent to `/login`.
- **Fixed roles.** Client and agency accounts are configured separately through environment variables. If those variables are absent, the app falls back to built-in demo accounts (`client@nara.agency` and `admin@nara.agency`) so preview deployments remain usable. The role is embedded in the signed session, so a client cannot request the agency workspace by changing a URL. Configure both `AUTH_CLIENT_*` and `AUTH_ADMIN_*` to replace the demo accounts.
- **Login protection.** Failed attempts are limited to 5 per IP address in a rolling 15-minute window. Authentication responses are generic and do not reveal which credential was wrong. Login requests reject cross-origin submissions.
- **No indexing.** `/dashboard`, `/login`, and `/api/` are disallowed in `robots.txt`; auth and dashboard routes also send `noindex` headers or metadata. Security headers are configured in `next.config.mjs`.
- **Prototype data.** Dashboard content is realistic in-memory mock data. Authentication gates the UI, not a persistent database. Reloading the dashboard restores the seeded dataset, and account changes live only in the current browser session.

The in-memory login rate limiter is per server process. For a multi-instance production deployment, replace it with a shared store such as Redis or a platform rate-limiting service.

## Website content studio

Agency accounts can edit the public marketing site from **Dashboard → Content studio** without a redeploy. The studio is mounted only by the agency branch of the dashboard shell and `/dashboard` remains behind the signed server session, so a client account cannot open it by URL or role switching.

| Area | Controls |
| --- | --- |
| **Hero** | English and Arabic title lines, accent phrase, ending, subtitle, validated save, and a two-language live preview |
| **Services** | Add, edit, hide/show, reorder, and delete services; bilingual eyebrows, titles, descriptions, metrics, tags, deliverables, icon, and accent color |
| **Testimonials** | Add, edit, hide/show, reorder, and delete reviews; bilingual client name, role, company, quote, result metric, 1–5 star rating, initials, and avatar accent |
| **ROI model** | Base and maximum return multipliers, curve budget, plus default budget and customer value for each supported currency |

### Persistence and publishing

- Content lives in browser `localStorage` under `nara-cms-content-v1`. `CmsProvider` loads it at startup, sanitizes every stored or imported value, and notifies every open tab through the `storage` event.
- Public components read the same localized content, so a saved edit appears immediately on `/` in that browser — including the hero, services grid, testimonial cards and average rating, and ROI calculator defaults/range copy.
- The store is **browser-local**, not a shared database. Another visitor or device sees the built-in defaults until the content is imported there. Use **Export** to download a JSON snapshot and **Import** to apply it in another browser. **Reset** restores the seeded hero, services, testimonials, and ROI model.
- For multi-editor or all-visitor publishing, replace the persistence layer in `lib/cms/provider.tsx` with a durable shared store (for example a database or edge KV) and keep the sanitizer in `lib/cms/content.ts` for validation.
- Seed content is derived from the existing English and Arabic translations, so the site still renders fully with no stored content and no JavaScript errors from missing fields.

## Currency and ROI model

The public ROI calculator adapts to the visitor's market and keeps projections grounded in normal digital-marketing returns.

- **Supported currencies:** EGP (Egypt), SAR (Saudi Arabia), AED (United Arab Emirates), and USD (fallback).
- **Detection order:** saved `nara-currency` preference → IANA timezone → browser locale region → USD.
- **Local benchmarks:** each currency has its own default 90-day media budget and average customer value, rather than using a raw currency conversion of a US default. These presets are editable in the Content studio.
- **Manual selection:** changing the currency stores the preference for future visits. Edited values are converted once using approximate FX rates and rounded to a market-friendly step; pristine values switch to the selected market's local benchmark.
- **Realistic returns:** the modeled return multiple starts at a configurable base (**3.2x** by default) and approaches a configurable maximum (**4.8x** by default). It rises with the USD-equivalent 90-day budget using `min + (max − min) × (1 − e^(−budgetUSD / curve))`, rounded to one decimal. All three values are editable in the Content studio.
- **Projection:** revenue = budget × modeled multiple; net return = revenue − budget; projected customers = floor(revenue ÷ customer value).
- **Formatting:** results use locale-aware formatting and Latin digits in Arabic (`ar-EG-u-nu-latn`). Inputs are validated inline, and positive validation messages are preserved.
- **Fixed inputs:** FX conversion rates and market-friendly input steps remain code-level constants; the studio edits the model and presets, not live exchange rates.

## What's included

### Public site
- Sticky, frosted navigation with a dismissible announcement bar and mobile overlay menu
- Animated hero console, revenue chart, live metrics ticker, and trust strip
- Content-managed bilingual hero and testimonial rating strip
- Editable service cards with detail modals, ordering, visibility, and an empty state
- Methodology timeline with a senior-pod visual
- Filterable case studies with bespoke CSS/SVG cover art and full-story modals
- Currency-aware ROI calculator with market detection and realistic 3.2x–4.8x projections
- Arab client testimonials with representative portraits, bilingual profile context, and natural Arabic review copy
- Editorial insights and newsletter capture
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
- Content studio for live hero, services, testimonials, and ROI editing with bilingual previews, import/export, and reset
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
- **Arabic type:** Noto Sans Arabic Variable
- Fonts are bundled locally through `@fontsource-variable`, so there are no external font requests.
- All opacity modifiers from `0` to `100` are registered in Tailwind for fine-grained glass and border treatments.
- Motion respects `prefers-reduced-motion`.
- The dashboard remains English/LTR even when Arabic is selected on the public site.

## Project structure

```
app/
  page.tsx                 Homepage assembly
  layout.tsx               Fonts, metadata, skip link
  login/page.tsx           Public sign-in route
  dashboard/page.tsx       Authenticated, role-scoped workspace
  api/auth/                Login and logout route handlers
  insights/                Index and long-form article routes
  privacy/, terms/         Legal pages
  not-found.tsx            404 experience
  error.tsx                Route error boundary
  globals.css              Tokens, utilities, animations
  sitemap.ts, robots.ts    SEO routes
components/
  auth/                    Bilingual login experience
  brand/                   Logo
  site/                    Marketing sections and article tools
  dashboard/               Client and admin views + shared shell
  ui/                      Buttons, modal, toast, reveal, avatar, headings
lib/
  auth/session.ts          Signed session creation and verification
  cms/content.ts           Content types, seed defaults, sanitizer, localized resolvers
  cms/provider.tsx         Browser persistence, cross-tab sync, import/export/reset
  currency.ts              Currency detection, defaults, formatting, ROI model
  data.ts                  Mock marketing and dashboard data
  insights-content.ts      Structured article content
  download.ts              CSV export helper
  generate-pdf.ts          Lightweight branded PDF generator
  utils.ts                 Class and format helpers
middleware.ts              Route protection for /dashboard and /login
public/testimonials/       Representative Arab portrait photography
```

## Implementation notes

- **Modals** use a portal, focus trap, Escape handling, scroll lock, and stable focus restoration. The focus effect intentionally depends only on `open` so typing in a form never pulls focus out of the active field.
- **Charts** are hand-built SVG/CSS, keeping the experience fast and dependency-light.
- **ROI calculator:** projections are calculated entirely in the browser from the selected currency, 90-day budget, and customer value. The model is intentionally bounded at 3.2x–4.8x instead of inflating small budgets into multi-million headline numbers.
- **Downloads** are generated client-side: CSV exports use a UTF-8 BOM for Excel compatibility, and reports use a minimal, valid single-page PDF.
- **State sharing:** the client and admin views are rendered by the same `DashboardShell`, so a ticket created as a client is immediately visible in the agency ticket desk during that browser session. There is no backend database.
- **CMS content:** `CmsProvider` wraps the entire app in `app/layout.tsx`. Every read parses and sanitizes the stored payload, malformed data falls back to seed content instead of crashing, and editors key drafts to their own section so unrelated saves do not discard unsaved work. Content export/import is the supported handoff between browsers because the store is local to one origin and profile.
- **Accessibility:** semantic landmarks, skip link, visible focus states, labelled dialogs, labelled form fields, `aria-current` navigation, keyboard-operable controls, and reduced-motion support are included.

## Testimonial photography

The portraits in `public/testimonials/` are representative stock photographs sourced from [Pexels](https://www.pexels.com/license/) and used under the Pexels license. The names, companies, quotes, and performance figures are illustrative. Stock photography does not imply that the people pictured are real NARA clients or endorse NARA's services.

## Deployment

Deploy to Vercel, Netlify, or any platform supporting Next.js 14. The demo fallbacks work without environment variables, so a preview deployment can be tested immediately. For a public production deployment, set all variables from `.env.example` in the hosting provider's environment settings, including a unique production `AUTH_SECRET` and strong passwords, to replace the built-in demo accounts and signing secret. If you host under a different domain, update `metadataBase` in `app/layout.tsx`, the base URL in `app/sitemap.ts` / `app/robots.ts`, and the canonical site URL where applicable.

For horizontally scaled deployments, move login rate limiting to a shared store so attempts are counted consistently across instances.

---

Designed and engineered as a complete NARA experience.
