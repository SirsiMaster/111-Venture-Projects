# Data Model
## Legacy - The Estate Operating System
**Version:** 1.0.0
**Date:** November 26, 2025
**Database:** PostgreSQL 15

---

## 1. Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      users      │────<│   estate_users  │>────│     estates     │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                                │
         │                                    ┌───────────┼───────────┐
         │                                    │           │           │
         │                             ┌──────┴──────┐    │    ┌──────┴──────┐
         │                             │   assets    │    │    │  documents  │
         │                             └──────┬──────┘    │    └─────────────┘
         │                                    │           │
         │                             ┌──────┴──────┐    │
         │                             │asset_allocs │    │
         │                             └──────┬──────┘    │
         │                                    │           │
         │     ┌─────────────────┐     ┌──────┴──────┐    │
         └────<│    executors    │>────│    heirs    │>───┘
               └─────────────────┘     └─────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  notifications  │>────│     estates     │────<│   audit_logs    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 2. Core Tables

### 2.1 Users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth0_id        VARCHAR(255) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    email_verified  BOOLEAN DEFAULT FALSE,
    
    -- Profile
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(20),
    date_of_birth   DATE,
    address_line1   VARCHAR(255),
    address_line2   VARCHAR(255),
    city            VARCHAR(100),
    state           VARCHAR(50),
    zip_code        VARCHAR(20),
    country         VARCHAR(50) DEFAULT 'US',
    
    -- Identity Verification
    id_verified     BOOLEAN DEFAULT FALSE,
    id_verified_at  TIMESTAMP WITH TIME ZONE,
    id_provider     VARCHAR(50), -- 'persona', 'plaid'
    id_provider_ref VARCHAR(255),
    
    -- Subscription
    tier            VARCHAR(20) DEFAULT 'free', -- 'free', 'concierge', 'white_glove'
    stripe_customer_id VARCHAR(255),
    
    -- Status
    status          VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'deleted'
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_users_status ON users(status);
```

### 2.2 Estates

```sql
CREATE TABLE estates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    
    -- Principal (owner)
    principal_id    UUID NOT NULL REFERENCES users(id),
    
    -- Status
    status          VARCHAR(30) DEFAULT 'active',
    -- 'active', 'death_reported', 'executor_confirmed', 'in_settlement', 'closed'
    
    -- Death info (populated when death reported)
    death_reported_at   TIMESTAMP WITH TIME ZONE,
    death_reported_by   UUID REFERENCES users(id),
    date_of_death       DATE,
    death_certificate_doc_id UUID REFERENCES documents(id),
    
    -- Executor confirmation
    executor_confirmed_at TIMESTAMP WITH TIME ZONE,
    cooling_off_ends_at   TIMESTAMP WITH TIME ZONE,
    
    -- Valuation
    estimated_value DECIMAL(15,2),
    
    -- Settlement
    settled_at      TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_estates_principal ON estates(principal_id);
CREATE INDEX idx_estates_status ON estates(status);
```

### 2.3 Estate Users (Junction Table)

```sql
CREATE TABLE estate_users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id       UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    
    role            VARCHAR(20) NOT NULL, -- 'principal', 'executor', 'heir'
    
    -- Access status
    access_granted  BOOLEAN DEFAULT FALSE,
    access_granted_at TIMESTAMP WITH TIME ZONE,
    
    -- Invitation
    invited_at      TIMESTAMP WITH TIME ZONE,
    invitation_accepted_at TIMESTAMP WITH TIME ZONE,
    invitation_declined_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(estate_id, user_id, role)
);

CREATE INDEX idx_estate_users_estate ON estate_users(estate_id);
CREATE INDEX idx_estate_users_user ON estate_users(user_id);
```

---

## 3. Asset Tables

### 3.1 Assets (Base)

```sql
CREATE TABLE assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id       UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
    
    -- Classification
    category        VARCHAR(30) NOT NULL,
    -- 'financial', 'real_estate', 'vehicle', 'digital', 'personal_property'
    
    -- Common fields
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    estimated_value DECIMAL(15,2),
    notes           TEXT,
    
    -- Category-specific data (JSONB for flexibility)
    metadata        JSONB DEFAULT '{}',
    
    -- Related document
    primary_document_id UUID REFERENCES documents(id),
    
    -- Status
    status          VARCHAR(20) DEFAULT 'active', -- 'active', 'transferred', 'archived'
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_assets_estate ON assets(estate_id);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_metadata ON assets USING GIN(metadata);
```

### 3.2 Asset Metadata Examples

```json
// Financial Asset
{
  "institution_name": "Chase Bank",
  "account_type": "checking",
  "account_number_last4": "1234",
  "is_primary": true,
  "plaid_account_id": null
}

// Real Estate
{
  "address": {
    "line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "property_type": "single_family",
  "ownership_type": "sole",
  "mortgage_holder": "Wells Fargo",
  "has_hoa": true
}

// Vehicle
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "vin": "1HGBH41JXMN109186",
  "is_leased": false,
  "lien_holder": null
}

// Digital
{
  "service_name": "Gmail",
  "service_type": "email",
  "username": "example@gmail.com",
  "desired_action": "delete",
  "has_recovery_codes": true
}

// Personal Property
{
  "item_type": "jewelry",
  "condition": "excellent",
  "provenance": "Inherited from grandmother",
  "appraisal_date": "2024-01-15"
}
```

### 3.3 Asset Allocations

```sql
CREATE TABLE asset_allocations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id        UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    heir_id         UUID NOT NULL REFERENCES heirs(id) ON DELETE CASCADE,
    
    -- Allocation
    percentage      DECIMAL(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
    
    -- Conditions
    condition_type  VARCHAR(30), -- 'none', 'age', 'date', 'milestone'
    condition_value JSONB,
    
    -- Notes
    notes           TEXT,
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_asset_allocations_asset ON asset_allocations(asset_id);
CREATE INDEX idx_asset_allocations_heir ON asset_allocations(heir_id);

-- Constraint: total allocation per asset cannot exceed 100%
-- (enforced at application level)
```

---

## 4. Beneficiary Tables

### 4.1 Executors

```sql
CREATE TABLE executors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id       UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
    
    -- Executor info (may or may not have user account)
    user_id         UUID REFERENCES users(id),
    email           VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    relationship    VARCHAR(100),
    
    -- Role
    priority        INTEGER DEFAULT 1, -- 1 = primary, 2+ = alternate
    
    -- Invitation & Confirmation
    invitation_token    VARCHAR(255),
    invitation_sent_at  TIMESTAMP WITH TIME ZONE,
    invitation_accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Post-death confirmation
    confirmed_death     BOOLEAN DEFAULT FALSE,
    confirmed_death_at  TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status          VARCHAR(20) DEFAULT 'pending',
    -- 'pending', 'invited', 'accepted', 'declined', 'active', 'removed'
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_executors_estate ON executors(estate_id);
CREATE INDEX idx_executors_user ON executors(user_id);
CREATE INDEX idx_executors_email ON executors(email);
```

### 4.2 Heirs

```sql
CREATE TABLE heirs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id       UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
    
    -- Heir info
    user_id         UUID REFERENCES users(id),
    email           VARCHAR(255),
    full_name       VARCHAR(255) NOT NULL,
    date_of_birth   DATE,
    relationship    VARCHAR(100),
    is_minor        BOOLEAN DEFAULT FALSE,
    
    -- Guardian (if minor)
    guardian_name   VARCHAR(255),
    guardian_email  VARCHAR(255),
    
    -- Residuary designation
    is_residuary    BOOLEAN DEFAULT FALSE, -- receives unallocated assets
    residuary_percentage DECIMAL(5,2),
    
    -- Notification
    notified_at     TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status          VARCHAR(20) DEFAULT 'active', -- 'active', 'removed'
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_heirs_estate ON heirs(estate_id);
CREATE INDEX idx_heirs_user ON heirs(user_id);
```

---

## 5. Document Tables

### 5.1 Documents

```sql
CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id       UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
    
    -- File info
    original_name   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(255),
    mime_type       VARCHAR(100) NOT NULL,
    file_size       BIGINT NOT NULL,
    
    -- Storage
    s3_key          VARCHAR(500) NOT NULL,
    s3_bucket       VARCHAR(255) NOT NULL,
    
    -- Encryption
    encryption_key_id VARCHAR(255), -- KMS key ID
    
    -- Organization
    folder_id       UUID REFERENCES document_folders(id),
    tags            TEXT[],
    
    -- OCR
    ocr_processed   BOOLEAN DEFAULT FALSE,
    ocr_text        TEXT,
    ocr_processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Version
    version         INTEGER DEFAULT 1,
    previous_version_id UUID REFERENCES documents(id),
    
    -- Status
    status          VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'deleted'
    
    -- Timestamps
    uploaded_by     UUID REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_estate ON documents(estate_id);
CREATE INDEX idx_documents_folder ON documents(folder_id);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_documents_ocr ON documents USING GIN(to_tsvector('english', ocr_text));
```

### 5.2 Document Folders

```sql
CREATE TABLE document_folders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id       UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
    
    name            VARCHAR(255) NOT NULL,
    parent_id       UUID REFERENCES document_folders(id),
    is_system       BOOLEAN DEFAULT FALSE, -- system folders can't be deleted
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_document_folders_estate ON document_folders(estate_id);
CREATE INDEX idx_document_folders_parent ON document_folders(parent_id);
```

---

## 6. Notification Tables

### 6.1 Notifications (Institutional)

```sql
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id       UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
    asset_id        UUID REFERENCES assets(id),
    
    -- Institution
    institution_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(50), -- 'bank', 'insurance', 'utility', 'government', 'credit_bureau'
    
    -- Letter
    letter_template_id UUID REFERENCES notification_templates(id),
    generated_letter_doc_id UUID REFERENCES documents(id),
    
    -- Tracking
    tracking_number VARCHAR(100),
    
    -- Status
    status          VARCHAR(30) DEFAULT 'pending',
    -- 'pending', 'generated', 'sent', 'delivered', 'acknowledged', 'completed', 'failed'
    
    -- Dates
    generated_at    TIMESTAMP WITH TIME ZONE,
    sent_at         TIMESTAMP WITH TIME ZONE,
    sent_method     VARCHAR(20), -- 'email', 'mail', 'certified_mail', 'fax'
    delivered_at    TIMESTAMP WITH TIME ZONE,
    response_received_at TIMESTAMP WITH TIME ZONE,
    response_doc_id UUID REFERENCES documents(id),
    
    -- Notes
    notes           TEXT,
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_estate ON notifications(estate_id);
CREATE INDEX idx_notifications_status ON notifications(status);
```

### 6.2 Notification Templates

```sql
CREATE TABLE notification_templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    institution_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(50),
    
    -- Template
    template_body   TEXT NOT NULL,
    required_fields JSONB, -- fields needed from estate/user
    
    -- Contact info
    mailing_address TEXT,
    fax_number      VARCHAR(20),
    email           VARCHAR(255),
    phone           VARCHAR(20),
    
    -- Metadata
    is_active       BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 7. System Tables

### 7.1 Audit Logs

```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Context
    estate_id       UUID REFERENCES estates(id),
    user_id         UUID REFERENCES users(id),
    
    -- Action
    action          VARCHAR(50) NOT NULL,
    -- 'create', 'read', 'update', 'delete', 'login', 'logout', 'export', etc.
    
    resource_type   VARCHAR(50) NOT NULL,
    -- 'user', 'estate', 'asset', 'document', 'executor', 'heir', etc.
    
    resource_id     UUID,
    
    -- Details
    old_values      JSONB,
    new_values      JSONB,
    
    -- Request info
    ip_address      INET,
    user_agent      TEXT,
    request_id      VARCHAR(100),
    
    -- Timestamp
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partition by month for performance
CREATE INDEX idx_audit_logs_estate ON audit_logs(estate_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

### 7.2 Payments

```sql
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    
    -- Amount
    amount_cents    INTEGER NOT NULL,
    currency        VARCHAR(3) DEFAULT 'USD',
    
    -- Product
    product_type    VARCHAR(50) NOT NULL, -- 'concierge', 'white_glove'
    
    -- Status
    status          VARCHAR(20) NOT NULL,
    -- 'pending', 'succeeded', 'failed', 'refunded'
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_intent_id);
```

### 7.3 Contacts

```sql
CREATE TABLE contacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id       UUID NOT NULL REFERENCES estates(id) ON DELETE CASCADE,
    
    -- Contact info
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(20),
    
    -- Address
    address_line1   VARCHAR(255),
    address_line2   VARCHAR(255),
    city            VARCHAR(100),
    state           VARCHAR(50),
    zip_code        VARCHAR(20),
    
    -- Classification
    category        VARCHAR(30),
    -- 'family', 'financial', 'legal', 'medical', 'other'
    
    relationship    VARCHAR(100),
    notes           TEXT,
    
    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contacts_estate ON contacts(estate_id);
CREATE INDEX idx_contacts_category ON contacts(category);
```

---

## 8. Database Configuration

### 8.1 Extensions

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search
```

### 8.2 Row-Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE estates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Example policy (actual implementation via application JWT claims)
CREATE POLICY estate_access ON estates
    FOR ALL
    USING (
        principal_id = current_setting('app.current_user_id')::UUID
        OR id IN (
            SELECT estate_id FROM estate_users 
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND access_granted = TRUE
        )
    );
```

### 8.3 Indexes Summary

| Table | Index | Columns | Type |
|-------|-------|---------|------|
| users | idx_users_email | email | B-tree |
| estates | idx_estates_principal | principal_id | B-tree |
| assets | idx_assets_metadata | metadata | GIN |
| documents | idx_documents_ocr | ocr_text | GIN (full-text) |
| audit_logs | idx_audit_logs_created | created_at | B-tree |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
