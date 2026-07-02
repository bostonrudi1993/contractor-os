# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test suite is configured.

## Deployment Workflow

All changes commit and push directly to `main`. Vercel auto-deploys from main.

Every session:
1. Make code changes and commit directly to `main`
2. Push to `main` with `git push origin main`
3. Vercel auto-deploys within ~60 seconds

Always end every coding session by:
- Running `npm run build` to verify no build errors
- Committing and pushing to `main`
- Sending changed files via SendUserFile so the user has local copies
- Always explain changes from an engineering standpoint — what was changed, why, and how it works

Never tell the user to run `npm run build` or `vercel --prod` themselves.

## Environment Variables

```
VITE_CLERK_PUBLISHABLE_KEY    # Clerk authentication (use production key for contractoroshub.com)
VITE_SUPABASE_URL             # Cloud database
VITE_SUPABASE_ANON_KEY        # Supabase anonymous access
VITE_FMCSA_API_KEY            # FMCSA carrier lookup (optional)
ANTHROPIC_API_KEY             # Claude API — server-side only, used by api/claude.js (NO VITE_ prefix)
RESEND_API_KEY                # Email service (Vercel functions only)
RESEND_FROM_EMAIL             # Sender address (Vercel functions only)
```

## Architecture

**ContractorOS** is a fleet management SPA for contract carriers (FedEx ISPs, Amazon DSPs, OTR, last-mile, USPS HCR operators). It runs on React 18 + Vite, deployed to Vercel at contractoroshub.com.

### Source layout

```
src/
  App.jsx                    # Root auth gate + main app (~1500 lines)
  main.jsx                   # React + Clerk provider bootstrap
  supabase.js                # Cloud storage helper
  config/
    keys.js                  # Storage keys + localStorage helper
    segments.js              # Segment definitions
    styles.js                # Shared style factory
  hooks/
    useSupabase.js           # useDataLoader + useDataSaver
    useOnboarding.js         # Onboarding email triggers
  components/
    shared/                  # Nav, TopBar, EditModal, StatCard, etc.
    screens/                 # One file per screen (Analyze, Compliance, Fleet, etc.)
api/
  claude.js                  # Vercel serverless — proxies all Anthropic API calls
  createcheckoutsession.js   # Stripe checkout session creation
  stripewebhook.js           # Stripe webhook handler
  onboardingemail.js         # Resend welcome email
  sendreminder.js            # Scheduled compliance reminders
public/
  landing.html               # Marketing landing page (served at /)
  sw.js                      # Service worker v2 (network-first API, cache-first static)
  manifest.json              # PWA manifest
```

### Segment system

The app has five customer segments, each with different nav items and feature flags:

```javascript
const SEGMENTS = { otr, fedex, amazon, lastmile, usps }
```

Every segment object has a `features` map (e.g., `loadAnalysis`, `routeProfit`, `brokerScorecard`) that gates which screens appear. A single Clerk organization picks one segment via Settings.

### Data layer

`makeDb(orgId)` returns a storage object that tries Supabase first, then falls back to `localStorage` with `cos_*` prefixes. All data is scoped by Clerk organization ID. The Supabase table is `cos_data` with columns `user_id` (actually org ID), `data_key`, `data_value`. The `KEYS` object in `src/config/keys.js` lists every valid key.

### Authentication

Clerk handles sign-in/sign-up and multi-org. Users without a Clerk org fall back to an anonymous device ID stored in localStorage. Role system: owner (OWNER_EMAILS bypass or org:admin), manager (default), driver (publicMetadata.role === "driver").

### AI features

All Claude API calls go through `/api/claude` (server-side proxy). Never call Anthropic directly from the browser. The proxy uses `process.env.ANTHROPIC_API_KEY` (no VITE_ prefix).

Prompts defined in App.jsx:
- `ANALYZE_PROMPT` — OTR load rate analysis
- `PARSE_PROMPT` — extract load details from pasted text
- `COMPLIANCE_PROMPT` — DOT/FMCSA Q&A
- `ROUTE_AI_PROMPT` — route profitability scoring

### App.jsx patterns

- `AuthGate` is the exported root component — handles loading, sign-in, sign-up, org setup, then renders `ContractorOS`
- Screen components live in `src/components/screens/` as separate files
- All styles are inline (`style={{...}}`); there are no CSS files
- `callAI(system, content, json)` throws on error — all callers use try/catch
- Vercel cron triggers `api/sendreminder.js` for scheduled compliance email alerts
