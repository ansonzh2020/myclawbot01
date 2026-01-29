# Technical Spec (v1.0)

## 1. Client (iOS)
- SwiftUI
- SwiftData (or Core Data if preferred)
- SIWA (Sign in with Apple) for backend auth
- Local image storage for attachments (FileManager)

### Entities (local)
- Trip
- Expense
- InvoiceAttachment
- CheckIn
- EmergencyContact
- SafetySettings

### Key flows
- Expense CRUD (local)
- Attachment capture/pick → store file path
- Check-in → optional location fetch → persist local record → POST /checkins
- Emergency contacts/settings → PUT /contacts, PUT /safety-settings

## 2. Backend (minimal)
- REST API with JWT auth
- Cron job runner checks overdue users
- Email provider integration (SES/SendGrid)

### Tables
- users
- safety_settings
- emergency_contacts
- checkin_state
- alert_log

## 3. Alert logic
- thresholdHours = 72
- cooldownHours = 24
- includeLocationInAlert: none|approx|precise

## 4. Security
- SIWA token verification
- Rate limits on endpoints
- Abuse controls for email sending
- Audit logs for alert sends

## 5. Compliance
- Account deletion endpoint
- Privacy policy must state what is stored in backend
