# Change Management Plan
## Legacy - The Estate Operating System
**Version:** 1.0.0 | **Date:** November 26, 2025

---

## 1. Change Control Process

### 1.1 Change Request Workflow
1. Requestor submits CR via Linear/Jira
2. PM assesses impact (time, cost, scope)
3. Tech Lead reviews technical feasibility
4. PO prioritizes against backlog
5. Steering Committee approves (if >40 hours)
6. Scope document updated
7. Backlog adjusted

### 1.2 Approval Authority
| Change Size | Approver |
|-------------|----------|
| < 8 hours | Tech Lead |
| 8-40 hours | Product Owner |
| > 40 hours | Steering Committee |

## 2. Version Control

### 2.1 Branching Strategy
- `main` - Production-ready code
- `staging` - Pre-production testing
- `feature/*` - Feature branches
- `hotfix/*` - Emergency fixes

### 2.2 Commit Standards
- Conventional commits (feat:, fix:, docs:, etc.)
- PR required for all changes
- Squash merge to main

## 3. Release Management

### 3.1 Release Types
| Type | Cadence | Process |
|------|---------|---------|
| Major | Quarterly | Full QA cycle |
| Minor | Bi-weekly | Sprint release |
| Patch | As needed | Hotfix process |

### 3.2 Release Checklist
- [ ] All tests passing
- [ ] Release notes prepared
- [ ] Stakeholders notified
- [ ] Rollback plan ready
- [ ] Monitoring verified

## 4. Rollback Procedures

### 4.1 Application Rollback
- Revert to previous ECS task definition
- Or force deployment of previous image

### 4.2 Database Rollback
- Point-in-time recovery (RDS)
- Or manual migration rollback

---

## Document Control
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
