export enum NotificationType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PUSH = 'PUSH',
    WHATSAPP = 'WHATSAPP',
    ANALYTICS = 'ANALYTICS',
}


export interface INotificationProvider {
    type: NotificationType;
    send(to: string, payload: any): Promise<boolean>;
}

export interface ISmsPayload {
    message: string;
}

export interface IEmailPayload {
    subject: string;
    body: string;
}

export interface IPushPayload {
    title: string;
    message: string;
    data?: any;
}
