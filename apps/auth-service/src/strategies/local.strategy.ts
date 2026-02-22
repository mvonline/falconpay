import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthServiceService } from '../auth-service.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthServiceService) {
        super({ usernameField: 'username' });
    }

    async validate(phone: string, passport: string): Promise<any> {
        const user = await this.authService.validateUser(phone, passport);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
