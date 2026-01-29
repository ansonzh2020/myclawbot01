# Touzi Backend (v1.0)

Minimal backend for safety alerts (email) only.

## What it stores (v1)
- SIWA user id mapping (stub in this repo)
- Safety settings
- Emergency contact emails
- Last check-in timestamp (+ optional location)
- Alert logs (dedupe)

## Run locally
```bash
cp .env.example .env
# fill SMTP + JWT_SECRET
npm i
npm run dev
```

Health check: http://localhost:8787/health

## Notes
- SIWA verification is stubbed for now (identityToken treated as stable string).
- For production, implement Apple JWT verification (JWKS) and persist to Postgres.
