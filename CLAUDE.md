# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test suite is configured.

## User Deployment Workflow

The user deploys manually — NOT via git push. Workflow every session:
1. Make code changes and commit to branch `claude/contractoros-project-setup-2h9op2`
2. Send changed source files to user via SendUserFile so they can download them
3. User replaces files in their local project
4. User runs: `npm run build` then `vercel --prod`

Always end every coding session by:
- Running `npm run build` to verify no build errors
- Sending all changed files via SendUserFile
- Providing copy-paste commands: `npm run build` then `vercel --prod`

## Environment Variables

```
VITE_CLERK_PUBLISHABLE_KEY    # Clerk authentication
VITE_ANTHROPIC_API_KEY        # Claude API (client-side AI features)
VITE_SUPABASE_URL             # Cloud database
VITE_SUPABASE_ANON_KEY        # Supabase anonymous access
VITE_FMCSA_API_KEY            # FMCSA carrier lookup (optional)
RESEND_API_KEY                # Email service (Vercel functions only)
RESEND_FROM_EMAIL             # Sender address (Vercel functions only)
```

## Architecture

**ContractorOS** is a fleet management SPA for contract carriers (FedEx ISPs, Amazon DSPs, OTR, last-mile, USPS HCR operators). It runs on React 18 + Vite, deployed to Vercel at contractoroshub.com.

### Source layout

```
src/
  App.jsx       # Entire app UI (~4600 lines, intentionally monolithic)
  main.jsx      # React + Clerk provider bootstrap
  supabase.js   # Cloud storage helper
api/
  onboarding-email.js   # Vercel serverless — Resend welcome email
  send-reminder.js      # Vercel serverless — scheduled compliance reminders
public/
  sw.js         # Service worker v2 (network-first API, cache-first static)
  manifest.json # PWA manifest
```

### Segment system

The app has five customer segments, each with different nav items and feature flags:

```javascript
const SEGMENTS = { otr, fedex, amazon, lastmile, usps }
```

Every segment object has a `features` map (e.g., `loadAnalysis`, `routeProfit`, `brokerScorecard`) that gates which screens appear. A single Clerk organization picks one segment via Settings.

### Data layer

`makeDb(orgId)` returns a storage object that tries Supabase first, then falls back to `localStorage` with `cos_*` prefixes. All data is scoped by Clerk organization ID. The Supabase table is `cos_data` with columns `user_id` (actually org ID), `data_key`, `data_value`. The `KEYS` object in App.jsx lists every valid key (`cos_drivers`, `cos_vehicles`, `cos_compliance`, etc.).

### Authentication

Clerk handles sign-in/sign-up and multi-org. `getOrgId(clerkOrgId)` resolves the org context; users without a Clerk org fall back to an anonymous device ID stored in localStorage.

### AI features

Claude API calls happen **client-side** (not proxied through a backend). Three prompts are used:
- `ANALYZE_PROMPT` — load rate analysis (OTR segment)
- `COMPLIANCE_PROMPT` — DOT/FMCSA Q&A
- `ROUTE_AI_PROMPT` — route profitability scoring

Model: `claude-sonnet-4-20250514`, max_tokens 800–1000.

### App.jsx patterns

- The exported component is `AuthGate`, which conditionally renders the landing page, sign-in, sign-up, or the authenticated app.
- Screen components are defined inline in App.jsx — no separate component files.
- All styles are inline (`style={{...}}`); there are no CSS files.
- Screen-specific logic uses IIFE patterns `(()=>{...})()` with state lifted out to avoid useState-inside-IIFE bugs.
- Vercel cron triggers `api/send-reminder.js` for scheduled compliance email alerts (configured in `vercel.json`).
