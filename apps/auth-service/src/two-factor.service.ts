import { Injectable } from '@nestjs/common';
const { authenticator } = require('otplib');
import * as QRCode from 'qrcode';




@Injectable()
export class TwoFactorService {
    generateSecret() {
        return authenticator.generateSecret();
    }

    generateOtpUri(secret: string, phone: string) {
        return authenticator.keyuri(phone, 'FalconPay', secret);
    }

    async generateQrCode(otpAuthUri: string) {
        return QRCode.toDataURL(otpAuthUri);
    }

    verifyCode(code: string, secret: string) {
        return authenticator.verify({ token: code, secret });
    }

}

