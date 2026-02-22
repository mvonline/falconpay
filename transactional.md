# FalconPay: Transactional Integrity & Outbox Pattern

To achieve 100% financial trust, we must ensure that a database update and its corresponding event publication happen **atomically**.

## 🔴 The Problem: Dual-Write Challenge
In a standard implementation, we:
1.  Save to Database (Postgres)
2.  Emit to Message Broker (Kafka)

If the system crashes between step 1 and step 2, we have an **inconsistent state**: the payment is recorded in the DB, but the Wallet service never receives the event to move the money.

## 🟢 The Solution: Transactional Outbox Pattern
We introduce an `Outbox` table in each service's database.

1.  **Atomic Transaction**: Within a single local transaction, we:
    - Save the business entity (e.g., Transaction/Payment).
    - Save the event payload to the `Outbox` table.
2.  **Reliable Relay (Outbox Processor)**: A background process polls the `Outbox` table for unsent messages, emits them to Kafka, and marks them as `PROCESSED`.

## 🛠️ Implementation Plan

### 1. Common Outbox Entity
Create a base `Outbox` entity in `libs/common` to be shared across all microservices.

### 2. Service Integration (Phase 1: Payment Service)
- Update `PaymentService` to include the `Outbox` entity.
- Refactor `createTransfer` to use a `QueryRunner` that saves both the `Transaction` and the `Outbox` message in one transaction.

### 3. Outbox Worker
- Implement a background service (using `@nestjs/schedule`) that scans the `Outbox` table every second.
- Reliable delivery: Only mark as `PROCESSED` after successful Kafka acknowledgment.

## 📈 Reliability Matrix

| Scenario | Outcome with Outbox |
| :--- | :--- |
| **DB Save Fails** | Nothing is saved, no message in Outbox. System is consistent. |
| **Server Crashes after DB Save** | On restart, the Outbox Worker finds the message and sends it. |
| **Kafka is Down** | Outbox Worker retries until Kafka is back up. |
| **Duplicate Send** | Destination handles this via existing Idempotency checks. |

---

**This pattern upgrades FalconPay to "Bank-Grade" reliability, ensuring 0% data loss during service failures.**
