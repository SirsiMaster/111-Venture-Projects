# Security & Compliance
## Legacy - The Estate Operating System
**Version:** 1.0.0
**Date:** November 26, 2025

---

## 1. Security Overview

### 1.1 Security Principles
1. **Defense in Depth** - Multiple layers of security controls
2. **Least Privilege** - Minimal access rights for all components
3. **Zero Trust** - Verify all access requests
4. **Security by Design** - Security built into every component

### 1.2 Data Classification

| Classification | Examples | Handling |
|---------------|----------|----------|
| **Highly Sensitive** | Death certificates, SSN, bank accounts | Encrypted, audit logged, MFA required |
| **Sensitive** | Contact info, estate details | Encrypted at rest, access controlled |
| **Internal** | System logs, metrics | Access restricted to operations |
| **Public** | Marketing content | No restrictions |

---

## 2. Encryption Standards

### 2.1 Data at Rest
- **Database:** AES-256 via AWS RDS encryption
- **Documents:** AES-256 via AWS S3 SSE-KMS with customer-managed keys
- **Redis:** Encryption enabled (ElastiCache)
- **Backups:** Encrypted using same keys as source

### 2.2 Data in Transit
- **Protocol:** TLS 1.3 (minimum TLS 1.2)
- **Certificates:** AWS Certificate Manager (ACM)
- **Internal traffic:** VPC encryption enabled
- **API calls:** HTTPS only, HSTS enabled

### 2.3 Key Management
- **Provider:** AWS Key Management Service (KMS)
- **Key rotation:** Automatic annual rotation
- **Per-estate keys:** Document encryption uses unique data keys per estate
- **Access:** Restricted to application service accounts

---

## 3. Authentication & Authorization

### 3.1 Authentication Methods
| Method | Use Case | Implementation |
|--------|----------|----------------|
| Email/Password | Primary login | Auth0 with bcrypt hashing |
| OAuth 2.0 | Google, Apple SSO | Auth0 social connections |
| MFA (TOTP) | Enhanced security | Google Authenticator compatible |
| Biometric | Mobile apps | Face ID, Touch ID, Fingerprint |

### 3.2 Session Management
- **Token type:** JWT (RS256)
- **Access token expiry:** 1 hour
- **Refresh token expiry:** 30 days
- **Session timeout:** 30 minutes of inactivity
- **Storage:** HTTP-only secure cookies (web), secure storage (mobile)

### 3.3 Role-Based Access Control (RBAC)

**Roles:**
| Role | Description | Capabilities |
|------|-------------|--------------|
| Principal | Estate owner | Full access to own estate |
| Executor | Estate administrator (post-death) | Manage estate, generate notifications |
| Heir | Beneficiary | View-only access to assigned assets |
| Admin | System administrator | User management, support access |

**Permission Model:**
```
user → role → estate → permissions
```

---

## 4. Infrastructure Security

### 4.1 Network Architecture
- **VPC:** Isolated virtual private cloud
- **Subnets:** Public (load balancers), Private (applications), Data (databases)
- **Security Groups:** Whitelist-based firewall rules
- **NAT Gateway:** Outbound-only internet access for private subnets

### 4.2 WAF (Web Application Firewall)
- **Provider:** AWS WAF
- **Rules enabled:**
  - SQL injection protection
  - Cross-site scripting (XSS) protection
  - Rate limiting (DDoS mitigation)
  - IP reputation filtering
  - Bot detection

### 4.3 DDoS Protection
- **CloudFront:** Edge caching, geographic distribution
- **AWS Shield Standard:** Automatic DDoS protection
- **Rate limiting:** API and application level

---

## 5. Application Security

### 5.1 Secure Development Practices
- **Code reviews:** Required for all PRs
- **Static analysis:** SonarQube in CI pipeline
- **Dependency scanning:** Dependabot, Snyk
- **Secret scanning:** GitHub secret scanning enabled
- **Security testing:** OWASP ZAP scans

### 5.2 OWASP Top 10 Mitigations

| Vulnerability | Mitigation |
|---------------|------------|
| A01: Broken Access Control | RBAC, resource-level authorization |
| A02: Cryptographic Failures | TLS 1.3, AES-256, KMS |
| A03: Injection | Parameterized queries, input validation |
| A04: Insecure Design | Threat modeling, security reviews |
| A05: Security Misconfiguration | IaC, automated hardening |
| A06: Vulnerable Components | Dependency scanning, updates |
| A07: Auth Failures | Auth0, MFA, secure sessions |
| A08: Software/Data Integrity | Signed builds, code signing |
| A09: Security Logging | Comprehensive audit logging |
| A10: SSRF | Input validation, egress filtering |

### 5.3 Input Validation
- All user inputs validated server-side
- Strict type checking (Go's type system)
- Content-Type validation for uploads
- File type verification (magic bytes)

---

## 6. Audit & Logging

### 6.1 Audit Events
All security-relevant events are logged:
- Authentication (login, logout, failed attempts)
- Authorization (access granted/denied)
- Data access (reads, writes, deletes)
- Administrative actions
- System events (errors, config changes)

### 6.2 Log Format
```json
{
  "timestamp": "2025-01-01T00:00:00Z",
  "level": "INFO",
  "event": "user.login",
  "user_id": "uuid",
  "estate_id": "uuid",
  "ip_address": "1.2.3.4",
  "user_agent": "...",
  "request_id": "uuid",
  "details": { ... }
}
```

### 6.3 Log Retention
- **Hot storage:** 30 days (CloudWatch Logs)
- **Cold storage:** 7 years (S3 Glacier)
- **Immutability:** S3 Object Lock enabled

---

## 7. Compliance Frameworks

### 7.1 SOC 2 Type II Readiness

**Trust Service Criteria addressed:**

| Criteria | Status | Implementation |
|----------|--------|----------------|
| **Security** | Ready | Encryption, access controls, monitoring |
| **Availability** | Ready | Multi-AZ, 99.9% SLA, DR plan |
| **Processing Integrity** | Ready | Data validation, error handling |
| **Confidentiality** | Ready | Encryption, access controls |
| **Privacy** | Ready | GDPR/CCPA compliance |

**Timeline:** SOC 2 Type I audit to be conducted within 6 months of launch.

### 7.2 GDPR Compliance

| Requirement | Implementation |
|-------------|----------------|
| Lawful basis | Consent at registration |
| Data minimization | Only necessary data collected |
| Right to access | Export functionality |
| Right to erasure | Account deletion process |
| Data portability | JSON export available |
| Breach notification | Incident response plan |
| DPO | Designated for EU users |

### 7.3 CCPA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Right to know | Privacy policy, data access |
| Right to delete | Account deletion process |
| Right to opt-out | No data selling |
| Non-discrimination | Equal service regardless |

### 7.4 State Probate Laws

**Disclaimer on all generated documents:**
> "This document is provided for informational purposes only and does not constitute legal advice. Consult a licensed attorney in your jurisdiction for legal guidance."

---

## 8. Incident Response

### 8.1 Incident Classification

| Severity | Description | Response Time |
|----------|-------------|---------------|
| **P0 - Critical** | Data breach, system compromise | Immediate (< 15 min) |
| **P1 - High** | Security vulnerability, partial outage | < 1 hour |
| **P2 - Medium** | Suspicious activity, minor issue | < 4 hours |
| **P3 - Low** | Policy violation, minor anomaly | < 24 hours |

### 8.2 Response Process

1. **Detection:** Automated alerts, user reports
2. **Triage:** Classify severity, assign responder
3. **Containment:** Isolate affected systems
4. **Investigation:** Root cause analysis
5. **Eradication:** Remove threat
6. **Recovery:** Restore normal operations
7. **Lessons Learned:** Post-incident review

### 8.3 Data Breach Notification

If a breach occurs involving user PII:
- **Internal:** Notify security team immediately
- **Users:** Within 72 hours per GDPR
- **Authorities:** As required by jurisdiction
- **Documentation:** Full incident report

---

## 9. Vendor Security

### 9.1 Third-Party Assessment

| Vendor | Purpose | SOC 2 | Data Access |
|--------|---------|-------|-------------|
| AWS | Infrastructure | Yes | Full (encrypted) |
| Auth0 | Authentication | Yes | Credentials only |
| Stripe | Payments | Yes | Payment info |
| SendGrid | Email | Yes | Email addresses |
| Persona | ID Verification | Yes | ID documents |

### 9.2 Data Processing Agreements
- DPAs signed with all vendors processing PII
- Annual vendor security reviews
- Contractual security requirements

---

## 10. Security Testing

### 10.1 Testing Schedule

| Test Type | Frequency | Provider |
|-----------|-----------|----------|
| Vulnerability scanning | Weekly | Automated (Qualys) |
| Penetration testing | Quarterly | External firm |
| Code review (security) | Per PR | Internal + SonarQube |
| Dependency audit | Daily | Dependabot |

### 10.2 Bug Bounty Program

Post-launch bug bounty program:
- **Platform:** HackerOne
- **Scope:** All production systems
- **Rewards:** $100 - $10,000 based on severity
- **Safe harbor:** Responsible disclosure protected

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
