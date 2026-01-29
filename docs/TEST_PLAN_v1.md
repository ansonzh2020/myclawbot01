# Test Plan (v1.0)

## 1. Scope
Covers iOS app (local expense tracking + check-in) and minimal backend alerting (email).

## 2. Test types
- Functional tests (manual + unit)
- Integration tests (client↔backend)
- Permission/privacy tests (App Store readiness)
- Reliability tests (alert dedupe/cooldown)

## 3. Environments
- iOS simulator + at least 1 physical device
- Backend staging environment with email sandbox

## 4. Test cases (high level)
### Trips/Expenses
1. Create/edit/delete Trip
2. Add expense with required fields; verify list update and totals
3. Filters (category, business/personal)
4. Attachment add/remove; image file persists across relaunch

### Check-in
1. Check-in with locationShareMode none (no location saved)
2. Check-in with approx (blurred coords saved)
3. Check-in with precise (coords + accuracy saved)
4. Permission denied: check-in still records timestamp; UI explains missing location

### Contacts & settings
1. Add multiple contacts; disable one; sync to backend
2. Toggle alerts enabled; verify backend updated
3. Change includeLocationInAlert policy; verify applied in alert email

### Backend alerts
1. Overdue user triggers email to enabled contacts
2. Cooldown prevents repeat within 24h
3. New check-in clears overdue status; no further emails
4. Invalid email rejected / handled

### Account deletion
1. Delete account removes backend data; app reflects signed-out state

## 5. Acceptance criteria
- No P0 crashes across core flows
- Alert emails send correctly with correct policy
- Dedupe/cooldown works
- Privacy disclosures accurate
