# Architecture & Patterns

FalconPay is built as a high-performance monorepo containing 7 specialized microservices and a shared core library.

## 🏗️ Core Principles
- **Database per Service**: Every service owns its schema. No shared tables.
- **Event-Driven Choreography**: Services communicate primarily through Kafka.
- **Loose Coupling**: Services are independently deployable.

## 🔄 Distributed Sagas
We use **Choreography-based Sagas** to manage complex business flows like payments.
- **Payment Success**: `Payment` -> `payment.created` -> `Wallet` -> `payment.completed` -> `Notification`.
- **Payment Failure**: `Payment` -> `payment.created` -> `Wallet` -> `payment.failed` -> `Payment (revert)`.

## 📦 Transactional Outbox
To solve the "Dual-Write" problem, every service implements the Outbox Pattern.
- Events are saved into the service's own database in the same transaction as the business data.
- A background `OutboxProcessor` ensures at-least-once delivery to Kafka.

## 🧱 Monorepo Structure
- `apps/`: Microservice implementations.
- `libs/common/`: Shared entities, interceptors (Circuit Breakers), and business constants.
- `frontend/`: React dashboard.
