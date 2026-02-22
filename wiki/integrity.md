# Financial Integrity & Reconciliation

For FalconPay, data consistency is not just a preference; it is a regulatory requirement.

## 🛡️ The Reconciliation Service
The `reconciliation-service` acts as an independent auditor (Data Janitor) for the entire ecosystem.

- **The Audit Logic**: It periodically (every minute) calculates the total volume of COMPLETED payments in `payment_service` and compares it with the total volume of CREDITS in `wallet_service`.
- **The Discrepancy Gate**: If the volumes do not match (beyond a float precision margin), a CRITICAL alert is fired.

## ⚖️ Transactional Guarantees
- **Atomic Outbox**: Ensures we never lose an event if the database saves successfully.
- **Pessimistic Locking**: Ensures we never spend more money than is available in a wallet during high-concurrency bursts.
- **Idempotency**: Ensures that retried requests never cause duplicate debits.
