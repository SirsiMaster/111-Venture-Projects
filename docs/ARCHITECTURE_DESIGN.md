# Architecture Design Document
## Legacy - The Estate Operating System
**Version:** 2.0.0
**Date:** November 26, 2025

---

## 1. Architecture Overview

### 1.1 Development Model
**AI-Agentic Development** - This platform is built using Claude and AI tools as the development team, with human oversight only. No traditional human development team.

### 1.2 System Context

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SYSTEMS                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Stripe    SendGrid    Claude/Vertex AI    Persona    MCP Servers       │
└────────┬──────────┬─────────┬───────────┬───────────────┬───────────────┘
         │          │         │           │               │
         └──────────┴─────────┴───────────┴───────────────┘
                              │
┌─────────────────────────────┴─────────────────────────────┐
│                      LEGACY PLATFORM                       │
├───────────────────────────────────────────────────────────┤
│   ┌─────────────────────────────────────────────────┐     │
│   │         Web App + PWA (Firebase Hosting)        │     │
│   │         Static HTML/CSS/JS + UCS Components     │     │
│   └──────────────────────┬──────────────────────────┘     │
│                          │                                │
│          ┌───────────────┼───────────────┐                │
│          │               │               │                │
│   ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐        │
│   │  Firebase   │ │  Firestore  │ │   Cloud     │        │
│   │  Functions  │ │  (NoSQL DB) │ │   Storage   │        │
│   └─────────────┘ └─────────────┘ └─────────────┘        │
│                          │                                │
│                   ┌──────┴──────┐                         │
│                   │   Firebase  │                         │
│                   │     Auth    │                         │
│                   └─────────────┘                         │
│                          │                                │
│                   ┌──────┴──────┐                         │
│                   │  LLM Agent  │                         │
│                   │   Engine    │                         │
│                   └─────────────┘                         │
└───────────────────────────────────────────────────────────┘
```

### 1.3 Technology Stack (GCP/Firebase)

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Backend** | Firebase Functions | Serverless, auto-scaling, integrated with Firestore |
| **Database** | Firestore | NoSQL, real-time sync, offline support, scalable |
| **Auth** | Firebase Authentication | MFA support, multiple providers, secure |
| **Storage** | Cloud Storage for Firebase | Encrypted documents, CDN-backed |
| **Hosting** | Firebase Hosting | Global CDN, automatic SSL, PWA support |
| **AI/LLM** | Vertex AI / Claude API | Process intelligence, document understanding |
| **Integrations** | MCP (Model Context Protocol) | Tool automation, API orchestration |
| **CI/CD** | GitHub Actions → Firebase | Automated deployment pipeline |

### 1.3 Architecture Principles

1. **Security First** - All data encrypted at rest and in transit
2. **API-First** - All functionality exposed via versioned REST APIs
3. **Stateless Services** - Horizontal scaling without session affinity
4. **Infrastructure as Code** - All infrastructure defined in Terraform
5. **Observable** - Comprehensive logging, metrics, and tracing
6. **Fail Gracefully** - Circuit breakers, fallbacks, graceful degradation

---

## 2. Backend Architecture (Go)

### 2.1 Project Structure

```
legacy-api/
├── cmd/
│   └── api/
│       └── main.go              # Application entry point
├── internal/
│   ├── api/
│   │   ├── handlers/            # HTTP handlers
│   │   ├── middleware/          # Auth, logging, rate limiting
│   │   └── routes.go            # Route definitions
│   ├── domain/
│   │   ├── user/                # User domain logic
│   │   ├── estate/              # Estate domain logic
│   │   ├── asset/               # Asset domain logic
│   │   ├── document/            # Document domain logic
│   │   └── notification/        # Notification domain logic
│   ├── repository/
│   │   ├── postgres/            # PostgreSQL implementations
│   │   └── redis/               # Redis implementations
│   ├── service/
│   │   ├── auth/                # Auth0 integration
│   │   ├── storage/             # S3 integration
│   │   ├── payment/             # Stripe integration
│   │   └── email/               # SendGrid integration
│   └── config/
│       └── config.go            # Configuration management
├── pkg/
│   ├── validator/               # Input validation
│   ├── crypto/                  # Encryption utilities
│   └── logger/                  # Structured logging
├── migrations/                  # Database migrations
├── docs/                        # OpenAPI specs
├── Dockerfile
├── docker-compose.yml
└── go.mod
```

### 2.2 Key Components

#### HTTP Server
- **Framework:** Chi Router (lightweight, stdlib compatible)
- **Middleware Stack:**
  - Request ID generation
  - Structured logging
  - CORS configuration
  - Authentication (JWT validation)
  - Rate limiting
  - Request/response compression

#### Domain Layer
- Business logic isolated from HTTP layer
- Interface-based dependencies for testability
- Domain events for cross-cutting concerns

#### Repository Layer
- PostgreSQL for persistent storage
- Redis for caching and sessions
- Repository pattern with interfaces

### 2.3 API Design

```
Base URL: https://api.legacy.app/v1

Authentication:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/logout
  POST   /auth/refresh
  POST   /auth/mfa/setup
  POST   /auth/mfa/verify
  POST   /auth/password/reset
  POST   /auth/password/change

Users:
  GET    /users/me
  PUT    /users/me
  DELETE /users/me
  POST   /users/me/identity/verify

Estates:
  POST   /estates
  GET    /estates
  GET    /estates/:id
  PUT    /estates/:id
  DELETE /estates/:id

Assets:
  POST   /estates/:id/assets
  GET    /estates/:id/assets
  GET    /estates/:id/assets/:assetId
  PUT    /estates/:id/assets/:assetId
  DELETE /estates/:id/assets/:assetId

Documents:
  POST   /estates/:id/documents
  GET    /estates/:id/documents
  GET    /estates/:id/documents/:docId
  DELETE /estates/:id/documents/:docId
  GET    /estates/:id/documents/:docId/download

Beneficiaries:
  POST   /estates/:id/executors
  GET    /estates/:id/executors
  DELETE /estates/:id/executors/:execId
  POST   /estates/:id/heirs
  GET    /estates/:id/heirs
  DELETE /estates/:id/heirs/:heirId

Notifications:
  POST   /estates/:id/notifications/generate
  GET    /estates/:id/notifications
  PUT    /estates/:id/notifications/:notifId

Payments:
  POST   /payments/checkout
  GET    /payments/status
  POST   /payments/webhook (Stripe)
```

---

## 3. Frontend Architecture (Next.js)

### 3.1 Project Structure

```
legacy-web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── assets/
│   │   ├── documents/
│   │   ├── beneficiaries/
│   │   └── settings/
│   ├── (executor)/
│   │   ├── activate/
│   │   ├── notifications/
│   │   └── progress/
│   ├── api/                      # API routes (BFF)
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Design system components
│   ├── forms/                    # Form components
│   ├── layouts/                  # Layout components
│   └── features/                 # Feature-specific components
├── lib/
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Auth utilities
│   └── utils.ts                  # Helper functions
├── hooks/
│   ├── useAuth.ts
│   ├── useEstate.ts
│   └── useDocuments.ts
├── stores/
│   └── zustand/                  # State management
├── styles/
│   └── globals.css               # Tailwind + custom styles
├── public/
├── next.config.js
├── tailwind.config.js
└── package.json
```

### 3.2 Key Patterns

#### State Management
- **Server State:** TanStack Query (React Query)
- **Client State:** Zustand (lightweight, hooks-based)
- **Forms:** React Hook Form + Zod validation

#### Styling
- **Framework:** Tailwind CSS
- **Components:** shadcn/ui (Radix-based)
- **Animations:** Framer Motion

#### Authentication
- Auth0 React SDK for SSO
- JWT stored in httpOnly cookies
- Silent token refresh

### 3.3 Design System

Following the established Legacy brand:
- **Colors:** Royal Blue (#1e3a8a), Gold (#C8A951), Navy (#0f172a)
- **Typography:** Cinzel (headings), Inter (body)
- **Components:** Glass panels, gold accents, status dots

---

## 4. Mobile Architecture (Flutter)

### 4.1 Project Structure

```
legacy_mobile/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart              # App configuration
│   │   └── routes.dart           # Navigation
│   ├── core/
│   │   ├── api/                  # API client (Dio)
│   │   ├── auth/                 # Auth service
│   │   ├── storage/              # Secure storage
│   │   └── constants/            # App constants
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   ├── dashboard/
│   │   ├── assets/
│   │   ├── documents/
│   │   ├── beneficiaries/
│   │   └── settings/
│   ├── shared/
│   │   ├── widgets/              # Reusable widgets
│   │   └── theme/                # App theme
│   └── utils/
├── test/
├── ios/
├── android/
├── pubspec.yaml
└── analysis_options.yaml
```

### 4.2 Architecture Pattern

**Clean Architecture with BLoC:**
- **Presentation:** Flutter widgets, BLoC for state
- **Domain:** Use cases, entities, repository interfaces
- **Data:** Repository implementations, data sources, models

### 4.3 Key Features

| Feature | Implementation |
|---------|----------------|
| State Management | flutter_bloc |
| Navigation | go_router |
| API Client | dio + retrofit |
| Local Storage | flutter_secure_storage |
| Biometrics | local_auth |
| Camera/Scan | camera + google_mlkit_document_scanner |
| Push Notifications | firebase_messaging |
| Offline Support | hive (local DB) |

---

## 5. Infrastructure Architecture (AWS)

### 5.1 Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           AWS Cloud                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    VPC (10.0.0.0/16)                     │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │              Public Subnets (10.0.1.0/24)        │   │    │
│  │  │   ┌─────────┐    ┌─────────┐    ┌─────────┐     │   │    │
│  │  │   │   ALB   │    │   NAT   │    │   NAT   │     │   │    │
│  │  │   │         │    │ Gateway │    │ Gateway │     │   │    │
│  │  │   │         │    │  (AZ-a) │    │  (AZ-b) │     │   │    │
│  │  │   └─────────┘    └─────────┘    └─────────┘     │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                          │                               │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │             Private Subnets (10.0.2.0/24)        │   │    │
│  │  │   ┌─────────┐    ┌─────────┐                     │   │    │
│  │  │   │   ECS   │    │   ECS   │    (Auto-scaling)   │   │    │
│  │  │   │ Fargate │    │ Fargate │                     │   │    │
│  │  │   │  (AZ-a) │    │  (AZ-b) │                     │   │    │
│  │  │   └─────────┘    └─────────┘                     │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                          │                               │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │              Data Subnets (10.0.3.0/24)          │   │    │
│  │  │   ┌─────────┐    ┌─────────┐    ┌─────────┐     │   │    │
│  │  │   │   RDS   │    │   RDS   │    │  Redis  │     │   │    │
│  │  │   │ Primary │    │ Standby │    │ Cluster │     │   │    │
│  │  │   │  (AZ-a) │    │  (AZ-b) │    │         │     │   │    │
│  │  │   └─────────┘    └─────────┘    └─────────┘     │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │    S3     │  │CloudFront │  │    SES    │  │    KMS    │    │
│  │(Documents)│  │   (CDN)   │  │  (Email)  │  │  (Keys)   │    │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 AWS Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **ECS Fargate** | Container hosting | Auto-scaling 2-10 tasks |
| **RDS PostgreSQL** | Primary database | db.r6g.large, Multi-AZ |
| **ElastiCache Redis** | Caching, sessions | cache.t4g.medium, cluster mode |
| **S3** | Document storage | Versioning, encryption (SSE-KMS) |
| **CloudFront** | CDN | Edge locations, WAF integration |
| **ALB** | Load balancing | HTTPS termination, health checks |
| **Route 53** | DNS | Hosted zone, health checks |
| **ACM** | SSL certificates | Wildcard cert for *.legacy.app |
| **KMS** | Key management | Customer-managed keys |
| **WAF** | Web firewall | SQL injection, XSS protection |
| **CloudWatch** | Monitoring | Logs, metrics, alarms |
| **Secrets Manager** | Secrets storage | API keys, database credentials |

### 5.3 Environment Strategy

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| **Development** | Local development | Docker Compose |
| **Staging** | Integration testing | Single-AZ, reduced capacity |
| **Production** | Live system | Multi-AZ, full capacity |

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│ Client  │────▶│ Auth0   │────▶│   API   │
│         │◀────│ App     │◀────│         │◀────│         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │                │               │               │
     │  1. Login      │               │               │
     │───────────────▶│               │               │
     │                │  2. Redirect  │               │
     │                │──────────────▶│               │
     │                │               │  3. Verify    │
     │                │  4. Tokens    │               │
     │                │◀──────────────│               │
     │                │               │               │
     │                │  5. API Call  │               │
     │                │  (JWT header) │               │
     │                │───────────────┼──────────────▶│
     │                │               │  6. Validate  │
     │                │  7. Response  │               │
     │                │◀──────────────┼───────────────│
     │  8. Data       │               │               │
     │◀───────────────│               │               │
```

### 6.2 Data Encryption

| Data Type | At Rest | In Transit |
|-----------|---------|------------|
| User data | AES-256 (RDS) | TLS 1.3 |
| Documents | AES-256 (S3 SSE-KMS) | TLS 1.3 |
| Secrets | AWS Secrets Manager | TLS 1.3 |
| Sessions | Redis AUTH + TLS | TLS 1.3 |

### 6.3 Access Control

- **Role-Based Access Control (RBAC)**
  - Principal: Full access to own estate
  - Executor: Access after activation, limited pre-death
  - Heir: View-only after activation
  - Admin: System administration

- **Resource-Based Access**
  - Every resource scoped to estate_id
  - Middleware validates ownership on every request

---

## 7. Scalability & Performance

### 7.1 Scaling Strategy

| Component | Scaling Type | Trigger |
|-----------|--------------|---------|
| ECS Tasks | Horizontal | CPU > 70%, Memory > 80% |
| RDS | Vertical + Read Replicas | Connection count, CPU |
| Redis | Cluster mode | Memory utilization |
| S3 | Automatic | N/A |

### 7.2 Caching Strategy

| Cache Layer | Data | TTL |
|-------------|------|-----|
| CloudFront | Static assets | 24 hours |
| Redis | Session data | 30 minutes |
| Redis | API responses | 5 minutes |
| Application | Config | 1 hour |

### 7.3 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API P95 Latency | < 200ms | CloudWatch |
| Page Load (LCP) | < 2.5s | Core Web Vitals |
| Time to Interactive | < 3.5s | Lighthouse |
| Error Rate | < 0.1% | Application logs |

---

## 8. Observability

### 8.1 Logging

- **Format:** Structured JSON
- **Levels:** DEBUG, INFO, WARN, ERROR
- **Storage:** CloudWatch Logs → S3 (long-term)
- **Retention:** 30 days hot, 1 year cold

### 8.2 Metrics

- **Infrastructure:** CloudWatch metrics
- **Application:** Custom metrics via CloudWatch
- **Business:** Analytics via Mixpanel/Amplitude

### 8.3 Alerting

| Alert | Condition | Channel |
|-------|-----------|---------|
| High Error Rate | > 1% for 5 min | PagerDuty |
| High Latency | P95 > 500ms for 5 min | Slack |
| Database Connection | > 80% pool | PagerDuty |
| Disk Space | > 80% used | Slack |

---

## 9. Disaster Recovery

### 9.1 Backup Strategy

| Data | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| RDS | Daily + continuous | 30 days | Cross-region |
| S3 | Real-time replication | Indefinite | Cross-region |
| Redis | Daily snapshot | 7 days | Same region |

### 9.2 Recovery Objectives

- **RPO (Recovery Point Objective):** < 1 hour
- **RTO (Recovery Time Objective):** < 4 hours

### 9.3 Failover Process

1. Automated health checks detect failure
2. Route 53 failover to standby region
3. RDS promotes read replica
4. ECS scales in secondary region
5. Alert operations team

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
