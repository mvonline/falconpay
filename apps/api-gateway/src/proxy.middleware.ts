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
        if (req.method === 'OPTIONS') {
            return next();
        }

        const fullPath = req.originalUrl || req.url;
        console.log(`[Gateway] incoming: ${req.method} ${fullPath}`);

        const routeKey = Object.keys(this.routes).find((p) => fullPath.startsWith(p));

        if (routeKey) {
            const target = this.routes[routeKey];
            console.log(`[Gateway] proxying ${fullPath} to ${target}`);

            return proxy(target, {
                proxyReqPathResolver: () => fullPath,
                userResHeaderDecorator: (headers) => {
                    // Avoid duplicate headers or issues with NestJS
                    return headers;
                },
                proxyErrorHandler: (err, res, next) => {
                    console.error(`[Gateway] Proxy Error for ${fullPath}:`, err.message);
                    res.status(502).json({
                        message: 'Gateway Proxy Error',
                        error: err.message,
                        path: fullPath
                    });
                }
            })(req, res, (err) => {
                if (err) {
                    console.error(`[Gateway] Proxy Next Error for ${fullPath}:`, err);
                    return next(err);
                }
                // If the proxy didn't finish the request and didn't error, continue
                // But normally proxy should finish the request.
            });
        }

        console.log(`[Gateway] no route found for ${fullPath}`);
        next();
    }
}
