# FalconPay Documentation Wiki 📚

Welcome to the internal documentation for the FalconPay Microservices Platform. This wiki provides a deep dive into the architecture, security, and operational standards of the system.

## 🗺️ Navigation

### 🛠️ Architecture & Core Logic
- **[Architecture & Patterns](./architecture.md)**: Core design principles.
- **[Concurrency & Integrity](./concurrency.md)**: **TLCC Strategy (Distributed Locks & Atomic Updates).**
- **[Financial Reconciliation](./integrity.md)**: Data Janitor auditor.

### 2. [Security & Compliance](./security.md)
Detailed guide on JWT authentication, 2FA (TOTP), and centralized secret management with HashiCorp Vault.

### 3. [Distributed Transactions](./transactions.md)
How we ensure 100% financial trust using the Transactional Outbox pattern and Pessimistic Locking.

### 4. [Observability Stack](./observability.md)
Documentation on our "LGTM" stack: Loki, Grafana, Tracing (Jaeger), and Metrics (Prometheus).

### 5. [Financial Integrity](./integrity.md)
Learn about the Reconciliation Service (Data Janitor) and how we audit ledgers cross-service.

### 6. [DevOps & Deployment](./devops.md)
Guide to Helm Charts, Kubernetes manifests, and our CI/CD pipelines.

---

## 🚀 Quick Links
- **[Architectural Defintion](../architect-definition.md)**
- **[Maturity Checklist](../checklist.md)**
- **[Transaction Roadmap](../transactional.md)**
