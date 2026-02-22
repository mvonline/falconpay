import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
const proxy = require('express-http-proxy');


@Injectable()
export class ProxyMiddleware implements NestMiddleware {
    private readonly routes = {
        '/auth': 'http://localhost:3001',
        '/users': 'http://localhost:3002',
        '/payments': 'http://localhost:3003',
        '/wallets': 'http://localhost:3004',
        '/notifications': 'http://localhost:3005',
        '/reporting': 'http://localhost:3006',
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
