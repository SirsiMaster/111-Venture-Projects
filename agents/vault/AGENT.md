# Vault Agent
## Legacy - Document Management Domain

**Agent ID:** `vault`
**Status:** Active
**Owner:** Claude (Stack Leader)

---

## ⚠️ PRE-FLIGHT CHECKLIST (MUST COMPLETE BEFORE CODING)

Before making ANY changes in the Vault domain, verify:

1. **[ ] Read WARP.md** - Understand governance rules
2. **[ ] Check Auth Agent status** - User auth must be working for permissions
3. **[ ] Check Estate Agent status** - Estate context needed for document linking
4. **[ ] Review current status** - Check "Implemented" section below
5. **[ ] Verify Storage state** - Run: `firebase storage:rules:get`
6. **[ ] Check for conflicts** - Are other agents touching documents?
7. **[ ] Understand the change** - What specific feature/fix is requested?
8. **[ ] Plan the change** - What files will be modified? What tests needed?

**Cross-Agent Impact Check:**
- Will this change affect Compliance Agent's document verification?
- Will this change affect Notify Agent's letter attachments?
- Will this change affect LLM Agent's document analysis?
- Are Storage security rules updated for this change?

**If any dependency is unclear, STOP and ask before proceeding.**

---

## Mission
Secure, encrypted document storage with OCR extraction, version control, and granular access permissions for sensitive estate documents.

---

## Domain Ownership

### Firestore Collections
```
/estates/{estateId}/documents/{documentId}
  - name: string
  - description: string
  - category: 'legal' | 'financial' | 'identity' | 'property' | 'medical' | 'other'
  - subcategory: string (e.g., 'will', 'deed', 'death_certificate')
  - mimeType: string
  - size: number (bytes)
  - storagePath: string (Cloud Storage path)
  - thumbnailPath: string (optional)
  - encryptionKeyId: string
  - ocrStatus: 'pending' | 'processing' | 'complete' | 'failed'
  - ocrText: string (extracted text, searchable)
  - extractedData: {
      dates: array
      names: array
      accountNumbers: array
      amounts: array
    }
  - versions: [{
      versionId: string
      storagePath: string
      uploadedAt: timestamp
      uploadedBy: string
    }]
  - linkedAssets: [assetId references]
  - accessLog: [{
      userId: string
      action: 'view' | 'download' | 'share'
      timestamp: timestamp
    }]
  - createdAt: timestamp
  - updatedAt: timestamp
  - uploadedBy: string (userId)

/document-shares/{shareId}
  - documentId: string
  - estateId: string
  - sharedBy: string (userId)
  - sharedWith: string (email or userId)
  - permission: 'view' | 'download'
  - expiresAt: timestamp
  - accessCode: string (hashed, for external shares)
  - createdAt: timestamp
```

### Cloud Storage Structure
```
/estates/{estateId}/documents/
  ├── {documentId}/
  │   ├── original/
  │   │   └── v1_filename.pdf
  │   │   └── v2_filename.pdf
  │   └── thumbnails/
  │       └── thumb_256.jpg
  └── temp/
      └── uploads/
```

### Firebase Services
- Cloud Storage for Firebase (encrypted at rest)
- Cloud Functions: `onDocumentUpload`, `processOCR`, `generateThumbnail`
- Document AI / Textract (OCR processing)

### UI Components
```
/public/vault/
  ├── index.html          # Document browser
  ├── upload.html         # Upload interface
  └── viewer.html         # Document viewer

/public/components/vault/
  ├── document-card.js
  ├── document-uploader.js
  ├── document-viewer.js
  ├── folder-tree.js
  └── ocr-results.js
```

### Functions
```
/functions/src/vault/
  ├── onUpload.ts         # Trigger on storage upload
  ├── processOCR.ts       # Extract text from documents
  ├── generateThumbnail.ts
  ├── shareDocument.ts
  ├── deleteDocument.ts
  └── index.ts
```

---

## Patterns & Standards

### Upload Flow
1. Client requests signed upload URL
2. Client uploads directly to Cloud Storage
3. `onUpload` trigger fires
4. Generate thumbnail (images/PDFs)
5. Queue for OCR processing
6. Create Firestore document record
7. Notify client of completion

### Encryption
- All documents encrypted at rest (Cloud Storage default)
- Per-user encryption keys stored in Secret Manager
- Client-side encryption option for sensitive documents
- Key rotation every 90 days

### Document Categories
| Category | Subcategories | OCR Priority |
|----------|---------------|--------------|
| `legal` | will, trust, power_of_attorney, deed | High |
| `financial` | statement, tax_return, insurance | High |
| `identity` | birth_certificate, death_certificate, passport, license | High |
| `property` | title, registration, appraisal | Medium |
| `medical` | records, directives | Low |
| `other` | photos, correspondence | Low |

### OCR Data Extraction
Extract and index:
- Dates (filing dates, expiration dates)
- Names (people, institutions)
- Account numbers (masked in search results)
- Dollar amounts
- Addresses

### Access Control
- Documents inherit estate permissions
- Additional share functionality for external parties
- Time-limited access links
- Full audit trail of all access

### File Limits
- Max file size: 50MB
- Supported types: PDF, JPG, PNG, HEIC, TIFF
- Max versions per document: 10

---

## Integration Points

### Depends On
- Auth Agent (user permissions)
- Estate Agent (estate context, asset linking)

### Depended On By
- Compliance Agent (death certificate verification)
- Notify Agent (document attachments in letters)
- LLM Agent (document analysis, Q&A)

---

## Testing Requirements
- Unit: Upload validation, OCR parsing, permission checks
- Integration: Full upload → OCR → search flow
- Security: Access control, encryption verification

---

## Current Status

### Implemented
- [ ] Document Firestore schema
- [ ] Cloud Storage bucket configuration
- [ ] Storage security rules
- [ ] Upload component
- [ ] Document viewer
- [ ] OCR integration
- [ ] Thumbnail generation
- [ ] Version history
- [ ] Share functionality

### Blockers
- Auth Agent must be complete first
- Estate Agent for context

### Next Actions
1. Configure Cloud Storage bucket
2. Write storage security rules
3. Create document schema
4. Build upload component

---

## Changelog
| Date | Change |
|------|--------|
| 2025-11-26 | Agent created |
