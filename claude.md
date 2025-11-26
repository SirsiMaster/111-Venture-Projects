# claude.md

This file provides guidance to Claude AI when working with this repository.

## Project Overview
**Legacy** is "The Estate Operating System" - an end-of-life estate management platform. Currently in pre-development with a marketing site and comprehensive platform documentation.

**Goal:** Help families organize estate assets, documents, and beneficiary designations to reduce the 500+ hours typically spent on estate settlement.

## Project Status
- **Marketing Site:** Live at GitHub Pages (index.html)
- **Platform:** Pre-development, documentation complete
- **Proposal:** SOW and Cost Proposal ready ($425K-$485K for 90-day MVP)

## Technology Stack (Planned)
- **Backend:** Go 1.21+ (Gin framework), PostgreSQL 15+, Redis
- **Web:** Next.js 14, TypeScript, Tailwind CSS
- **Mobile:** Flutter 3.16+ (iOS & Android)
- **Infrastructure:** AWS (ECS Fargate, RDS, S3, CloudFront, Cognito)
- **CI/CD:** GitHub Actions

## Key Architecture Decisions
1. **Go over Node.js** - Type safety, performance, single binary deployment
2. **Flutter over React Native** - Single codebase, performance, Dart type safety
3. **PostgreSQL over MongoDB** - ACID compliance critical for financial/legal data
4. **AWS Cognito** - Managed auth with MFA support
5. **ECS Fargate over Lambda** - Consistent latency, stateful connections

## Core Domain Concepts
- **Principal:** The person whose estate is being managed
- **Executor:** Person(s) designated to administer the estate
- **Heir/Beneficiary:** Recipients of estate assets
- **Estate:** Collection of assets, documents, and designations
- **Document Vault:** Encrypted storage for sensitive files
- **Notification Letter:** Generated document for institutions upon death

## File Structure
```
Legacy/
├── index.html           # Marketing site
├── docs/                # 18 platform documents
├── proposals/           # SOW.md, COST_PROPOSAL.md
├── CHANGELOG.md
├── WARP.md
└── claude.md            # This file
```

## Important Documents
- `docs/ARCHITECTURE_DESIGN.md` - System architecture
- `docs/API_SPECIFICATION.md` - API endpoints
- `docs/DATA_MODEL.md` - Database schema
- `docs/SECURITY_COMPLIANCE.md` - Security requirements

## Design Language
**Aesthetic:** "Opulent, Permanent, Guardian-Like"
- Colors: Royal Blue (#0f172a → #1e3a8a), Gold (#D4AF37)
- Typography: Cinzel (headings), Inter (body)
- UI: Glass panels, gold accents, grain texture overlay

## Guidelines for Claude

### When Modifying Marketing Site (index.html)
- Keep single-file architecture (Tailwind CDN)
- Preserve Royal Blue gradient background
- Use solid gold buttons, no gradients
- Maintain high text contrast
- Keep footer compact (py-8)

### When Working with Documentation
- Maintain consistency with existing docs
- Reference ARCHITECTURE_DESIGN.md for tech decisions
- API changes should update API_SPECIFICATION.md
- Data model changes should update DATA_MODEL.md

### When Discussing Platform Development
- 90-day MVP timeline, 4 phases (Foundation → Core → Mobile → Launch)
- Team: 10 FTEs (PM, Tech Lead, 2 Backend, 2 Frontend, 1 Mobile, 1 DevOps, 1 Designer, 1 QA)
- Budget: $425K-$485K (recommended $455K)

## Testing Context
Marketing site: `python3 -m http.server 8000` then visit http://localhost:8000

## Security Considerations
- All estate data must be encrypted at rest (AES-256) and in transit (TLS 1.3)
- SOC 2 Type II compliance roadmap
- GDPR and CCPA compliance required
- Zero-knowledge architecture for sensitive documents
