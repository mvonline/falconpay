# Concurrency & Data Integrity 🛡️

FalconPay implements a **Triple-Layer Concurrency Control** (TLCC) strategy to ensure that financial transactions are absolute, atomic, and immune to race conditions.

## 🏗️ The Triple-Layer Shield

### Layer 1: Distributed Locking (Redlock)
- **Problem**: Multiple instances of the `wallet-service` processing payments for the same user.
- **Solution**: Before entering the database transaction, we acquire a distributed lock via Redis using the Redlock algorithm.
- **Deadlock Prevention**: Resource IDs (Wallet IDs) are always **sorted alphabetically** before locking, ensuring a consistent lock hierarchy across the cluster.

### Layer 2: Optimistic Locking (DB Versioning)
- **Problem**: High contention where Redlock might be bypassed or expire.
- **Solution**: Every `Wallet` has a `version` column. Every update check ensures `WHERE version = :currentVersion`.
- **Resilience**: If an optimistic lock failure occurs, the service automatically retries the operation up to 3 times with exponential backoff.

### Layer 3: Atomic SQL Invariants (Inline Checks)
- **Problem**: Programming logic errors in the application layer.
- **Solution**: The final balance deduction is done using a single atomic SQL statement with a logical guard:
  ```sql
  UPDATE wallets 
  SET balance = balance - :amount 
  WHERE id = :id AND balance >= :amount
  ```
- **Result**: It is physically impossible for a wallet balance to drop below zero at the database level.

## 🧪 Stress Testing
We maintain a specialized stress test to verify these protections under load:

**Run Stress Test:**
```bash
npx jest apps/wallet-service/test/concurrency.stress-spec.ts
```

This test simulates 50+ parallel requests against a single ledger and verifies:
1.  **Mathematical Correctness**: Final balance = Initial - (Successful Tx * Amount).
2.  **Zero-Overshoot**: No transaction ever succeeds if `balance < amount`.
3.  **Idempotency**: Duplicate `transactionId` requests are discarded immediately.
