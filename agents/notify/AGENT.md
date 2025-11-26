# Notify Agent
## Legacy - Communications Domain

**Agent ID:** `notify`
**Status:** Active
**Owner:** Claude (Stack Leader)

---

## ⚠️ PRE-FLIGHT CHECKLIST (MUST COMPLETE BEFORE CODING)

Before making ANY changes in the Notify domain, verify:

1. **[ ] Read WARP.md** - Understand governance rules
2. **[ ] Check Auth Agent status** - User contact info must be available
3. **[ ] Check Estate Agent status** - Estate events trigger notifications
4. **[ ] Check Vault Agent status** - Document attachments for letters
5. **[ ] Check Compliance Agent status** - Templates must be loaded
6. **[ ] Review current status** - Check "Implemented" section below
7. **[ ] Verify API keys** - SendGrid, FCM, Twilio configured?
8. **[ ] Check for conflicts** - Rate limits, duplicate sends?

**Cross-Agent Impact Check:**
- Are user preferences respected (Auth Agent)?
- Is estate phase correct for this notification (Estate Agent)?
- Are all required documents attached (Vault Agent)?
- Is the correct state template used (Compliance Agent)?

**CRITICAL: Never send without user consent. Check preferences first.**

---

## Mission
Manage all platform communications including email notifications, push notifications, SMS alerts, and formal letter generation for institution notifications.

---

## Domain Ownership

### Firestore Collections
```
/notifications/{notificationId}
  - userId: string (recipient)
  - estateId: string (optional)
  - type: 'email' | 'push' | 'sms' | 'in_app'
  - category: 'system' | 'estate' | 'deadline' | 'document' | 'action_required'
  - title: string
  - body: string
  - data: object (additional payload)
  - status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
  - scheduledFor: timestamp (optional)
  - sentAt: timestamp
  - readAt: timestamp (optional)
  - error: string (if failed)
  - createdAt: timestamp

/estates/{estateId}/letters/{letterId}
  - type: 'death_notification' | 'account_freeze' | 'transfer_request' | 'creditor_notice'
  - institutionId: string
  - templateId: string
  - status: 'draft' | 'generated' | 'sent' | 'acknowledged' | 'completed'
  - generatedContent: string (filled template)
  - attachments: [documentId references]
  - trackingNumber: string (if mailed)
  - sentVia: 'email' | 'mail' | 'fax' | 'portal'
  - sentAt: timestamp
  - acknowledgedAt: timestamp
  - response: string (optional)
  - createdAt: timestamp
  - updatedAt: timestamp

/user-preferences/{userId}
  - email: {
      enabled: boolean
      frequency: 'immediate' | 'daily_digest' | 'weekly_digest'
      categories: [string]
    }
  - push: {
      enabled: boolean
      token: string (FCM token)
      categories: [string]
    }
  - sms: {
      enabled: boolean
      phone: string
      categories: [string] (limited to critical)
    }
```

### Firebase Services
- Firebase Cloud Messaging (push notifications)
- Cloud Functions: `sendNotification`, `generateLetter`, `scheduleReminder`
- SendGrid (email delivery)
- Twilio (SMS - critical alerts only)

### UI Components
```
/public/notifications/
  ├── inbox.html            # Notification center
  ├── preferences.html      # Notification settings
  └── letters.html          # Letter tracking

/public/components/notify/
  ├── notification-bell.js
  ├── notification-card.js
  ├── letter-generator.js
  ├── letter-tracker.js
  └── preference-form.js
```

### Functions
```
/functions/src/notify/
  ├── sendEmail.ts
  ├── sendPush.ts
  ├── sendSMS.ts
  ├── generateLetter.ts
  ├── scheduleReminder.ts
  ├── processDeadlines.ts   # Scheduled function
  └── index.ts
```

---

## Patterns & Standards

### Notification Categories
| Category | Channels | Priority |
|----------|----------|----------|
| `action_required` | Email + Push + SMS | High |
| `deadline` | Email + Push | High |
| `estate` | Email + Push | Medium |
| `document` | Email + In-App | Medium |
| `system` | Email | Low |

### Email Templates
```
/functions/src/notify/templates/
  ├── welcome.html
  ├── email-verification.html
  ├── password-reset.html
  ├── executor-invitation.html
  ├── heir-notification.html
  ├── deadline-reminder.html
  ├── phase-transition.html
  └── letter-sent-confirmation.html
```

### Push Notification Format
```json
{
  "notification": {
    "title": "Action Required",
    "body": "Your estate has a deadline in 7 days"
  },
  "data": {
    "type": "deadline",
    "estateId": "abc123",
    "action": "open_estate"
  }
}
```

### Letter Generation Flow
1. User selects institution and letter type
2. System loads template from Compliance Agent
3. Fill template with estate/asset data
4. User reviews and edits
5. Attach required documents from Vault
6. Generate PDF
7. Track delivery method (email/mail/fax)
8. Monitor for acknowledgment

### Delivery Tracking
- Email: SendGrid webhooks (delivered, opened, bounced)
- Push: FCM delivery receipts
- Mail: Optional tracking number entry
- All: In-app read receipts

### Rate Limits
- Email: 100/user/day
- Push: 50/user/day
- SMS: 5/user/day (critical only)

---

## Integration Points

### Depends On
- Auth Agent (user contact info, FCM tokens)
- Estate Agent (estate events, phase changes)
- Vault Agent (document attachments)
- Compliance Agent (letter templates)

### Depended On By
- LLM Agent (notification content suggestions)

---

## Testing Requirements
- Unit: Template rendering, scheduling logic
- Integration: Full notification flow (trigger → delivery)
- E2E: Letter generation → PDF → tracking

---

## Current Status

### Implemented
- [ ] Notification Firestore schema
- [ ] Letter Firestore schema
- [ ] SendGrid integration
- [ ] FCM integration
- [ ] Email templates
- [ ] Push notification system
- [ ] Letter generator
- [ ] Notification inbox UI
- [ ] Preference management

### Blockers
- SendGrid API key required
- FCM configuration required

### Next Actions
1. Set up SendGrid account and API key
2. Configure FCM in Firebase console
3. Create email templates
4. Build notification inbox UI
5. Build letter generator

---

## Changelog
| Date | Change |
|------|--------|
| 2025-11-26 | Agent created |
