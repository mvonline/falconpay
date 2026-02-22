# Observability & DevOps

Everything in FalconPay is measured, logged, and audited.

## 📊 The "LGTM" Stack
- **Loki**: Centralized log collection for all 7 services.
- **Grafana**: Unified dashboards for logs, metrics, and business KPIs.
- **Tracing (Jaeger)**: End-to-end trace collection using OpenTelemetry.
- **Metrics (Prometheus)**: Real-time service health and performance monitoring.

## 🚢 Deployment (40/40 Maturity)
- **Helm**: Professional charts for production deployments.
- **Resource Quotas**: Strict CPU/Memory boundaries per container to ensure node stability.
- **CI/CD**: GitHub Actions automatically run Unit and E2E Integrated tests on every branch push.

## 🛡️ Resilience
- **Circuit Breakers**: Protecting our services from cascading failures.
- **Synthetic Probes**: Automated business probes (`probes.sh`) that simulate user journeys hourly on production.
