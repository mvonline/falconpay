# FalconPay Administration & Security 🛡️

This document contains the default credentials and administrative access points for the FalconPay ecosystem.

## 🔑 Infrastructure Credentials

| Service | Access Point | Username | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **API Gateway** | `localhost:3000` | - | - | Public Entry Point |
| **Postgres (Auth)** | `localhost:5432` | `falconpay` | `password` | DB: `auth_db` |
| **Postgres (User)** | `localhost:5433` | `falconpay` | `password` | DB: `user_db` |
| **Postgres (Payment)** | `localhost:5434` | `falconpay` | `password` | DB: `payment_db` |
| **Postgres (Wallet)** | `localhost:5435` | `falconpay` | `password` | DB: `wallet_db` |
| **Postgres (Reporting)** | `localhost:5436` | `falconpay` | `password` | DB: `reporting_db` |
| **Postgres (Keycloak)** | `localhost:5437` | `keycloak` | `password` | DB: `keycloak` |
| **Keycloak Admin** | `localhost:8888` | `admin` | `admin` | Identity Management |
| **HashiCorp Vault** | `localhost:8200` | - | `root` | Root Token (Dev Mode) |
| **Grafana** | `localhost:3030` | `admin` | `admin` | Observability |
| **Kafka UI (AKHQ)** | `localhost:8080` | - | - | Topic Inspection |
| **Redis** | `localhost:6379` | - | - | Cache / Locks |
| **MongoDB** | `localhost:27017` | - | - | Secondary Storage |

## 🚀 Environment Profiles

FalconPay uses Docker Compose **Profiles** to distinguish between development and production workloads.

### 1. Development Profile (`dev`)
- **Features**: Hot-reload enabled, source code volume mapping, detailed logging.
- **Run Command**: 
  ```bash
  docker-compose --profile dev up -d
  ```

### 2. Production Profile (`prod`)
- **Features**: Optimized multi-stage images, Vault in production-ready mode (standalone), resource limits.
- **Run Command**:
  ```bash
  docker-compose --profile prod up -d
  ```

## 🔒 Production Security Checklist
1. [ ] **Rotate Passwords**: Change all default passwords in `docker-compose.prod.yml` and `.env` files.
2. [ ] **Unseal Vault**: In production mode, Vault will require manual unsealing unless auto-unseal is configured.
3. [ ] **mTLS**: Ensure Istio or similar service mesh is enforcing mutual TLS for intra-service traffic.
4. [ ] **Probes**: Verify that `probes.sh` is running hourly to monitor business health.
