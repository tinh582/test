# Vercel Deployment

This repository contains three separate apps:

- `Frontend`: React + Vite frontend
- `my-app`: Next.js app with MySQL-backed API
- `my-app/expense-manager`: another Next.js app

Vercel should deploy each app as its own project. Point each project at the corresponding folder as the root directory.

## Recommended setup

1. Create a Vercel project for `Frontend`.
1. Create a Vercel project for `my-app`.
1. Optionally create a Vercel project for `my-app/expense-manager` if you want that app live too.

## Environment variables

`Frontend` needs the live backend URL:

- `VITE_API_URL=https://<your-my-app-project>.vercel.app/api`

`my-app` and `expense-manager` need a real MySQL host that is reachable from Vercel:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Vercel cannot run the local Docker MySQL container from this repository. You must use an external MySQL service or a managed database provider.

## Deploy order

1. Deploy the Next.js backend first.
1. Copy the deployed backend URL into `Frontend` as `VITE_API_URL`.
1. Deploy the Vite frontend after the backend URL is known.

## Notes

- The Docker setup in the repo is for local development.
- The schema bootstrap in `my-app` will create the expected tables on first request if the database starts empty.
- If you deploy `expense-manager`, use the same MySQL environment variables as `my-app`.