# Next.js + Supabase Blogging Platform

Full-stack blogging platform with:
- Email/password authentication (signup/login)
- Role-based access (`viewer`, `author`, `admin`)
- Create/edit posts
- Comments
- AI post summary generation using Google Gemini API

## Stack
- Next.js App Router + TypeScript
- Supabase (Auth + Postgres + RLS)
- Server Actions + Route Handlers

## Folder structure
```text
src/
  app/
    actions/              # server actions (auth, posts, comments)
    api/posts/summary     # Google AI summary endpoint
    admin/users           # admin role management
    dashboard             # signed-in user dashboard
    login, signup, logout
    posts/[slug], posts/new
  components/
    comments/
    posts/
  lib/
    supabase/
    auth, posts, comments, ai, env, types
supabase/schema.sql       # tables, RLS, policies, triggers
```

## 1. Install
```bash
npm install
```

## 2. Environment
Copy `.env.example` to `.env.local` and set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_API_KEY`
- `GOOGLE_MODEL` (optional, default `gemini-2.0-flash`)

## 3. Supabase SQL
Run `supabase/schema.sql` in the Supabase SQL editor.

## 4. Run
```bash
npm run dev
```
Open http://localhost:3000

## Notes
- New users default to `viewer`. Promote users to `author`/`admin` from the admin page.
- RLS and server-side authorization are both enforced.
