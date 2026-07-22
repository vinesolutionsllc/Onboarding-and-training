# Vine Solutions Operations Hub

A premium client onboarding and employee training portal for Vine Solutions. The client workflow includes a company introduction, secure account creation, automatic saving, self-completing information checks, and an administrator export dashboard.

## What is included

- Public landing page with Client Onboarding and Employee Training routes
- Vine Solutions company introduction before client onboarding
- Supabase email/password client accounts
- Client data isolated with PostgreSQL Row Level Security
- Information fields that check themselves when completed
- Automatic progress calculation and background saving
- Administrator-only client search and CSV downloads named by DSP company
- Responsive desktop, tablet, and mobile layouts
- GitHub Actions deployment to GitHub Pages

## Required folder structure

Upload the complete source repository with its folders intact. The important structure is:

```text
.github/
  workflows/
    deploy-pages.yml
app/
  client-portal.tsx
  globals.css
  layout.tsx
  page.tsx
  supabase.ts
github-pages/
  entry.tsx
  index.html
  vite.config.ts
public/
  vine-solutions-logo.png
supabase/
  schema.sql
  promote-admin.sql
package.json
package-lock.json
README.md
```

Do not flatten the folders. Do not upload `node_modules`, `.env`, `work`, `outputs`, `.next`, or `github-pages-dist`.

## Production setup

Follow `Supabase-and-GitHub-Setup-Guide.md` supplied with the project. In summary:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Add the GitHub Pages URL to Supabase Authentication URL Configuration.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as GitHub Actions repository secrets.
5. Set GitHub Pages source to **GitHub Actions**.
6. Upload or push the complete source with folders intact.
7. Create the administrator user and run `supabase/promote-admin.sql` with that email.

Use only the Supabase publishable key in GitHub. Never expose a service-role key in a browser deployment.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

For local authentication, copy `.env.example` to `.env.local` and replace both placeholder values with your Supabase Project URL and publishable key.

## Production builds

```bash
npm run build:github-pages
```

The GitHub Pages result is written to `github-pages-dist/`. The GitHub Actions workflow builds and deploys this automatically after every push to `main`.
