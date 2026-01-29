# myclawbot01 / Touzi

Touzi is an iOS app (v1.0) designed for:
- Local-only travel expense tracking (business/personal)
- Receipt attachment (OCR planned)
- Safety check-ins with a reliable **72h** non-check-in alert sent to emergency contacts via **bilingual email**

This repo contains:
- `apps/touzi-ios`: iOS app scaffold (generated via XcodeGen on macOS)
- `apps/touzi-backend`: minimal backend for safety alert emails
- `docs/`: PRD, technical spec, API spec, test plan/templates

## Quick start (backend)
```bash
cd apps/touzi-backend
cp .env.example .env
# fill SMTP + JWT_SECRET
npm i
npm run dev
```

## Docs
- `docs/PRD_v1.md`
- `docs/TECH_SPEC_v1.md`
- `docs/api/openapi_v1.yaml`
- `docs/TEST_PLAN_v1.md`
- `docs/TEST_REPORT_TEMPLATE_v1.md`
- `docs/TEST_REPORT_v1.md`
