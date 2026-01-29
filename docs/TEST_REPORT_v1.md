# Test Report (v1.0) — Touzi

## Build info
- App version: 1.0.0 (scaffold)
- Backend: touzi-backend@0.1.0
- Date: 2026-01-29
- Tester: Echo (CI/local)
- Devices:
  - Backend: Linux (codespaces)
  - iOS: Not executed in this environment (requires macOS/Xcode)

## Summary
- Total test cases (automated): 2 (backend)
- Passed: 2
- Failed: 0
- Blocked: iOS UI/unit tests not executed (macOS/Xcode required)

## Results by area
### Trips/Expenses
- Notes: iOS feature not implemented yet (scaffold only).
- Issues: N/A

### Attachments
- Notes: iOS feature not implemented yet (scaffold only).
- Issues: N/A

### Check-in & Location
- Notes: iOS view scaffolded; backend endpoint covered by automated test.
- Issues: N/A

### Alerts (Email)
- Notes: Logic implemented; requires SMTP credentials to validate end-to-end sending.
- Issues: N/A

### Permissions/Privacy
- Notes: Info.plist usage strings added (Chinese).
- Issues: Needs final review for App Store wording.

### Account deletion
- Notes: Endpoint exists; not covered by automated test yet.
- Issues: Add test coverage.

## Defects
| ID | Severity | Area | Steps | Expected | Actual | Status |
|----|----------|------|-------|----------|--------|--------|
| D-001 | P2 | Backend | Run /v1/account delete flow | Should delete user and related records | Not yet automated tested | Open |

## Sign-off
- Release recommendation: Not ready for App Store; this is a repo scaffold + backend skeleton. Next milestone: implement iOS local data models (Core Data), contacts UI, backend SIWA verification, and end-to-end email sending.
