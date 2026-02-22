# FalconPay: Request Lifecycle Management

Understanding the request lifecycle is critical for maintaining security, consistency, and performance in our microservices ecosystem. This document outlines how FalconPay handles the execution flow for both HTTP requests and Kafka events.

## 1. HTTP Request Lifecycle (API Gateway)

The **API Gateway** is the entry point. It manages the initial stages of the lifecycle before proxying traffic to internal services.

### Execution Order:
1.  **Incoming Request**: Client sends an HTTP request.
2.  **Global Middlewares**: (Standard Express/NestJS middlewares).
3.  **Module Middlewares**:
    -   `AuthMiddleware`: Extracts and verifies the JWT. Attaches the `user` object to the request.
    -   `ProxyMiddleware`: Matches the URL path and proxies the request to the target microservice (downstream).
4.  **Downstream Service Lifecycle**: Once the request hits a specific microservice (e.g., Auth or User service), it starts its own internal NestJS lifecycle.

## 2. Microservice Internal Lifecycle (Downstream)

Every microservice in FalconPay follows this standardized execution order for HTTP/REST routes:

| Stage | Component | Responsibility |
| :--- | :--- | :--- |
| **1. Guard** | `JwtAuthGuard` | Verifies the existence of a valid user (previously attached by the Gateway). |
| **2. Interceptor** | `LoggingInterceptor` | (Pre-handler) Starts performance metrics and logs the incoming request. |
| **3. Pipe** | `ValidationPipe` | Validates and transforms the request body (DTO) using Class-Validator. |
| **4. Controller** | `*Controller` | Routes the request to the appropriate service logic. |
| **5. Service** | `*Service` | Executes business logic, database transactions, and emits Kafka events. |
| **6. Interceptor** | `LoggingInterceptor` | (Post-handler) Logs the response status and duration. |
| **7. Filter** | `ExceptionFilter` | Catches unhandled errors and formats them into a unified JSON structure. |

## 3. Microservice Kafka Lifecycle (Event Driven)

For events consumed from Kafka, the lifecycle is slightly different but equally structured:

1.  **Incoming Event**: Kafka message arrives at the consumer.
2.  **Guard**: Checks if the message headers or payload meet security/permission criteria.
3.  **Pipe**: Validates the event schema to prevent malformed data from entering the logic.
4.  **Controller (Event Handler)**: Uses `@EventPattern()` or `@MessagePattern()` to match the topic.
5.  **Service**:
    -   **Idempotency Check**: (e.g., in Wallet Service) Verifies if the `referenceId` has already been processed.
    -   **Business Logic**: Updates balances, generates reports, etc.
6.  **Acknowledgement**: Controlled by the NestJS Kafka Transporter.

## 4. Specific Management in FalconPay

### 4.1. Security via Guards
We use `JwtStrategy` (from `@app/common`) and the `JwtAuthGuard`. This is enforced at the controller level:
```typescript
@UseGuards(JwtAuthGuard)
@Post('transfer')
async handleTransfer(...) { ... }
```

### 4.2. Validation via Pipes
All services are bootstrapped with a global `ValidationPipe`. This ensures that any data reaching our services is strictly typed and validated against Class-Validator rules.

### 4.3. Exception Handling
We use a unified exception handling mechanism to ensure that Omani users and developers receive clear, standardized error messages across all 7 microservices.

### 4.4. Consistency in Lifecycle
By moving common strategies, guards, and services into the `libs/common` library, we ensure that every microservice follows the **exact same lifecycle**, making the system predictable and easier to debug.

## 5. Practical Usage Examples

Here is how we use each component in the FalconPay codebase:

### 5.1. Guards (Security)
Used to protect routes and ensure only authenticated users can access them.
*   **File**: `libs/common/src/guards/auth.guard.ts`
*   **Usage**:
    ```typescript
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) { ... }
    ```

### 5.2. Interceptors (Logging & Performance)
Used to log request metrics and execution time globally.
*   **File**: `libs/common/src/interceptors/logging.interceptor.ts`
*   **Usage**: Registered globally in `main.ts` or at controller level.
    ```typescript
    @UseInterceptors(LoggingInterceptor)
    @Controller('wallets')
    export class WalletController { ... }
    ```

### 5.3. Pipes (Validation)
Used to validate DTOs (Data Transfer Objects) before they reach the service logic.
*   **Usage**: Usually registered globally in `main.ts` for all routes.
    ```typescript
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    ```

### 5.4. Exception Filters (Error Formatting)
Used to catch errors and return a standardized JSON response.
*   **File**: `libs/common/src/filters/http-exception.filter.ts`
*   **Usage**: Registered globally in each microservice's `main.ts`.
    ```typescript
    app.useGlobalFilters(new HttpExceptionFilter());
    ```

