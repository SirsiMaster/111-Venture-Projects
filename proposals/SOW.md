# Statement of Work (SOW)
## Legacy Platform - MVP Development
**Document Version:** 1.0.0
**Date:** November 26, 2025
**Proposal Valid Until:** December 31, 2025

---

## 1. Executive Summary

This Statement of Work (SOW) defines the scope, deliverables, timeline, and terms for the development of the **Legacy Platform MVP** — a cross-platform estate management application serving web, iOS, and Android users.

**Project Overview:**
- **Product:** Legacy - The Estate Operating System
- **Duration:** 90 calendar days
- **Platforms:** Web (Next.js), iOS (Flutter), Android (Flutter)
- **Backend:** Go (Golang) with PostgreSQL
- **Infrastructure:** Amazon Web Services (AWS)

---

## 2. Parties

**Client:**
[Client Name / Company]
[Address]
[Contact Information]

**Contractor:**
[Development Team / Agency]
[Address]
[Contact Information]

---

## 3. Project Objectives

### 3.1 Business Objectives
1. Launch a minimum viable product (MVP) within 90 days
2. Enable users to organize estate information across web and mobile
3. Automate the estate settlement notification process
4. Achieve initial market validation with early adopters
5. Establish foundation for future feature expansion

### 3.2 Technical Objectives
1. Build secure, scalable backend infrastructure on AWS
2. Deliver responsive web application with modern UX
3. Publish native iOS and Android applications
4. Implement end-to-end encryption for sensitive data
5. Achieve SOC 2 readiness

---

## 4. Scope of Work

### 4.1 Included in Scope (MVP Features)

#### Backend Development
- RESTful API development in Go
- PostgreSQL database design and implementation
- Redis caching layer
- AWS infrastructure setup (ECS, RDS, S3, CloudFront)
- Auth0 integration for authentication
- Stripe integration for payments
- SendGrid integration for email notifications
- AWS Textract integration for OCR
- CI/CD pipeline (GitHub Actions)

#### Web Application (Next.js)
- User registration and authentication
- Multi-factor authentication (MFA)
- User profile management
- Estate creation and management
- Asset inventory (5 categories)
- Document vault with upload/download
- Beneficiary designation (executors, heirs)
- Principal dashboard with progress tracking
- Executor dashboard with task management
- Notification letter generation (50 institutions)
- Payment processing (Stripe checkout)
- Responsive design (desktop, tablet, mobile)
- WCAG 2.1 AA accessibility

#### Mobile Applications (Flutter)
- iOS application (iPhone, iPad)
- Android application (phone, tablet)
- Biometric authentication (Face ID, Touch ID, Fingerprint)
- Push notifications
- Document camera capture
- Offline capability (view cached data)
- Native performance and animations

#### Security & Compliance
- AES-256 encryption at rest
- TLS 1.3 encryption in transit
- Role-based access control (RBAC)
- Comprehensive audit logging
- SOC 2 Type I readiness documentation
- GDPR/CCPA compliance features

#### Infrastructure
- Production environment (AWS us-east-1, multi-AZ)
- Staging environment (AWS us-east-1, single-AZ)
- Automated deployments
- Monitoring and alerting (CloudWatch)
- Disaster recovery configuration

### 4.2 Excluded from Scope (Post-MVP)

The following features are explicitly excluded from this SOW and may be addressed in future engagements:

- Plaid integration for automated asset discovery
- Lob integration for certified mail delivery
- Full AI Assistant ("Shepherd") with ML capabilities
- Spanish language localization
- Complete Distribution Phase features
- Cryptocurrency wallet integration
- White Glove tier human agent workflows
- HIPAA compliance certification
- Public API for third-party developers
- Admin panel advanced analytics

---

## 5. Deliverables

### 5.1 Software Deliverables

| ID | Deliverable | Description | Acceptance Criteria |
|----|-------------|-------------|---------------------|
| D1 | Legacy API | Go backend service | All API endpoints functional per specification |
| D2 | Legacy Web | Next.js web application | Deployed, responsive, accessible (WCAG 2.1 AA) |
| D3 | Legacy iOS | Flutter iOS application | Published on App Store |
| D4 | Legacy Android | Flutter Android application | Published on Google Play Store |
| D5 | Admin Dashboard | Internal administration interface | User management, estate viewing capabilities |

### 5.2 Documentation Deliverables

| ID | Deliverable | Description |
|----|-------------|-------------|
| D6 | API Documentation | OpenAPI 3.0 specification with examples |
| D7 | User Guide | End-user documentation for all features |
| D8 | Admin Guide | Internal operations and support guide |
| D9 | Deployment Guide | Infrastructure setup and deployment procedures |
| D10 | Architecture Decision Records | Documentation of technical decisions |

### 5.3 Infrastructure Deliverables

| ID | Deliverable | Description |
|----|-------------|-------------|
| D11 | Production Environment | Multi-AZ AWS infrastructure |
| D12 | Staging Environment | Single-AZ AWS infrastructure |
| D13 | CI/CD Pipeline | Automated build, test, deploy pipeline |
| D14 | Monitoring Setup | CloudWatch dashboards and alerts |

---

## 6. Timeline & Milestones

**Project Duration:** 90 calendar days (13 weeks)
**Start Date:** Upon contract execution
**Target Completion:** Start Date + 90 days

### 6.1 Phase Schedule

| Phase | Duration | Focus Areas |
|-------|----------|-------------|
| **Phase 1: Foundation** | Weeks 1-4 | Infrastructure, authentication, core data models |
| **Phase 2: Core Features** | Weeks 5-8 | Estate management, document vault, settlement workflow |
| **Phase 3: Mobile** | Weeks 9-10 | Flutter apps, native features |
| **Phase 4: Polish** | Weeks 11-12 | Testing, accessibility, performance |
| **Phase 5: Launch** | Week 13 | Store submission, go-live |

### 6.2 Key Milestones

| Milestone | Target Date | Deliverable | Exit Criteria |
|-----------|-------------|-------------|---------------|
| **M1** | End Week 2 | Infrastructure Ready | AWS deployed, CI/CD operational |
| **M2** | End Week 4 | API Alpha | Core endpoints functional (80% P0) |
| **M3** | End Week 8 | Web Beta | Web app feature complete |
| **M4** | End Week 10 | Mobile Beta | Apps in TestFlight/Internal Track |
| **M5** | End Week 12 | Launch Ready | All testing complete, zero P0 bugs |
| **M6** | End Week 13 | Public Launch | Apps live in stores |

### 6.3 Payment Milestones

See Section 8 (Commercial Terms) for payment schedule tied to milestones.

---

## 7. Team & Resources

### 7.1 Contractor Team

| Role | FTE | Responsibilities |
|------|-----|------------------|
| Project Manager | 1 | Sprint planning, stakeholder communication, risk management |
| Tech Lead / Architect | 1 | Architecture, technical decisions, code reviews |
| Senior Backend Engineer | 2 | Go API, database, integrations |
| Senior Frontend Engineer | 2 | Next.js, UI components, accessibility |
| Senior Mobile Engineer | 1 | Flutter iOS/Android development |
| DevOps Engineer | 1 | AWS infrastructure, CI/CD, monitoring |
| UI/UX Designer | 1 | Design system, wireframes, prototypes |
| QA Engineer | 1 | Testing (joins Week 9) |

### 7.2 Client Responsibilities

The Client shall provide:
- Access to required third-party accounts (AWS, Apple Developer, Google Play Console)
- Legal review and approval of Terms of Service, Privacy Policy, and notification templates
- Brand assets (logo, colors, fonts) by Week 1
- Timely feedback on deliverables (within 3 business days)
- Subject matter expertise for estate settlement workflows
- Final approval authority for go-live decision

### 7.3 Communication

| Meeting | Frequency | Participants | Duration |
|---------|-----------|--------------|----------|
| Sprint Planning | Bi-weekly | All team + Client stakeholder | 2 hours |
| Daily Standup | Daily | Dev team | 15 minutes |
| Sprint Review | Bi-weekly | All team + Client | 1 hour |
| Status Report | Weekly (Friday) | PM → Client | Written report |

---

## 8. Commercial Terms

### 8.1 Pricing

**See attached COST_PROPOSAL.md for detailed pricing breakdown.**

**Total Project Cost:** $425,000 - $485,000 USD (depending on final scope)

### 8.2 Payment Schedule

| Milestone | Percentage | Amount | Due Date |
|-----------|------------|--------|----------|
| Contract Execution | 25% | $106,250 - $121,250 | Upon signing |
| M2: API Alpha (Week 4) | 25% | $106,250 - $121,250 | End of Week 4 |
| M4: Mobile Beta (Week 10) | 25% | $106,250 - $121,250 | End of Week 10 |
| M6: Launch (Week 13) | 25% | $106,250 - $121,250 | Upon launch |

### 8.3 Payment Terms
- Invoices due Net 15 from invoice date
- Payments via wire transfer or ACH
- Late payments subject to 1.5% monthly interest
- Work may be paused if payment is >15 days overdue

### 8.4 Expenses
- All cloud infrastructure costs (AWS) are pass-through at cost
- Third-party service fees (Auth0, Stripe, SendGrid) are pass-through at cost
- Travel expenses (if required) billed at cost with prior approval

---

## 9. Terms & Conditions

### 9.1 Intellectual Property
- All custom code developed under this SOW shall be owned by the Client upon final payment
- Contractor retains rights to pre-existing libraries and frameworks
- Open-source components remain under their respective licenses

### 9.2 Confidentiality
- Both parties agree to maintain confidentiality of proprietary information
- NDA terms remain in effect for 3 years following project completion

### 9.3 Warranties
- Contractor warrants deliverables will be free of material defects for 30 days post-launch
- Bug fixes during warranty period included at no additional cost
- Warranty excludes issues caused by Client modifications

### 9.4 Limitation of Liability
- Total liability limited to fees paid under this SOW
- Neither party liable for indirect, consequential, or incidental damages

### 9.5 Change Management
- Scope changes require written Change Request
- Changes >8 hours require updated cost estimate
- Changes >40 hours require SOW amendment

### 9.6 Termination
- Either party may terminate with 30 days written notice
- Upon termination, Client pays for work completed to date
- Contractor delivers all work product and documentation

---

## 10. Assumptions

1. Client has or will obtain required Apple Developer and Google Play Console accounts
2. Client will provide timely legal review (within 5 business days)
3. Third-party APIs (Auth0, Stripe, SendGrid) remain available and stable
4. No significant changes to App Store or Play Store guidelines during development
5. Team members remain available throughout project duration
6. Requirements are final after Week 8 (scope freeze)

---

## 11. Acceptance

This Statement of Work is accepted and agreed to by the authorized representatives of both parties:

**Client:**

| Signature | Date |
|-----------|------|
| | |
| Name: | |
| Title: | |

**Contractor:**

| Signature | Date |
|-----------|------|
| | |
| Name: | |
| Title: | |

---

## Appendix A: Referenced Documents

1. REQUIREMENTS_SPECIFICATION.md
2. PROJECT_SCOPE.md
3. ARCHITECTURE_DESIGN.md
4. DATA_MODEL.md
5. API_SPECIFICATION.md
6. COST_PROPOSAL.md
7. RISK_MANAGEMENT.md

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
