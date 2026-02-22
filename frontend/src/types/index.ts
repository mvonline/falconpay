export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface WalletBalance {
    balance: number;
    currency: string;
}

export interface Transaction {
    id: string;
    title: string;
    type: 'payment' | 'receive' | 'shopping' | 'food';
    amount: number;
    date: string;
    status: 'COMPLETED' | 'FAILED' | 'PENDING';
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
}
