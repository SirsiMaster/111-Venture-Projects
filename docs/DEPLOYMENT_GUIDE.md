# Deployment Guide
## Legacy - The Estate Operating System
**Version:** 1.0.0
**Date:** November 26, 2025

---

## 1. Overview

This guide covers the deployment procedures for the Legacy platform infrastructure, applications, and services.

---

## 2. Infrastructure Setup (Terraform)

### 2.1 Prerequisites
- AWS CLI configured with appropriate credentials
- Terraform v1.5+
- Access to AWS account

### 2.2 Initial Setup
```bash
# Clone infrastructure repository
git clone git@github.com:legacy/infrastructure.git
cd infrastructure

# Initialize Terraform
terraform init

# Create workspace for environment
terraform workspace new staging
terraform workspace new production

# Deploy staging
terraform workspace select staging
terraform plan -var-file=environments/staging.tfvars
terraform apply -var-file=environments/staging.tfvars

# Deploy production
terraform workspace select production
terraform plan -var-file=environments/production.tfvars
terraform apply -var-file=environments/production.tfvars
```

### 2.3 Key Resources Created
- VPC with public/private/data subnets
- ECS cluster (Fargate)
- RDS PostgreSQL instance
- ElastiCache Redis cluster
- S3 buckets (documents, logs)
- CloudFront distribution
- ALB with SSL termination
- KMS keys
- Security groups

---

## 3. CI/CD Pipeline (GitHub Actions)

### 3.1 Pipeline Overview
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: make test
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t legacy-api .
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker tag legacy-api:latest $ECR_REGISTRY/legacy-api:${{ github.sha }}
          docker push $ECR_REGISTRY/legacy-api:${{ github.sha }}
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster legacy-$ENV --service api --force-new-deployment
```

### 3.2 Environment Variables
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `ECR_REGISTRY` - ECR registry URL
- `ENV` - Environment (staging/production)

---

## 4. Backend Deployment

### 4.1 Docker Build
```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /api cmd/api/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /api /api
EXPOSE 8080
CMD ["/api"]
```

### 4.2 ECS Task Definition
```json
{
  "family": "legacy-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [{
    "name": "api",
    "image": "${ECR_REGISTRY}/legacy-api:${TAG}",
    "portMappings": [{"containerPort": 8080}],
    "environment": [
      {"name": "ENV", "value": "production"},
      {"name": "DB_HOST", "value": "${DB_HOST}"}
    ],
    "secrets": [
      {"name": "DB_PASSWORD", "valueFrom": "${DB_PASSWORD_ARN}"}
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/legacy-api",
        "awslogs-region": "us-east-1"
      }
    }
  }]
}
```

---

## 5. Web Deployment (Vercel)

### 5.1 Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

### 5.2 Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 6. Mobile Deployment

### 6.1 iOS (App Store Connect)
```bash
# Build iOS release
flutter build ios --release

# Archive and upload
cd ios
xcodebuild archive -workspace Runner.xcworkspace -scheme Runner -configuration Release -archivePath build/Runner.xcarchive
xcodebuild -exportArchive -archivePath build/Runner.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build

# Upload to App Store Connect
xcrun altool --upload-app -f build/Runner.ipa -t ios -u $APPLE_ID -p $APP_SPECIFIC_PASSWORD
```

### 6.2 Android (Google Play)
```bash
# Build Android release
flutter build appbundle --release

# Upload to Play Console via Fastlane
fastlane android deploy
```

---

## 7. Database Migrations

### 7.1 Running Migrations
```bash
# Run migrations
migrate -database "postgres://..." -path ./migrations up

# Rollback
migrate -database "postgres://..." -path ./migrations down 1
```

### 7.2 Migration Safety
- Always backup before migrations
- Test migrations on staging first
- Use transaction-safe migrations
- Have rollback plan ready

---

## 8. Monitoring Setup

### 8.1 CloudWatch Dashboards
- API latency metrics
- Error rates
- Database connections
- Cache hit rates

### 8.2 Alerts
- P95 latency > 500ms
- Error rate > 1%
- Database connections > 80%
- Disk usage > 80%

---

## 9. Rollback Procedures

### 9.1 Application Rollback
```bash
# Revert to previous ECS task definition
aws ecs update-service --cluster legacy-production --service api --task-definition legacy-api:PREVIOUS_VERSION

# Or force previous image
aws ecs update-service --cluster legacy-production --service api --force-new-deployment
```

### 9.2 Database Rollback
```bash
# Point-in-time recovery
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier legacy-production \
  --target-db-instance-identifier legacy-production-restored \
  --restore-time "2025-01-01T00:00:00Z"
```

---

## 10. Checklist

### 10.1 Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Rollback plan documented

### 10.2 Post-Deployment
- [ ] Smoke tests passing
- [ ] Monitoring verified
- [ ] Performance acceptable
- [ ] No error spikes
- [ ] Stakeholders notified

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-26 | Legacy Team | Initial draft |
