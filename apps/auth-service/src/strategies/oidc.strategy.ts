import { Injectable, Logger, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

// Conditional - only instantiated when KEYCLOAK_ISSUER_URL is truly set
@Injectable()
export class OidcStrategy {
    private readonly logger = new Logger(OidcStrategy.name);
    strategy: any;

    constructor(private readonly configService: ConfigService) {
        const issuer = configService.get<string>('KEYCLOAK_ISSUER_URL');
        if (!issuer) {
            this.logger.warn('KEYCLOAK_ISSUER_URL not set - OIDC/SSO login is disabled');
            return;
        }

        try {
            const { Strategy } = require('passport-openidconnect');
            const keycloakUrl = configService.get<string>('KEYCLOAK_URL') || issuer;

            this.strategy = new Strategy(
                {
                    issuer,
                    authorizationURL: `${keycloakUrl}/protocol/openid-connect/auth`,
                    tokenURL: `${keycloakUrl}/protocol/openid-connect/token`,
                    userInfoURL: `${keycloakUrl}/protocol/openid-connect/userinfo`,
                    clientID: configService.get<string>('KEYCLOAK_CLIENT_ID') || 'falconpay',
                    clientSecret: configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '',
                    callbackURL: configService.get<string>('KEYCLOAK_CALLBACK_URL') || 'http://localhost:3001/auth/oidc/callback',
                    scope: 'openid profile email',
                },
                async (issuer: string, profile: any, done: Function) => {
                    return done(null, profile);
                },
            );
        } catch (err) {
            this.logger.error('Failed to initialize OIDC strategy:', err.message);
        }
    }
}
