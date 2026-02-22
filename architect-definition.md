# FalconPay: Architectural Definition

## 1. Overview
FalconPay is a modern, high-performance financial platform built on a microservices architecture. It leverages an event-driven design to ensure scalability, resilience, and real-time responsiveness.

## 2. System Architecture
The platform is composed of 7 core microservices and a shared library:

- **API Gateway**: Entry point for all client requests. Handles routing, rate limiting, and unified authentication.
- **Auth Service**: Manages user identity, JWT issuance, 2FA (TOTP), and OIDC/Keycloak integration for Social SSO.
- **User Service**: Handles user profiles and integrates with pluggable KYC providers.
- **Wallet Service**: The core ledger system. Manages personal/shared wallets, balances, and atomic transactions.
- **Payment Service**: Orchestrates transfers, A2A payments, and multi-source account management (Bank Interface).
- **Notification Service**: A pluggable multi-channel system (SMS, Email, Push) for real-time communication.
- **Reporting Service**: Provides a CQRS read-model, aggregating data for high-performance dashboards and audit logs.

## 3. Core Design Principles

### 3.1. Event-Driven Communication
FalconPay uses **Apache Kafka** as its central nervous system.
- **Saga Pattern**: Orchestrates complex distributed transactions (e.g., Payment -> Wallet -> Notification).
- **Pub/Sub**: Asynchronous event propagation (e.g., `user.created` event triggering wallet creation and welcome email).

### 3.2. Data Consistency and Integrity (Ledger)
- **Pessimistic Locking**: The Wallet Service uses `SELECT FOR UPDATE` to prevent race conditions during concurrent balance updates.
- **ACID Transactions**: All ledger entries are wrapped in database transactions to ensure atomic debit/credit operations.
- **Idempotency**: Every transaction is tracked via a unique `referenceId` and enforced by unique constraints in the database, preventing duplicate processing of the same event.

### 3.3. CQRS (Command Query Responsibility Segregation)
- **Commands**: Handled by operational services (Auth, Wallet, Payment) which write to dedicated PostgreSQL databases.
- **Queries**: The Reporting Service consumes change events and maintains a read-optimized view in a dedicated reporting DB for fast analytics.

### 3.4. Security Architecture
- **JWT Authentication**: Secure stateless authentication across all microservices.
- **Two-Factor Authentication (2FA)**: TOTP implementation using `otplib` and `qrcode`.
- **Secret Management**: Centralized secrets (API keys, DB credentials) managed via **HashiCorp Vault**.
- **SSO**: Keycloak integration for enterprise-grade identity management and social login support.

## 4. Technology Stack
- **Backend**: NestJS (Node.js), TypeScript.
- **Messaging**: Apache Kafka (KRaft mode).
- **Databases**: PostgreSQL (Transactional), MongoDB (Sink/Mirroring), Redis (Caching/Sessions).
- **Security**: HashiCorp Vault, Keycloak, otplib.
- **Frontend**: React (Vite), Tailwind CSS, ShadCN UI (Mobile-first).
- **Infrastructure**: Docker, Kubernetes, Prometheus, Grafana, Jaeger.

## 5. Directory Structure
```text
falconPay/
├── apps/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── user-service/
│   ├── payment-service/
│   ├── wallet-service/
│   ├── notification-service/
│   └── reporting-service/
├── libs/
│   └── common/             # Shared guards, strategies, secrets, database & kafka utils
├── frontend/               # React mobile-first application
└── docker-compose.yml      # Local dev infrastructure
```
