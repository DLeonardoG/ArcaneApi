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

- `admin@lorevault.app` / `lorevault123` (ADMIN)
- `editor@lorevault.app` / `lorevault123` (EDITOR)

Copy `.env.example` to `.env` if needed. Local Docker Postgres is mapped to **localhost:5433** (to avoid clashing with other Postgres installs on 5432).

## Deploy (Vercel + Neon)