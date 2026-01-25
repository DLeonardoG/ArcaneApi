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
