# Test Plan
## Legacy - The Estate Operating System
**Version:** 1.0.0
**Date:** November 26, 2025

---

## 1. Overview

This document defines the testing strategy for the Legacy platform MVP across all platforms (Web, iOS, Android) and backend services.

### 1.1 Testing Objectives
- Ensure all functional requirements are met
- Validate security and data protection
- Verify performance under expected load
- Confirm accessibility compliance (WCAG 2.1 AA)
- Validate cross-platform consistency

### 1.2 Testing Scope

| In Scope | Out of Scope |
|----------|--------------|
| Unit testing (all components) | Load testing beyond 10K users |
| Integration testing | Stress testing |
| End-to-end testing | Chaos engineering |
| Security testing | Internationalization |
| Performance testing | Third-party system testing |
| Accessibility testing | |
| Mobile device testing | |

---

## 2. Testing Strategy

### 2.1 Testing Pyramid

```
              ┌───────────────┐
             /  E2E Tests     \
            /   (10%)          \
           /───────────────────\
          /  Integration Tests  \
         /     (20%)             \
        /─────────────────────────\
       /      Unit Tests           \
      /        (70%)                \
     /───────────────────────────────\
```

### 2.2 Test Types

| Type | Coverage Target | Tools |
|------|-----------------|-------|
| Unit Tests | 80%+ | Go testing, Jest, Flutter test |
| Integration Tests | Critical paths | Go testing, Supertest |
| E2E Tests | Core user journeys | Playwright, Detox |
| Security Tests | OWASP Top 10 | OWASP ZAP, SonarQube |
| Performance Tests | P95 < 200ms | k6, Lighthouse |
| Accessibility Tests | WCAG 2.1 AA | axe-core, manual audit |

---

## 3. Unit Testing

### 3.1 Backend (Go)
- **Framework:** Go's built-in testing package
- **Coverage Tool:** go test -cover
- **Target:** 80%+ code coverage
- **Key Areas:**
  - Domain logic (estate, asset, document)
  - Validation functions
  - Encryption/decryption utilities
  - Repository layer mocking

### 3.2 Web Frontend (Next.js)
- **Framework:** Jest + React Testing Library
- **Coverage Tool:** Jest coverage
- **Target:** 80%+ code coverage
- **Key Areas:**
  - Component rendering
  - Hook behavior
  - Form validation
  - State management

### 3.3 Mobile (Flutter)
- **Framework:** flutter_test
- **Coverage Tool:** flutter test --coverage
- **Target:** 80%+ code coverage
- **Key Areas:**
  - Widget tests
  - BLoC state tests
  - Repository tests

---

## 4. Integration Testing

### 4.1 API Integration Tests
- **Tool:** Go testing with httptest
- **Coverage:** All API endpoints
- **Database:** Test database with migrations

### 4.2 Key Integration Scenarios

| Scenario | Components | Priority |
|----------|------------|----------|
| User registration flow | API → Auth0 → DB | P0 |
| Document upload | API → S3 → Lambda → DB | P0 |
| Estate creation | API → DB → Cache | P0 |
| Payment processing | API → Stripe → DB | P0 |
| Notification generation | API → Templates → PDF | P1 |

---

## 5. End-to-End Testing

### 5.1 Web E2E Tests
- **Framework:** Playwright
- **Browsers:** Chrome, Firefox, Safari
- **Viewports:** Desktop (1920x1080), Tablet (768x1024), Mobile (375x812)

### 5.2 Critical User Journeys

| Journey | Steps | Priority |
|---------|-------|----------|
| New user onboarding | Register → Verify email → Create profile → Create estate | P0 |
| Asset management | Add asset → Attach document → Assign to heir | P0 |
| Document vault | Upload → Organize → Search → Download | P0 |
| Executor flow | Accept invitation → Confirm death → Generate letters | P0 |
| Payment flow | Select plan → Checkout → Complete | P0 |

### 5.3 Mobile E2E Tests
- **Framework:** Detox (React Native) or integration_test (Flutter)
- **Devices:** iOS Simulator, Android Emulator
- **Key Scenarios:** Same as web + biometric auth, camera capture

---

## 6. Security Testing

### 6.1 Automated Security Scans
- **SAST:** SonarQube in CI pipeline
- **DAST:** OWASP ZAP scans weekly
- **Dependency:** Dependabot, Snyk

### 6.2 Manual Security Tests

| Test | Frequency | Timing |
|------|-----------|--------|
| Penetration testing | Once | Week 11 |
| Code review (security) | Ongoing | Per PR |
| Access control audit | Once | Week 10 |

### 6.3 Security Test Cases
- Authentication bypass attempts
- SQL injection testing
- XSS vulnerability testing
- CSRF protection verification
- Authorization boundary testing
- Session management testing

---

## 7. Performance Testing

### 7.1 Load Testing
- **Tool:** k6
- **Target Load:** 1,000 concurrent users
- **Peak Load:** 10,000 concurrent users
- **Duration:** 30 minutes sustained

### 7.2 Performance Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| API P95 latency | < 200ms | k6 |
| Page load (LCP) | < 2.5s | Lighthouse |
| First Input Delay | < 100ms | Web Vitals |
| Mobile startup | < 3s | Manual |

---

## 8. Accessibility Testing

### 8.1 Automated Testing
- **Tool:** axe-core integrated with Playwright
- **Standard:** WCAG 2.1 AA
- **Coverage:** All pages

### 8.2 Manual Testing
- Screen reader testing (VoiceOver, NVDA)
- Keyboard navigation
- Color contrast verification
- Focus management

---

## 9. Test Environments

| Environment | Purpose | Data |
|-------------|---------|------|
| Local | Unit/integration tests | Mock data |
| Staging | E2E, QA testing | Seeded test data |
| Production | Smoke tests | Live data (read-only tests) |

---

## 10. Test Schedule

| Phase | Testing Focus | Weeks |
|-------|---------------|-------|
| Foundation | Unit tests, API integration | 1-4 |
| Core Features | Integration, basic E2E | 5-8 |
| Mobile | Mobile unit/integration, E2E | 9-10 |
| Polish | Full E2E, security, performance, a11y | 11-12 |
| Launch | Regression, smoke tests | 13 |

---

## 11. Defect Management

### 11.1 Severity Classification

| Severity | Description | Response |
|----------|-------------|----------|
| P0 - Critical | System down, data loss | Immediate fix |
| P1 - High | Major feature broken | Fix same sprint |
| P2 - Medium | Feature partially broken | Fix next sprint |
| P3 - Low | Minor issue, workaround exists | Backlog |

### 11.2 Exit Criteria
- Zero P0 bugs open
- Zero P1 bugs open
- 80%+ code coverage maintained
- All E2E tests passing
- Security scan clear

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
