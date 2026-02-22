import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
const proxy = require('express-http-proxy');


@Injectable()
export class ProxyMiddleware implements NestMiddleware {
    private readonly routes = {
        '/auth': process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
        '/users': process.env.USER_SERVICE_URL || 'http://localhost:3002',
        '/payments': process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003',
        '/wallets': process.env.WALLET_SERVICE_URL || 'http://localhost:3004',
        '/notifications': process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
        '/reporting': process.env.REPORTING_SERVICE_URL || 'http://localhost:3006',
    };

    use(req: Request, res: Response, next: NextFunction) {
        const path = Object.keys(this.routes).find((p) => req.url.startsWith(p));

        if (path) {
            const target = this.routes[path];
            return proxy(target, {
                proxyReqPathResolver: (req) => req.url,
            })(req, res, next);
        }

        next();
    }
}
