# PRD (v1.0) — Touzi (Local-first Travel Expenses + Safety Check‑in)

## 1. Overview
An iOS app for travelers to:
- Track travel expenses (business/personal) locally on-device
- Attach receipts/invoices (OCR planned for later)
- Perform safety check-ins; if the user has not checked in for **72 hours**, the system emails emergency contacts via a minimal backend

**v1.0 principle:** Expense and receipt data stay **local-only**. The backend stores only the minimum data required to deliver safety alerts.

## 2. Goals / Non-goals
### Goals (v1.0)
1. Local travel expense tracking by trip
2. Simple reporting (basic totals; export optional)
3. Safety check-in with optional location capture
4. Reliable 72h non-check-in alert via email to multiple emergency contacts
5. App Store ready: clear permission prompts, privacy controls, account deletion

### Non-goals (v1.0)
- Cloud sync/storage for expenses
- SMS alerts (planned v2)
- Fully automatic check-in (planned v2)
- Advanced OCR field extraction (planned v1.1/v2)

## 3. Target users & scenarios
- Frequent travelers tracking reimbursable business expenses
- Personal travelers tracking budgets
- Solo travelers wanting a lightweight safety net via emergency contacts

Key scenarios:
1) Create a Trip → add Expenses (business/personal) → review totals
2) Scan/attach a receipt image to an expense
3) Daily/anytime Check-in; optionally record location
4) User forgets to check in → after 72h backend emails emergency contacts

## 4. Product requirements
### 4.1 Trips
- Create / edit / archive trips
- Trip fields: name, start/end date (optional), base currency

### 4.2 Expenses
- Add/edit/delete expense
- Fields: amount, currency, date, category, business/personal, reimbursable, merchant (optional), notes
- Attachments: add photo/scan to an expense
- List + filters: by category, by type (business/personal), date range
- Basic summary: totals by type and category (per trip)

### 4.3 Receipt attachments (v1.0)
- Capture via camera or pick from library
- Store image locally (not in backend)
- Optional OCR text storage (raw) — can be stubbed in v1.0

### 4.4 Safety check-in
- Check-in at any time
- Stores timestamp; location capture depends on user permission and chosen sharing mode

**LocationShareMode**
- none: no location stored
- approx: store coarse location (client-side blurred)
- precise: store exact coordinates + accuracy

User controls:
- Default share mode configurable
- For alerts (email), user chooses whether to include location (none/approx/precise)

### 4.5 Emergency contacts
- Multiple contacts (recommended limit 3–5)
- Fields: name, relation, email, enabled
- Test email function (recommended)

### 4.6 Alerts (backend)
- Condition: now - lastCheckInAt >= 72 hours AND alertsEnabled AND at least one enabled contact
- Cooldown: at most once per 24 hours per user until next check-in
- Email content: last check-in time; include location only per user policy

### 4.7 Settings
- Alerts enabled on/off
- Alert location inclusion policy (none/approx/precise)
- Show current last check-in time
- Account: sign-in status; delete account

## 5. Permissions & UX copy requirements (App Store)
- Location: requested when enabling location for check-in
- Notifications: requested when enabling reminders (optional)
- Camera/Photos: requested when adding receipt attachment

Must include user-facing rationale strings (Info.plist) aligned with actual behavior.

## 6. Data & privacy
### Local-only data (device)
- Trips, expenses, attachments, OCR text

### Backend-stored data (minimal)
- User identifier (SIWA)
- Safety settings
- Emergency contacts (emails)
- Last check-in time; optional last location depending on policy
- Alert logs for dedupe

### User controls
- Toggle alerts
- Set location share mode
- Delete account and backend data

## 7. Success metrics (v1.0)
- User can create trip and add expenses without crashes
- Check-in reliably updates backend state
- Alert email sends in test environment; dedupe works
- Permissions are understandable; privacy disclosures complete

## 8. Risks
- App Store review sensitivity around location + “safety” claims
- Email deliverability and abuse prevention
- Battery/privacy concerns from location capture

## 9. Roadmap
- v1.1: OCR parsing into expense draft; export CSV/PDF; richer analytics
- v2: Cloud sync + subscription; SMS alerts; automatic check-in options
