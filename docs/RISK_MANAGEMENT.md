# Risk Management Plan
## Legacy - The Estate Operating System
**Version:** 1.0.0
**Date:** November 26, 2025

---

## 1. Risk Management Approach

### 1.1 Objectives
- Identify and assess risks proactively
- Implement mitigation strategies before risks materialize
- Monitor risks throughout project lifecycle
- Maintain contingency plans for high-impact risks

### 1.2 Risk Assessment Matrix

**Probability Scale:**
| Level | Description | Percentage |
|-------|-------------|------------|
| 1 - Rare | Unlikely to occur | < 10% |
| 2 - Unlikely | Could occur occasionally | 10-25% |
| 3 - Possible | May occur | 25-50% |
| 4 - Likely | Will probably occur | 50-75% |
| 5 - Almost Certain | Expected to occur | > 75% |

**Impact Scale:**
| Level | Description | Effect |
|-------|-------------|--------|
| 1 - Negligible | Minimal impact | < 1 day delay, < $1K cost |
| 2 - Minor | Small impact | 1-3 day delay, $1-5K cost |
| 3 - Moderate | Noticeable impact | 1-2 week delay, $5-20K cost |
| 4 - Major | Significant impact | 2-4 week delay, $20-50K cost |
| 5 - Critical | Severe impact | > 4 week delay, > $50K cost, project failure |

**Risk Score = Probability × Impact**

| Score | Risk Level | Action Required |
|-------|------------|-----------------|
| 1-4 | Low | Accept and monitor |
| 5-9 | Medium | Mitigation plan required |
| 10-16 | High | Active mitigation, escalate |
| 17-25 | Critical | Immediate action, Sponsor involved |

---

## 2. Risk Register

### 2.1 Technical Risks

#### R-001: App Store Rejection
| Attribute | Value |
|-----------|-------|
| Category | Technical / External |
| Probability | 3 (Possible) |
| Impact | 4 (Major) |
| **Risk Score** | **12 (High)** |
| Owner | Tech Lead |
| Status | Open |

**Description:** iOS or Android app rejected during store review, causing launch delay.

**Triggers:**
- Violation of App Store/Play Store guidelines
- Missing privacy policy or permissions explanations
- Crashes during review
- Incomplete functionality

**Mitigation:**
1. Review Apple and Google guidelines Week 1
2. Submit to TestFlight/Internal Track by Week 10
3. Build review checklist per platform
4. Have legal review app metadata
5. Implement crash reporting early

**Contingency:**
- 5-day buffer built into Week 13 for resubmission
- Expedited review available (Apple)
- Web-first launch if mobile blocked

---

#### R-002: Third-Party API Unavailability
| Attribute | Value |
|-----------|-------|
| Category | Technical / External |
| Probability | 2 (Unlikely) |
| Impact | 3 (Moderate) |
| **Risk Score** | **6 (Medium)** |
| Owner | Backend Lead |
| Status | Open |

**Description:** Critical third-party service (Auth0, Stripe, SendGrid) experiences downtime or breaking changes.

**Triggers:**
- Service outage
- Breaking API version change
- Rate limiting hit
- Account suspension

**Mitigation:**
1. Use stable API versions (no beta)
2. Implement circuit breakers
3. Build fallback for non-critical services
4. Monitor vendor status pages
5. Have support contracts in place

**Contingency:**
- Auth: Fall back to local auth temporarily
- Payments: Manual processing for launch week
- Email: Alternative provider on standby (Mailgun)

---

#### R-003: Security Vulnerability Discovery
| Attribute | Value |
|-----------|-------|
| Category | Technical / Security |
| Probability | 2 (Unlikely) |
| Impact | 5 (Critical) |
| **Risk Score** | **10 (High)** |
| Owner | Tech Lead |
| Status | Open |

**Description:** Critical security vulnerability discovered during penetration testing or post-launch.

**Triggers:**
- SQL injection found
- Authentication bypass
- Data exposure
- Cross-site scripting (XSS)

**Mitigation:**
1. Security-first coding practices
2. Automated SAST in CI pipeline (SonarQube)
3. Dependency vulnerability scanning (Dependabot)
4. Penetration testing Week 11
5. Security code review for auth/data access

**Contingency:**
- Immediate patch deployment (hotfix process)
- Bug bounty program post-launch
- Security incident response plan
- Legal notification if data breach

---

#### R-004: Performance Bottleneck
| Attribute | Value |
|-----------|-------|
| Category | Technical |
| Probability | 3 (Possible) |
| Impact | 3 (Moderate) |
| **Risk Score** | **9 (Medium)** |
| Owner | Backend Lead |
| Status | Open |

**Description:** System cannot handle expected load, causing slow response times or timeouts.

**Triggers:**
- Database query inefficiency
- Missing indexes
- N+1 query problems
- Insufficient infrastructure sizing

**Mitigation:**
1. Load testing in Week 11 (target: 10K concurrent)
2. Database query optimization review
3. Redis caching for frequent reads
4. Auto-scaling configured
5. CDN for static assets

**Contingency:**
- Horizontal scaling (add more instances)
- Database read replicas
- Feature flags to disable heavy features
- Maintenance mode capability

---

### 2.2 Schedule Risks

#### R-005: Timeline Slippage
| Attribute | Value |
|-----------|-------|
| Category | Schedule |
| Probability | 3 (Possible) |
| Impact | 4 (Major) |
| **Risk Score** | **12 (High)** |
| Owner | Project Manager |
| Status | Open |

**Description:** Project falls behind schedule, threatening 90-day deadline.

**Triggers:**
- Underestimated complexity
- Scope creep
- Team member unavailability
- Technical blockers

**Mitigation:**
1. Aggressive scope management (scope freeze Week 8)
2. Daily progress tracking
3. Early warning system (< 80% sprint completion)
4. Buffer week built into schedule (Week 12)
5. Cross-functional team members for flexibility

**Contingency:**
- Scope reduction (P1 → post-MVP)
- Team augmentation
- Overtime (limited, last resort)
- Phased launch (web first, mobile follows)

---

#### R-006: Key Resource Unavailability
| Attribute | Value |
|-----------|-------|
| Category | Schedule / Resource |
| Probability | 2 (Unlikely) |
| Impact | 4 (Major) |
| **Risk Score** | **8 (Medium)** |
| Owner | Project Manager |
| Status | Open |

**Description:** Critical team member becomes unavailable (illness, departure, emergency).

**Triggers:**
- Illness or injury
- Resignation
- Family emergency
- Burnout

**Mitigation:**
1. Cross-training on critical paths
2. Documentation of all work
3. No single point of failure for critical components
4. Backup contacts for specialized skills
5. Reasonable work hours (no burnout)

**Contingency:**
- Contractor backfill (pre-vetted list)
- Redistribute workload
- Extend timeline if critical path affected
- Hire rapid replacement

---

### 2.3 Business Risks

#### R-007: Legal/Compliance Issues
| Attribute | Value |
|-----------|-------|
| Category | Business / Legal |
| Probability | 2 (Unlikely) |
| Impact | 5 (Critical) |
| **Risk Score** | **10 (High)** |
| Owner | Product Owner |
| Status | Open |

**Description:** Legal issues with notification letters, privacy policy, or regulatory compliance.

**Triggers:**
- Notification letter content deemed unauthorized practice of law
- Privacy policy insufficient
- State-specific probate law violations
- Data handling compliance issues

**Mitigation:**
1. Legal counsel engaged Week 1
2. All notification templates legally reviewed
3. Clear disclaimers ("not legal advice")
4. Privacy policy and ToS reviewed by attorney
5. State-by-state analysis for top 10 states

**Contingency:**
- Remove problematic features
- Geo-restrict to compliant states
- Engage specialized legal firm
- Delay launch if critical

---

#### R-008: Competitive Product Launch
| Attribute | Value |
|-----------|-------|
| Category | Business / External |
| Probability | 2 (Unlikely) |
| Impact | 2 (Minor) |
| **Risk Score** | **4 (Low)** |
| Owner | Product Owner |
| Status | Monitoring |

**Description:** Competitor launches similar product during development, affecting market positioning.

**Triggers:**
- Press announcement
- App store discovery
- Industry news

**Mitigation:**
1. Monitor competitor landscape
2. Focus on differentiation (AI automation)
3. Speed to market (90-day timeline)
4. Build brand recognition early

**Contingency:**
- Adjust positioning
- Accelerate unique features
- Partnership opportunities

---

### 2.4 External Risks

#### R-009: Vendor Contract Delays
| Attribute | Value |
|-----------|-------|
| Category | External |
| Probability | 3 (Possible) |
| Impact | 2 (Minor) |
| **Risk Score** | **6 (Medium)** |
| Owner | Project Manager |
| Status | Open |

**Description:** Delays in signing contracts with third-party vendors (Auth0, Stripe, etc.).

**Triggers:**
- Legal review delays
- Procurement process
- Negotiation stalemate

**Mitigation:**
1. Start vendor conversations Week 1
2. Use free tiers during development
3. Standard contracts where possible
4. Parallel vendor evaluation

**Contingency:**
- Alternative vendors identified
- Development continues with mocks
- Escalate to executive level

---

#### R-010: AWS Service Disruption
| Attribute | Value |
|-----------|-------|
| Category | External / Infrastructure |
| Probability | 1 (Rare) |
| Impact | 4 (Major) |
| **Risk Score** | **4 (Low)** |
| Owner | DevOps |
| Status | Monitoring |

**Description:** Major AWS outage affects development or production.

**Triggers:**
- Regional outage
- Service-specific issues
- Network problems

**Mitigation:**
1. Multi-AZ deployment
2. Regular backups to different region
3. Monitor AWS status
4. Local development environment

**Contingency:**
- Failover to secondary region
- Manual operations if needed
- Communication to users

---

## 3. Risk Monitoring

### 3.1 Risk Review Cadence

| Review Type | Frequency | Participants |
|-------------|-----------|--------------|
| Risk Standup | Weekly (Monday) | PM, Tech Lead |
| Risk Register Update | Bi-weekly | PM |
| Deep Dive Review | Monthly | Steering Committee |
| Ad-hoc | As needed | Relevant stakeholders |

### 3.2 Risk Indicators (Early Warning)

| Indicator | Threshold | Action |
|-----------|-----------|--------|
| Sprint velocity drop | < 80% of target | Review blockers, adjust scope |
| Bug count increasing | > 20 open bugs | Add bug fixing time |
| CI build failures | > 3 per day | Investigate root cause |
| Third-party errors | > 1% error rate | Engage vendor support |
| Team morale | Survey score < 3/5 | 1:1 meetings, address concerns |

### 3.3 Escalation Triggers

| Condition | Escalation Level |
|-----------|------------------|
| Risk score increases | Tech Lead + PM |
| Risk becomes Critical (17+) | Steering Committee |
| Risk materializes | Sponsor notification |
| Multiple risks compound | Emergency meeting |

---

## 4. Contingency Budget

| Category | Allocation | Purpose |
|----------|------------|---------|
| Schedule Buffer | 1 week | Week 12 slack time |
| Budget Reserve | 15% of total | Unexpected costs |
| Contractor Pool | Pre-vetted list | Rapid augmentation |
| Alternative Vendors | Identified | Service fallback |

---

## 5. Risk Response Strategies

### 5.1 Response Types

| Strategy | When to Use | Example |
|----------|-------------|---------|
| **Avoid** | Eliminate the threat entirely | Remove risky feature |
| **Transfer** | Shift to third party | Insurance, outsourcing |
| **Mitigate** | Reduce probability/impact | Testing, redundancy |
| **Accept** | Low risk, not worth addressing | Monitor only |

### 5.2 Response Plan Template

When a risk materializes:

1. **Identify** - Confirm risk has occurred
2. **Assess** - Evaluate actual impact
3. **Notify** - Inform stakeholders per escalation matrix
4. **Execute** - Implement contingency plan
5. **Monitor** - Track resolution progress
6. **Learn** - Post-mortem and process improvement

---

## 6. Risk Communication

### 6.1 Risk Reporting

**Weekly Status Report includes:**
- Top 3 risks this week
- Any new risks identified
- Risks that improved/worsened
- Mitigation progress

**Steering Committee Report includes:**
- Full risk register status
- Critical/High risks deep dive
- Budget impact of risks
- Recommendations

### 6.2 Risk Visualization

**Risk Heat Map (updated bi-weekly):**
```
Impact
   5 │     │     │     │ R-003│ R-007│
   4 │     │     │R-005│R-001│     │
   3 │     │     │R-004│     │     │
   2 │     │R-008│R-002│R-006│     │
   1 │     │     │     │     │     │
     └─────┴─────┴─────┴─────┴─────┘
       1     2     3     4     5
                Probability
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
