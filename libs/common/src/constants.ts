export const KAFA_CLIENT_ID = 'falcon-pay';
export const KAFKA_BROKERS = ['localhost:9092'];

export enum ServiceNames {
    AUTH = 'AUTH_SERVICE',
    USER = 'USER_SERVICE',
    PAYMENT = 'PAYMENT_SERVICE',
    WALLET = 'WALLET_SERVICE',
    NOTIFICATION = 'NOTIFICATION_SERVICE',
    REPORTING = 'REPORTING_SERVICE',
    GATEWAY = 'API_GATEWAY',
}

export enum KafkaTopics {
    USER_CREATED = 'user.created',
    USER_UPDATED = 'user.updated',
    PAYMENT_CREATED = 'payment.created',
    PAYMENT_COMPLETED = 'payment.completed',
    PAYMENT_FAILED = 'payment.failed',
    WALLET_CREDITED = 'wallet.credited',
    WALLET_DEBITED = 'wallet.debited',
    NOTIFICATION_SEND = 'notification.send',
}

export const OTP_EXPIRY_SECONDS = 300; // 5 minutes
export const DEFAULT_CURRENCY = 'OMR';
