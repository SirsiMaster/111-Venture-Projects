# Technical Design Document
## Legacy - The Estate Operating System
**Version:** 1.0.0
**Date:** November 26, 2025

---

## 1. Overview

This document provides detailed technical design specifications for key system components, integration patterns, and implementation guidelines.

---

## 2. Authentication & Authorization

### 2.1 Auth0 Integration

**Configuration:**
```go
// Auth0 configuration
type Auth0Config struct {
    Domain       string // legacy.us.auth0.com
    ClientID     string
    ClientSecret string
    Audience     string // https://api.legacy.app
    CallbackURL  string
}
```

**Token Validation Middleware:**
```go
func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Extract token from Authorization header
        token := extractBearerToken(r)
        if token == "" {
            respondError(w, 401, "Missing authorization token")
            return
        }
        
        // Validate JWT with Auth0
        claims, err := validateJWT(token)
        if err != nil {
            respondError(w, 401, "Invalid token")
            return
        }
        
        // Add user context
        ctx := context.WithValue(r.Context(), "user", claims)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

### 2.2 Multi-Factor Authentication

**TOTP Implementation:**
- Library: `github.com/pquerna/otp`
- Backup codes: 10 single-use codes stored hashed
- Recovery: Email-based with identity verification

### 2.3 Role-Based Access Control

**Permission Matrix:**

| Resource | Principal | Executor (Pre-Death) | Executor (Post-Death) | Heir |
|----------|-----------|---------------------|----------------------|------|
| Estate | CRUD | R | CRUD | R |
| Assets | CRUD | - | RU | R |
| Documents | CRUD | - | CRUD | R |
| Beneficiaries | CRUD | - | R | - |
| Notifications | - | - | CRUD | R |

**Implementation:**
```go
type Permission string

const (
    PermissionEstateRead   Permission = "estate:read"
    PermissionEstateWrite  Permission = "estate:write"
    PermissionAssetRead    Permission = "asset:read"
    PermissionAssetWrite   Permission = "asset:write"
    // ...
)

func HasPermission(ctx context.Context, resource string, action string) bool {
    user := ctx.Value("user").(*UserClaims)
    estate := ctx.Value("estate").(*Estate)
    
    role := getUserRoleForEstate(user.ID, estate.ID)
    
    // Check estate status for executor permissions
    if role == "executor" && estate.Status == "active" {
        return false // No access pre-death
    }
    
    return permissionMatrix[role][resource+":"+action]
}
```

---

## 3. Document Management

### 3.1 Upload Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Client  │────▶│   API   │────▶│   S3    │────▶│ Lambda  │
│         │     │         │     │         │     │  (OCR)  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │               │               │               │
     │  1. Request   │               │               │
     │  presigned URL│               │               │
     │──────────────▶│               │               │
     │               │  2. Generate  │               │
     │  3. Presigned │  presigned URL│               │
     │     URL       │               │               │
     │◀──────────────│               │               │
     │               │               │               │
     │  4. Upload    │               │               │
     │  directly to S3               │               │
     │──────────────────────────────▶│               │
     │               │               │  5. S3 Event  │
     │               │               │──────────────▶│
     │               │               │               │
     │               │  6. Update    │  7. OCR       │
     │               │  document     │  Processing   │
     │               │◀──────────────┼───────────────│
     │  8. Confirm   │               │               │
     │◀──────────────│               │               │
```

**Presigned URL Generation:**
```go
func GeneratePresignedUploadURL(estateID, filename string) (*PresignedURL, error) {
    // Generate unique S3 key
    key := fmt.Sprintf("estates/%s/documents/%s/%s", 
        estateID, 
        uuid.New().String(),
        sanitizeFilename(filename))
    
    // Create presigned URL (15 min expiry)
    req, _ := s3Client.PutObjectRequest(&s3.PutObjectInput{
        Bucket:               aws.String(bucket),
        Key:                  aws.String(key),
        ServerSideEncryption: aws.String("aws:kms"),
        SSEKMSKeyId:          aws.String(kmsKeyID),
    })
    
    url, err := req.Presign(15 * time.Minute)
    if err != nil {
        return nil, err
    }
    
    return &PresignedURL{
        URL:       url,
        Key:       key,
        ExpiresAt: time.Now().Add(15 * time.Minute),
    }, nil
}
```

### 3.2 OCR Processing

**AWS Textract Integration:**
```go
func ProcessDocumentOCR(s3Key string) (*OCRResult, error) {
    // Start async document analysis
    startResp, err := textractClient.StartDocumentTextDetection(&textract.StartDocumentTextDetectionInput{
        DocumentLocation: &textract.DocumentLocation{
            S3Object: &textract.S3Object{
                Bucket: aws.String(bucket),
                Name:   aws.String(s3Key),
            },
        },
        NotificationChannel: &textract.NotificationChannel{
            SNSTopicArn: aws.String(snsTopicARN),
            RoleArn:     aws.String(textractRoleARN),
        },
    })
    
    return &OCRResult{
        JobID:  *startResp.JobId,
        Status: "processing",
    }, nil
}

// Called by Lambda when Textract completes
func HandleTextractComplete(jobID string) error {
    // Get results
    resp, err := textractClient.GetDocumentTextDetection(&textract.GetDocumentTextDetectionInput{
        JobId: aws.String(jobID),
    })
    
    // Extract text
    var fullText strings.Builder
    for _, block := range resp.Blocks {
        if *block.BlockType == "LINE" {
            fullText.WriteString(*block.Text)
            fullText.WriteString("\n")
        }
    }
    
    // Update document record
    return updateDocumentOCR(jobID, fullText.String())
}
```

### 3.3 Encryption

**Per-Document Encryption Keys:**
```go
func EncryptDocument(data []byte, estateID string) ([]byte, string, error) {
    // Generate data key using KMS
    keyResp, err := kmsClient.GenerateDataKey(&kms.GenerateDataKeyInput{
        KeyId:   aws.String(masterKeyID),
        KeySpec: aws.String("AES_256"),
        EncryptionContext: map[string]*string{
            "estate_id": aws.String(estateID),
        },
    })
    
    // Encrypt document with data key
    block, _ := aes.NewCipher(keyResp.Plaintext)
    gcm, _ := cipher.NewGCM(block)
    nonce := make([]byte, gcm.NonceSize())
    io.ReadFull(rand.Reader, nonce)
    
    ciphertext := gcm.Seal(nonce, nonce, data, nil)
    
    // Return ciphertext and encrypted data key
    return ciphertext, base64.StdEncoding.EncodeToString(keyResp.CiphertextBlob), nil
}
```

---

## 4. Estate Settlement Workflow

### 4.1 State Machine

```
                    ┌─────────────┐
                    │   ACTIVE    │
                    │ (Principal  │
                    │  Building)  │
                    └──────┬──────┘
                           │
                    Death Reported
                           │
                    ┌──────▼──────┐
                    │   DEATH_    │
                    │  REPORTED   │
                    └──────┬──────┘
                           │
                    Executor(s) Confirm
                           │
                    ┌──────▼──────┐
                    │  EXECUTOR_  │
                    │  CONFIRMED  │
                    └──────┬──────┘
                           │
                    72hr Cooling Off
                           │
                    ┌──────▼──────┐
                    │    IN_      │
                    │ SETTLEMENT  │
                    └──────┬──────┘
                           │
                    All Tasks Complete
                           │
                    ┌──────▼──────┐
                    │   CLOSED    │
                    └─────────────┘
```

**State Transition Logic:**
```go
type EstateStatus string

const (
    EstateStatusActive           EstateStatus = "active"
    EstateStatusDeathReported    EstateStatus = "death_reported"
    EstateStatusExecutorConfirmed EstateStatus = "executor_confirmed"
    EstateStatusInSettlement     EstateStatus = "in_settlement"
    EstateStatusClosed           EstateStatus = "closed"
)

func (e *Estate) TransitionTo(newStatus EstateStatus) error {
    validTransitions := map[EstateStatus][]EstateStatus{
        EstateStatusActive:           {EstateStatusDeathReported},
        EstateStatusDeathReported:    {EstateStatusExecutorConfirmed},
        EstateStatusExecutorConfirmed: {EstateStatusInSettlement},
        EstateStatusInSettlement:     {EstateStatusClosed},
    }
    
    allowed := validTransitions[e.Status]
    for _, s := range allowed {
        if s == newStatus {
            e.Status = newStatus
            return nil
        }
    }
    
    return ErrInvalidStateTransition
}
```

### 4.2 Multi-Executor Confirmation

**2-of-3 Confirmation Logic:**
```go
func CheckExecutorConfirmation(estateID uuid.UUID) (*ConfirmationStatus, error) {
    estate, _ := getEstate(estateID)
    executors, _ := getExecutors(estateID)
    
    // Count confirmations
    confirmed := 0
    for _, exec := range executors {
        if exec.ConfirmedDeath {
            confirmed++
        }
    }
    
    // High-value estates require 2-of-3
    requiredConfirmations := 1
    if estate.EstimatedValue > 100000 {
        requiredConfirmations = min(2, len(executors))
    }
    
    if confirmed >= requiredConfirmations {
        // Transition estate and start cooling-off
        estate.TransitionTo(EstateStatusExecutorConfirmed)
        estate.CoolingOffEndsAt = time.Now().Add(72 * time.Hour)
        
        // Schedule cooling-off completion job
        scheduler.ScheduleAt(estate.CoolingOffEndsAt, "complete_cooling_off", estateID)
    }
    
    return &ConfirmationStatus{
        Required:  requiredConfirmations,
        Confirmed: confirmed,
        Complete:  confirmed >= requiredConfirmations,
    }, nil
}
```

### 4.3 Notification Letter Generation

**Template Processing:**
```go
type NotificationData struct {
    DeceasedName     string
    DateOfDeath      string
    ExecutorName     string
    ExecutorAddress  string
    DeathCertNumber  string
    AccountNumber    string
    InstitutionName  string
    RequestType      string // "close", "transfer", "freeze"
}

func GenerateNotificationLetter(templateID uuid.UUID, data *NotificationData) ([]byte, error) {
    // Load template
    template, _ := getNotificationTemplate(templateID)
    
    // Parse and execute template
    tmpl, _ := template.New("letter").Parse(template.TemplateBody)
    
    var buf bytes.Buffer
    if err := tmpl.Execute(&buf, data); err != nil {
        return nil, err
    }
    
    // Generate PDF
    pdf := gopdf.GoPdf{}
    pdf.Start(gopdf.Config{PageSize: *gopdf.PageSizeA4})
    pdf.AddPage()
    
    // Add letterhead, body, signature block
    // ...
    
    return pdf.GetBytesPdf(), nil
}
```

---

## 5. Payment Integration

### 5.1 Stripe Checkout Flow

```go
func CreateCheckoutSession(userID uuid.UUID, tier string) (*stripe.CheckoutSession, error) {
    user, _ := getUser(userID)
    
    prices := map[string]string{
        "concierge":   "price_xxx", // $2,997
        "white_glove": "price_yyy", // $9,997
    }
    
    params := &stripe.CheckoutSessionParams{
        Customer:   stripe.String(user.StripeCustomerID),
        Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
        SuccessURL: stripe.String("https://app.legacy.app/payment/success?session_id={CHECKOUT_SESSION_ID}"),
        CancelURL:  stripe.String("https://app.legacy.app/pricing"),
        LineItems: []*stripe.CheckoutSessionLineItemParams{
            {
                Price:    stripe.String(prices[tier]),
                Quantity: stripe.Int64(1),
            },
        },
        Metadata: map[string]string{
            "user_id": userID.String(),
            "tier":    tier,
        },
    }
    
    return session.New(params)
}
```

### 5.2 Webhook Handling

```go
func HandleStripeWebhook(w http.ResponseWriter, r *http.Request) {
    payload, _ := ioutil.ReadAll(r.Body)
    sig := r.Header.Get("Stripe-Signature")
    
    event, err := webhook.ConstructEvent(payload, sig, webhookSecret)
    if err != nil {
        http.Error(w, "Invalid signature", 400)
        return
    }
    
    switch event.Type {
    case "checkout.session.completed":
        var session stripe.CheckoutSession
        json.Unmarshal(event.Data.Raw, &session)
        
        userID := session.Metadata["user_id"]
        tier := session.Metadata["tier"]
        
        // Update user tier
        updateUserTier(userID, tier)
        
        // Create payment record
        createPayment(userID, session.ID, session.AmountTotal, tier)
        
        // Send confirmation email
        sendUpgradeConfirmation(userID, tier)
        
    case "payment_intent.payment_failed":
        // Handle failure
    }
    
    w.WriteHeader(200)
}
```

---

## 6. Real-time Features

### 6.1 WebSocket Architecture

**Server-Sent Events (SSE) for Real-time Updates:**
```go
func SSEHandler(w http.ResponseWriter, r *http.Request) {
    userID := getUserID(r.Context())
    
    // Set SSE headers
    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")
    
    // Create client channel
    client := make(chan Event)
    eventBroker.Register(userID, client)
    defer eventBroker.Unregister(userID, client)
    
    // Stream events
    for {
        select {
        case event := <-client:
            fmt.Fprintf(w, "event: %s\ndata: %s\n\n", event.Type, event.Data)
            w.(http.Flusher).Flush()
        case <-r.Context().Done():
            return
        }
    }
}
```

### 6.2 Event Types

| Event | Trigger | Data |
|-------|---------|------|
| `estate.updated` | Estate modified | Estate ID, fields changed |
| `document.uploaded` | Upload complete | Document ID, name |
| `executor.confirmed` | Executor confirms death | Estate ID, executor name |
| `notification.sent` | Letter sent | Notification ID, institution |

---

## 7. API Rate Limiting

### 7.1 Implementation

```go
type RateLimiter struct {
    redis  *redis.Client
    limit  int
    window time.Duration
}

func (rl *RateLimiter) Allow(key string) (bool, error) {
    now := time.Now().Unix()
    windowStart := now - int64(rl.window.Seconds())
    
    pipe := rl.redis.Pipeline()
    
    // Remove old entries
    pipe.ZRemRangeByScore(ctx, key, "0", fmt.Sprintf("%d", windowStart))
    
    // Count current window
    pipe.ZCard(ctx, key)
    
    // Add current request
    pipe.ZAdd(ctx, key, &redis.Z{Score: float64(now), Member: now})
    
    // Set expiry
    pipe.Expire(ctx, key, rl.window)
    
    results, _ := pipe.Exec(ctx)
    count := results[1].(*redis.IntCmd).Val()
    
    return count < int64(rl.limit), nil
}

func RateLimitMiddleware(limiter *RateLimiter) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            userID := getUserID(r.Context())
            key := fmt.Sprintf("ratelimit:%s", userID)
            
            allowed, _ := limiter.Allow(key)
            if !allowed {
                w.Header().Set("Retry-After", "60")
                http.Error(w, "Rate limit exceeded", 429)
                return
            }
            
            next.ServeHTTP(w, r)
        })
    }
}
```

### 7.2 Rate Limits

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 10 | 1 minute |
| Document Upload | 50 | 1 hour |
| General API | 1000 | 1 hour |
| Notification Generation | 100 | 1 hour |

---

## 8. Error Handling

### 8.1 Error Response Format

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "email",
                "message": "must be a valid email address"
            }
        ],
        "request_id": "abc123"
    }
}
```

### 8.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_ERROR` | 401 | Invalid or missing token |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 9. Caching Strategy

### 9.1 Cache Keys

```
user:{id}              - User profile
estate:{id}            - Estate details
estate:{id}:assets     - Estate assets list
estate:{id}:documents  - Estate documents list
template:{id}          - Notification template
session:{token}        - User session
```

### 9.2 Cache Invalidation

```go
func InvalidateEstateCache(estateID uuid.UUID) {
    patterns := []string{
        fmt.Sprintf("estate:%s", estateID),
        fmt.Sprintf("estate:%s:*", estateID),
    }
    
    for _, pattern := range patterns {
        keys, _ := redis.Keys(ctx, pattern).Result()
        if len(keys) > 0 {
            redis.Del(ctx, keys...)
        }
    }
}
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
