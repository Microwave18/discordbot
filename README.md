# DiscordBoto Monorepo

A full-featured Discord bot + web dashboard for link & ticket management, built with Node.js, TypeScript, React, and PostgreSQL. Deployable to Railway.

## Structure
- `apps/backend` — Node.js/TypeScript API, Discord bot, OAuth, DB
- `apps/frontend` — React (Vite) dashboard
- `assets/` — Mascot and shared images

## Quick Start
1. Copy `.env.example` to `.env` and fill in secrets
2. Install dependencies: `npm install`
3. Set up DB: `cd apps/backend && npx prisma migrate dev`
4. Start backend: `cd apps/backend && npm run dev`
5. Start frontend: `cd apps/frontend && npm run dev`

## Deployment
- Designed for Railway (multi-service: backend, frontend, DB)
- Docker support included

## Deploying to Railway (quick guide)

1. Create a new project in Railway and add two services: `backend` and `database` (Postgres). Optionally add Redis as a plugin.
2. Connect your GitHub repository and add the environment variables listed in `.env.example` to the Railway project settings.
3. Set the backend service to run `npm --prefix apps/backend run start` and ensure the `PORT` environment variable is set by Railway.
4. Railway will run `npm install` which will trigger `postinstall` to generate Prisma client and build the frontend during deployment.
5. The backend serves the frontend build automatically when `NODE_ENV` is `production`.

Environment variables required:
- DISCORD_CLIENT_ID
- DISCORD_CLIENT_SECRET
- DISCORD_BOT_TOKEN
- DISCORD_PUBLIC_KEY
- DISCORD_GUILD_ID
- DISCORD_LOG_CHANNEL_ID
- DISCORD_LINKED_ROLE_ID
- DISCORD_TICKET_CATEGORY_ID
- DISCORD_TICKET_ARCHIVE_CHANNEL_ID
- DISCORD_ADMIN_RATING_CHANNEL_ID
- KICK_CLIENT_ID
- KICK_CLIENT_SECRET
- KICK_REDIRECT_URI
- DATABASE_URL
- REDIS_URL (optional)
- FRONTEND_URL
- SESSION_SECRET

After deployment, run Prisma migrations manually or configure a migration step in Railway using `npx prisma migrate deploy`.

Notes:
- Ensure your Discord bot is invited to the specified guild with correct permissions.
- Update `FRONTEND_URL` to your deployed site URL (Railway will provide a URL).
- For development, use local Postgres and Redis or use Railway's dev containers.

Railway setup tips:
- Connect your repository to Railway; set up a single service pointing to the root of the repo.
- Set the "Build Command" to: npm run build
- Set the "Start Command" to: npm run start
- Add environment variables in the Railway settings (see list above).
- For Prisma migrations: create a Railway plugin to run `npx prisma migrate deploy` after database is provisioned.

Automated migrations via GitHub Actions:
 - There's an optional workflow in `.github/workflows/migrate.yml` that runs `npx prisma migrate deploy` using the `DATABASE_URL` secret.
 - You can run it manually via GitHub > Actions > Migrate DB, or enable it to run on every push.

Manual migration on Railway:
 - After the database is provisioned on Railway, run in the Railway console or via an SSH session:

```
npx prisma migrate deploy --schema=apps/backend/prisma/schema.prisma
```

Be sure to set `DATABASE_URL` in Railway secrets before running migrations.
