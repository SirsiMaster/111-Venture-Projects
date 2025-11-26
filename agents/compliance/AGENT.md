# Compliance Agent
## Legacy - State-Specific Compliance Domain

**Agent ID:** `compliance`
**Status:** Active
**Owner:** Claude (Stack Leader)

---

## ⚠️ PRE-FLIGHT CHECKLIST (MUST COMPLETE BEFORE CODING)

Before making ANY changes in the Compliance domain, verify:

1. **[ ] Read WARP.md** - Understand governance rules
2. **[ ] Check Auth Agent status** - User state selection must work
3. **[ ] Check Estate Agent status** - Estate state field must be set
4. **[ ] Review current status** - Check "Implemented" section below
5. **[ ] Verify state coverage** - Only IL, MI, MN, DC, VA, MD for MVP
6. **[ ] Check for conflicts** - Are other agents using outdated rules?
7. **[ ] Understand the change** - What specific rule/template is affected?
8. **[ ] Verify legal accuracy** - Has content been reviewed?

**Cross-Agent Impact Check:**
- Will this change affect Estate Agent's phase validation?
- Will this change affect Notify Agent's letter templates?
- Will this change affect LLM Agent's guidance responses?
- Is the legal disclaimer included in all outputs?

**CRITICAL: All legal content must include disclaimer. Verify before proceeding.**

---

## Mission
Provide accurate, state-specific probate guidance, legal templates, and compliance rules for the 6 MVP launch states: Illinois, Michigan, Minnesota, District of Columbia, Virginia, and Maryland.

---

## Domain Ownership

### Firestore Collections
```
/states/{stateCode}
  - name: string
  - code: string (IL, MI, MN, DC, VA, MD)
  - probateThreshold: number (small estate limit)
  - probateCourt: string
  - filingFees: {
      smallEstate: number
      formalProbate: number
      willFiling: number
    }
  - timeframes: {
      creditorClaimPeriod: number (days)
      willFilingDeadline: number (days)
      inventoryDeadline: number (days)
    }
  - requirements: {
      executorBond: boolean
      supervisedAdministration: boolean
      localAttorney: boolean
    }
  - updatedAt: timestamp

/states/{stateCode}/checklists/{checklistId}
  - phase: 'verify' | 'notify' | 'distribute'
  - items: [{
      order: number
      title: string
      description: string
      required: boolean
      deadline: string (relative, e.g., "30 days after death")
      documentType: string (links to vault categories)
    }]

/states/{stateCode}/templates/{templateId}
  - name: string
  - category: 'notification' | 'court_filing' | 'transfer'
  - institution: string (optional)
  - content: string (template with {{variables}})
  - variables: [string]
  - instructions: string
  - createdAt: timestamp
  - updatedAt: timestamp

/institutions/{institutionId}
  - name: string
  - type: 'bank' | 'brokerage' | 'insurance' | 'utility' | 'government'
  - states: [string] (which states this applies to)
  - contactInfo: {
      deathNotification: { phone, email, address, fax }
      forms: [{ name, url }]
    }
  - processingTime: string
  - requiredDocuments: [string]
  - specialInstructions: string
```

### State-Specific Rules

#### Illinois (IL)
```
- Small Estate Threshold: $100,000 (personal property)
- Small Estate Affidavit: Available if no real estate
- Probate Court: Circuit Court, Probate Division
- Executor Bond: Required unless waived in will
- Creditor Claim Period: 6 months
- Independent Administration: Available (preferred)
- Supervised Administration: Available (court oversight)
```

#### Michigan (MI)
```
- Small Estate Threshold: $25,000
- Informal Probate: Available (most common)
- Formal Probate: Required for contested estates
- Probate Court: County Probate Court
- Executor Bond: Required unless waived
- Creditor Claim Period: 4 months
- Personal Representative: Term used instead of Executor
```

#### Minnesota (MN)
```
- Small Estate Threshold: $75,000
- Summary Administration: For estates < threshold
- Informal Probate: Available
- Probate Court: District Court, Probate Division
- Executor Bond: Typically waived
- Creditor Claim Period: 4 months
- Universal Succession: Available for simple estates
```

#### District of Columbia (DC)
```
- Small Estate Threshold: $40,000
- Abbreviated Probate: For small estates
- Standard Probate: For larger estates
- Probate Court: DC Superior Court, Probate Division
- Executor Bond: Required
- Creditor Claim Period: 6 months
- Local Counsel: Recommended
```

#### Virginia (VA)
```
- Small Estate Threshold: $50,000
- Affidavit Process: For estates under threshold
- Probate Court: Circuit Court
- Qualification: Required before acting as Executor
- Commissioner of Accounts: Oversees estate administration
- Creditor Claim Period: 1 year
- Inventory Deadline: 4 months
```

#### Maryland (MD)
```
- Small Estate Threshold: $50,000 (or $100,000 if spouse is sole heir)
- Regular Estate: Standard probate process
- Probate Court: Orphans' Court (most counties) or Circuit Court
- Register of Wills: Files and manages probate
- Executor Bond: Required unless waived
- Creditor Claim Period: 6 months
- Inventory Deadline: 3 months
```

### UI Components
```
/public/compliance/
  ├── state-guide.html      # State-specific guidance
  ├── checklist.html        # Phase checklists
  └── templates.html        # Letter templates

/public/components/compliance/
  ├── state-selector.js
  ├── checklist-tracker.js
  ├── template-generator.js
  └── deadline-calculator.js
```

### Functions
```
/functions/src/compliance/
  ├── getStateRules.ts
  ├── generateChecklist.ts
  ├── calculateDeadlines.ts
  ├── fillTemplate.ts
  └── index.ts
```

---

## Patterns & Standards

### Template Variables
Standard variables available in all templates:
```
{{estate.principalName}}
{{estate.principalDOB}}
{{estate.principalDOD}}
{{estate.principalSSN}} (last 4 only)
{{executor.name}}
{{executor.address}}
{{executor.phone}}
{{heir.name}}
{{asset.accountNumber}}
{{asset.institution}}
{{date.today}}
{{date.deadline}}
```

### Deadline Calculation
All deadlines calculated from:
- Date of death (primary reference)
- Date of qualification (executor appointment)
- Date of first publication (creditor notice)

### Compliance Validation
Before allowing phase transitions:
1. Verify required documents uploaded
2. Confirm deadlines not exceeded
3. Check state-specific requirements met
4. Generate compliance report

### Legal Disclaimers
ALL outputs must include:
- "This is not legal advice"
- "Consult with a licensed attorney in your state"
- "Laws may have changed since this content was created"

---

## Integration Points

### Depends On
- Auth Agent (user state selection)
- Estate Agent (estate state, phase)

### Depended On By
- Estate Agent (validation rules)
- Notify Agent (templates)
- LLM Agent (guidance content)

---

## Testing Requirements
- Unit: Deadline calculations, template filling
- Content: Legal accuracy review (external)
- Integration: Full checklist flow per state

---

## Current Status

### Implemented
- [ ] State rules Firestore schema
- [ ] Illinois rules and templates
- [ ] Michigan rules and templates
- [ ] Minnesota rules and templates
- [ ] DC rules and templates
- [ ] Virginia rules and templates
- [ ] Maryland rules and templates
- [ ] Institution database (top 50)
- [ ] Checklist generator
- [ ] Template generator
- [ ] Deadline calculator

### Blockers
- Requires legal review before production use

### Next Actions
1. Research and document IL probate rules
2. Research and document MI probate rules
3. Research and document MN probate rules
4. Research and document DC probate rules
5. Research and document VA probate rules
6. Research and document MD probate rules
7. Build institution database for 6 states

---

## Changelog
| Date | Change |
|------|--------|
| 2025-11-26 | Agent created with 6-state scope |
