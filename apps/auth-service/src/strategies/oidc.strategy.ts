import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-openidconnect';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
    constructor(configService: ConfigService) {
        super({
            issuer: configService.get<string>('KEYCLOAK_ISSUER_URL') || '',
            authorizationURL: `${configService.get<string>('KEYCLOAK_URL') || ''}/protocol/openid-connect/auth`,
            tokenURL: `${configService.get<string>('KEYCLOAK_URL') || ''}/protocol/openid-connect/token`,
            userInfoURL: `${configService.get<string>('KEYCLOAK_URL') || ''}/protocol/openid-connect/userinfo`,
            clientID: configService.get<string>('KEYCLOAK_CLIENT_ID') || '',
            clientSecret: configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '',
            callbackURL: configService.get<string>('KEYCLOAK_CALLBACK_URL') || '',
            scope: 'openid profile email',
        });

    }

    async validate(issuer: string, profile: any, done: Function) {
        // Logic to find or create user based on OIDC profile
        return profile;
    }
}
