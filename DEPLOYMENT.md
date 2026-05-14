# Code On The Go Deployment

## Required Vercel Environment Variables

Set these in Vercel Project Settings -> Environment Variables before deploying the backend commits.

```txt
DATABASE_URL=...
APP_JWT_SECRET=...
APP_ENCRYPTION_KEY=...
APP_BASE_URL=https://code-on-the-go-eight.vercel.app
ALLOW_TEST_AI=false
ALLOW_TEST_PAYMENTS=true
```

`DATABASE_URL` can be a Vercel Postgres, Neon, Supabase, or other Postgres connection string. If Vercel creates `POSTGRES_URL` instead, the app will use that automatically.

`APP_JWT_SECRET` signs login cookies. `APP_ENCRYPTION_KEY` encrypts each user's saved OpenAI API key. Keep both stable after launch or users will be signed out and saved API keys cannot be decrypted.

## Optional AI Variables

```txt
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Leave `OPENAI_API_KEY` empty if users will bring their own API key from the Profile screen. If you add your own platform key later, the backend will use the user's saved key first and fall back to the platform key.

## Optional Stripe Variables

```txt
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_STUDIO=
```

Stripe payout and banking details belong in the Stripe dashboard, not in this app or in Vercel env vars.

When real payments are ready, set `ALLOW_TEST_PAYMENTS=false`.

## Optional PayPoint Variables

```txt
PAYPOINT_API_KEY=
PAYPOINT_ENTRY_ID=
PAYPOINT_BASE_URL=
```

PayPoint payout or banking details should be configured inside PayPoint. The app only needs API credentials and provider-specific checkout details.
