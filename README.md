# LoreVault

Fan wiki multi-saga. Arcane is the founding shelf; the schema is ready for every universe you obsess over.

## Stack

- Next.js 15 (App Router) + TypeScript + custom CSS
- Prisma + PostgreSQL
- Auth.js (credentials)
- **pnpm**

## Local setup

```bash
pnpm install
pnpm db:up
pnpm db:setup
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Seed accounts:

- `admin@lorevault.app` / `lorevault123` (SUPER_ADMIN)
- `editor@lorevault.app` / `lorevault123` (EDITOR)
- `fan@lorevault.app` / `lorevault123` (USER)

Copy `.env.example` to `.env` if needed. Local Docker Postgres is mapped to **localhost:5433** (to avoid clashing with other Postgres installs on 5432).

## Deploy (Vercel + Neon)

1. Create a Neon Postgres database and copy `DATABASE_URL`.
2. Import the GitHub repo into Vercel.
3. Set env vars: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`.
4. Optional: `BLOB_READ_WRITE_TOKEN` for file uploads (otherwise use image URLs).
5. Deploy. Then run migrations/seed once:

```bash
pnpm exec prisma db push
pnpm db:seed
```

(or `prisma migrate deploy` once you add migration history in CI).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm db:up` | Start Postgres via Docker |
| `pnpm db:setup` | Push schema + seed |
| `pnpm history:build` | Generate simulated commit history (phase 1) |
| `pnpm history:phase2` | Generate phase-2 history (engagement era) |
