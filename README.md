# FalconPay 🚀

FalconPay is a high-performance, event-driven financial microservices platform. It is designed to handle secure payments, shared wallets, and real-time notifications with absolute transactional integrity.

## ✨ Features

- **Microservices Monorepo**: 7 specialized services built with NestJS.
- **Event-Driven Architecture**: Real-time communication via Apache Kafka.
- **Secure Ledger**: Atomic transactions with pessimistic locking and idempotency.
- **Multi-Factor Auth**: 2FA (TOTP) and Keycloak Social SSO support.
- **Secret Management**: Centralized secrets and config via HashiCorp Vault.
- **Mobile-First UI**: Responsive React frontend (Vite/Tailwind/ShadCN).
- **Integrations**: Twilio (SMS), Mailgun/Brevo (Email), and Raventrack (Analytics).
- **Transaction Integrity**: 100% atomic delivery via **Transactional Outbox Pattern**.
- **Admin Analytics**: High-end Backoffice Dashboard with Recharts visualizations.
- **Deep Observability**: Centralized Logs (Loki), Metrics (Prometheus), and Tracing (Jaeger).
- **Automated Workflows**: GitHub Actions CI/CD and Postman collection included.

## 🏗️ Architecture & Governance

For a deep dive into the system design and maturity, please refer to:
- [FalconPay Wiki](./wiki/home.md) - **Full Internal Documentation Hub.**
- [Architectural Definition](./architect-definition.md) - Core system design.

- [Maturity Audit (Checklist)](./checklist.md) - Microservices health scorecard.
- [Transactional Integrity](./transactional.md) - How we handle Bank-Grade trust.
- [Compensation Logic](./compensation.md) - Distributed Saga & Rollback patterns.

## 🛠️ Tech Stack

- **Backend**: NestJS, TypeScript, TypeORM.
- **Observability**: Prometheus, Grafana, Loki (Logs), Jaeger (Tracing).
- **Infrastructure**: Apache Kafka, PostgreSQL, Redis, MongoDB, Vault, Keycloak.
- **Frontend**: React, Vite, Tailwind CSS, Recharts.

## 🚀 Getting Started

1. **Setup Local Infrastructure**: `docker-compose up -d`
2. **Install Dependencies**: `npm install`
3. **Run Services**: `npm run start:dev`

## 📊 Observability Dashboards

Once infrastructure is up, access the following:
- **Grafana**: `http://localhost:3030` (Admin: `admin/admin`)
- **Jaeger (Tracing)**: `http://localhost:16686`
- **Prometheus**: `http://localhost:9090`
- **Kafka UI (AKHQ)**: `http://localhost:8080`

## 🧪 API Testing & Utilities

- **Postman**: Import `FalconPay.postman_collection.json` and the local environment file.
- **Backups**: Run `./scripts/backup.sh` to take a snapshot of all 5 DBs and configurations.

## 📜 License

FalconPay is [MIT licensed](https://opensource.org/licenses/MIT).


