# Auth Agent
## Legacy - Authentication & Identity Domain

**Agent ID:** `auth`
**Status:** Active
**Owner:** Claude (Stack Leader)

---

## ⚠️ PRE-FLIGHT CHECKLIST (MUST COMPLETE BEFORE CODING)

Before making ANY changes in the Auth domain, verify:

1. **[ ] Read WARP.md** - Understand governance rules
2. **[ ] Check dependencies** - Auth has no dependencies (root agent)
3. **[ ] Review current status** - Check "Implemented" section below
4. **[ ] Verify Firebase state** - Is Auth enabled? Run: `firebase auth:export --help`
5. **[ ] Check for conflicts** - Are other agents touching user data?
6. **[ ] Understand the change** - What specific feature/fix is requested?
7. **[ ] Plan the change** - What files will be modified? What tests needed?

**Cross-Agent Impact Check:**
- Will this change affect Estate Agent's user lookups?
- Will this change affect Vault Agent's permission checks?
- Will this change affect Notify Agent's contact info?

**If any dependency is unclear, STOP and ask before proceeding.**

---

## Mission
Secure, seamless identity management for all Legacy users across Principal, Executor, and Heir roles.

---

## Domain Ownership

### Firestore Collections
```
/users/{userId}
  - email: string
  - displayName: string
  - photoURL: string (optional)
  - role: 'principal' | 'executor' | 'heir' | 'admin'
  - mfaEnabled: boolean
  - emailVerified: boolean
  - createdAt: timestamp
  - lastLoginAt: timestamp
  - profile: {
      phone: string (optional)
      dateOfBirth: date (optional)
      address: { street, city, state, zip }
    }

/sessions/{sessionId}
  - userId: string
  - deviceInfo: { platform, browser, ip }
  - createdAt: timestamp
  - expiresAt: timestamp
  - isActive: boolean
```

### Firebase Services
- Firebase Authentication (email/password, Google OAuth, Apple Sign-In)
- Firebase Security Rules (user document access)
- Cloud Functions: `onUserCreate`, `onUserDelete`, `verifyMFA`

### UI Components
```
/public/auth/
  ├── login.html
  ├── register.html
  ├── forgot-password.html
  ├── verify-email.html
  └── mfa-setup.html

/public/components/auth/
  ├── auth-form.js
  ├── auth-guard.js
  └── session-manager.js
```

### Functions
```
/functions/src/auth/
  ├── onCreate.ts        # New user setup
  ├── onDelete.ts        # Cleanup on user deletion
  ├── verifyMFA.ts       # TOTP verification
  ├── sendVerification.ts
  └── index.ts           # Exports
```

---

## Patterns & Standards

### Authentication Flow
1. User submits credentials → Firebase Auth
2. On success → Create/update `/users/{uid}` document
3. Generate session → Store in `/sessions/{sessionId}`
4. Return JWT + session token to client
5. Client stores in secure httpOnly cookie (web) or secure storage (PWA)

### Security Requirements
- Passwords: 12+ characters, complexity requirements
- MFA: Required for Executors accessing estates >$100K
- Sessions: 30-minute inactivity timeout, 7-day max lifetime
- Rate limiting: 5 failed attempts → 15-minute lockout

### Role Definitions
| Role | Description | Permissions |
|------|-------------|-------------|
| `principal` | Estate owner, planning phase | Full access to own estate |
| `executor` | Manages estate after death | Access after verification |
| `heir` | Receives assets | Read-only until distribution |
| `admin` | Legacy staff | Platform administration |

---

## Integration Points

### Depends On
- None (root domain)

### Depended On By
- Estate Agent (user ownership)
- Vault Agent (document permissions)
- Notify Agent (user contact info)
- Compliance Agent (identity verification)
- LLM Agent (personalization)

---

## Testing Requirements
- Unit: Firebase Auth mocking, token validation
- Integration: Full auth flow (register → verify → login → MFA)
- Security: Penetration testing on auth endpoints

---

## Current Status

### Implemented
- [ ] Firebase Auth enabled in console ← **YOU MUST DO THIS**
- [ ] Email/password provider ← **YOU MUST DO THIS**
- [ ] Google OAuth provider ← **YOU MUST DO THIS**
- [x] User Firestore schema (defined in rules)
- [x] Security rules for /users
- [x] Login UI (`/public/auth/login.html`)
- [x] Register UI (`/public/auth/register.html`)
- [ ] Password reset flow
- [ ] MFA setup

### Blockers
- **MANUAL ACTION REQUIRED:** Enable Firebase Auth providers in console

### Next Actions
1. **YOU:** Go to https://console.firebase.google.com/project/legacy-estate-os/authentication/providers
2. **YOU:** Enable "Email/Password" provider
3. **YOU:** Enable "Google" provider (add authorized domains)
4. **YOU:** Deploy rules: `firebase deploy --only firestore:rules`
5. Test login/register at /auth/login.html

---

## Changelog
| Date | Change |
|------|--------|
| 2025-11-26 | Agent created |
| 2025-11-26 | Login UI created (`/public/auth/login.html`) |
| 2025-11-26 | Register UI created (`/public/auth/register.html`) |
| 2025-11-26 | Firestore security rules written for all agents |
