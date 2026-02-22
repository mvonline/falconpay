# Security & Compliance

FalconPay implements a "Defense in Depth" strategy to protect Omani financial assets.

## 🔐 Authentication
- **Global Auth**: Unified authentication via the `api-gateway`.
- **JWT**: Stateless tokens with safe signatures.
- **2FA (MFA)**: Built-in TOTP generation and verification for high-risk operations.

## 🔑 Secret Management
- **HashiCorp Vault**: All API keys (Twilio, Mailgun) and DB credentials are retrieved at runtime from Vault.
- **SharedConfigModule**: A custom NestJS module in `libs/common` that seamlessly integrates Vault with standard environment variables.

## 🛡️ Data Protection
- **Pessimistic Locking**: `FOR UPDATE` locks on wallet rows prevent double-spending race conditions.
- **Idempotency**: Every financial request requires a unique `transactionId` to prevent replay attacks or duplicate processing.
