# Estate Agent
## Legacy - Estate Management Domain

**Agent ID:** `estate`
**Status:** Active
**Owner:** Claude (Stack Leader)

---

## ⚠️ PRE-FLIGHT CHECKLIST (MUST COMPLETE BEFORE CODING)

Before making ANY changes in the Estate domain, verify:

1. **[ ] Read WARP.md** - Understand governance rules
2. **[ ] Check Auth Agent status** - User auth must be working first
3. **[ ] Check Compliance Agent** - State rules loaded for estate's state?
4. **[ ] Review current status** - Check "Implemented" section below
5. **[ ] Verify Firestore state** - Run: `firebase firestore:indexes`
6. **[ ] Check for conflicts** - Are other agents touching estate data?
7. **[ ] Understand the change** - What specific feature/fix is requested?
8. **[ ] Plan the change** - What files will be modified? What tests needed?

**Cross-Agent Impact Check:**
- Will this change affect Vault Agent's document linking?
- Will this change affect Notify Agent's letter generation?
- Will this change affect LLM Agent's context building?
- Does this require new Compliance rules for the estate's state?

**If any dependency is unclear, STOP and ask before proceeding.**

---

## Mission
Manage the complete lifecycle of estates from creation through distribution, including assets, beneficiaries, and the 4-phase protocol (Intake → Verify → Notify → Distribute).

---

## Domain Ownership

### Firestore Collections
```
/estates/{estateId}
  - principalId: string (userId of owner)
  - name: string
  - status: 'planning' | 'intake' | 'verify' | 'notify' | 'distribute' | 'closed'
  - phase: {
      current: string
      startedAt: timestamp
      completedPhases: array
    }
  - executors: [{
      userId: string
      name: string
      email: string
      phone: string
      isPrimary: boolean
      acceptedAt: timestamp (optional)
    }]
  - estimatedValue: number
  - state: string (IL, MI, MN, DC, VA, MD)
  - createdAt: timestamp
  - updatedAt: timestamp
  - deathVerifiedAt: timestamp (optional)
  - closedAt: timestamp (optional)

/estates/{estateId}/assets/{assetId}
  - category: 'financial' | 'real_estate' | 'vehicle' | 'digital' | 'personal'
  - name: string
  - description: string
  - estimatedValue: number
  - accountNumber: string (optional, encrypted)
  - institution: string (optional)
  - documents: [documentId references]
  - beneficiaries: [{
      heirId: string
      percentage: number
      conditions: string (optional)
    }]
  - status: 'active' | 'transferred' | 'liquidated'
  - createdAt: timestamp
  - updatedAt: timestamp

/estates/{estateId}/heirs/{heirId}
  - userId: string (if registered)
  - name: string
  - email: string
  - phone: string
  - relationship: string
  - address: { street, city, state, zip }
  - identityVerified: boolean
  - acceptedInheritance: boolean (optional)
  - createdAt: timestamp

/estates/{estateId}/timeline/{eventId}
  - type: 'phase_change' | 'asset_added' | 'document_uploaded' | 'notification_sent' | etc.
  - description: string
  - actorId: string (userId)
  - metadata: object
  - createdAt: timestamp
```

### Firebase Services
- Firestore (estate data)
- Cloud Functions: `onEstateCreate`, `onPhaseChange`, `calculateEstateValue`

### UI Components
```
/public/portals/
  ├── principal/
  │   ├── dashboard.html
  │   ├── assets.html
  │   ├── beneficiaries.html
  │   └── executors.html
  ├── executor/
  │   ├── dashboard.html
  │   ├── verify.html
  │   ├── notify.html
  │   └── distribute.html
  └── heir/
      ├── dashboard.html
      └── inheritance.html

/public/components/estate/
  ├── asset-card.js
  ├── asset-form.js
  ├── heir-card.js
  ├── phase-tracker.js
  └── timeline.js
```

### Functions
```
/functions/src/estate/
  ├── onCreate.ts
  ├── onPhaseChange.ts
  ├── calculateValue.ts
  ├── transferAsset.ts
  └── index.ts
```

---

## Patterns & Standards

### Estate Lifecycle
```
PLANNING → INTAKE → VERIFY → NOTIFY → DISTRIBUTE → CLOSED
    ↑         ↑        ↑         ↑          ↑
 Principal  Death   Executor  Letters    Assets
  builds   occurs   confirms   sent    transferred
```

### Asset Categories
| Category | Examples | Special Handling |
|----------|----------|------------------|
| `financial` | Bank accounts, investments, retirement | Institution templates |
| `real_estate` | Homes, land, commercial | Deed transfer, title |
| `vehicle` | Cars, boats, aircraft | Title transfer, DMV |
| `digital` | Crypto, domains, accounts | Access credentials |
| `personal` | Jewelry, art, collectibles | Appraisal, physical transfer |

### Access Control
- **Planning phase:** Only Principal
- **Intake phase:** Principal + designated Executors
- **Verify phase:** Executors only (Principal deceased)
- **Notify/Distribute:** Executors + read-only for Heirs

### Validation Rules
- Estate must have at least 1 Executor
- Asset values must be positive numbers
- Beneficiary percentages must sum to 100% per asset
- State must be one of: IL, MI, MN, DC, VA, MD

---

## Integration Points

### Depends On
- Auth Agent (user identity, roles)
- Compliance Agent (state-specific rules)

### Depended On By
- Vault Agent (document associations)
- Notify Agent (notification triggers)
- LLM Agent (workflow guidance)

---

## Testing Requirements
- Unit: Asset CRUD, value calculations, percentage validation
- Integration: Full estate lifecycle flow
- E2E: Principal creates estate → death → Executor completes

---

## Current Status

### Implemented
- [ ] Estate Firestore schema
- [ ] Asset Firestore schema
- [ ] Heir Firestore schema
- [ ] Security rules for estates
- [ ] Principal dashboard
- [ ] Asset management UI
- [ ] Beneficiary designation UI
- [ ] Executor dashboard
- [ ] Phase tracker component

### Blockers
- Auth Agent must be complete first

### Next Actions
1. Create Firestore collections
2. Write security rules
3. Build Principal dashboard
4. Build asset management

---

## Changelog
| Date | Change |
|------|--------|
| 2025-11-26 | Agent created |
