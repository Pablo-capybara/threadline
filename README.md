# Threadline

A relationship-first CRM for boutique agencies (under 20 people).

## Stack

- Next.js (App Router, TypeScript), Tailwind CSS v4, shadcn/ui on Radix primitives
- Inter via `next/font`
- Design tokens extracted from the Figma "Clients" frame live in `app/globals.css`

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000 (redirects to `/clients`).

## Structure

- `app/(workspace)/` routes share the sidebar + breadcrumb shell. `/clients` is built; the rest are placeholders.
- `lib/data/clients.ts` holds typed mock data (the 10 clients from the Figma frame).
- `lib/data/repository.ts` is the only data access point (`ClientRepository`). Swap the mock for a Supabase
  implementation there; pages and components only see `ClientRow` / `TeamMember`.
- `lib/clients/ask.ts` is the local "Ask Threadline" parser: renewals this month / next N days, stage, owner,
  no contact in N days. Unrecognised text falls back to a text search chip.

## Dates

The mock data is a snapshot from 8 Sep 2026, so "today" is pinned to that date to keep renewal highlights
consistent. Set `NEXT_PUBLIC_TODAY=live` to use the real date. `MOCK_LATENCY_MS` (default 350) controls the
simulated fetch delay that makes the loading skeleton visible.
