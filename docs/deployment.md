# Deployment Guide

## Required Services

- Vercel for hosting
- Supabase PostgreSQL for production database
- Cloudinary for project images, certificates, and resume files
- Resend for transactional email
- Google Cloud service account with Calendar API enabled

## Environment Variables

Use `D:\sudheer_kumar_portfolio\.env.example` as the source template.

Required for production:

```text
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
PUBLIC_SITE_URL
ADMIN_EMAIL
ADMIN_PASSWORD
```

Required for optional integrations:

```text
RESEND_API_KEY
EMAIL_FROM
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_CALENDAR_ID
OPENAI_API_KEY
```

## Supabase Setup

1. Create a Supabase project.
2. Copy the pooled PostgreSQL connection string into `DATABASE_URL`.
3. Run `npm run db:deploy` from CI or a trusted deployment shell.
4. Run `npm run db:seed` once to create the first admin user and default availability.

## Vercel Setup

1. Import the GitHub repository into Vercel.
2. Set all production environment variables.
3. Use the default Next.js framework settings.
4. Keep the build command as `prisma generate && next build`.

## Local Docker Setup

```bash
docker compose up --build
```

Then open `http://localhost:3000`.

## Release Checklist

- Environment variables configured
- Database migrations deployed
- Admin user seeded
- Cloudinary upload credentials tested
- Resend sender domain verified
- Google Calendar service account granted calendar access
- CI passing
- Lighthouse audit completed
