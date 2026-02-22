import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INotificationProvider, NotificationType } from './provider.interface';
import axios from 'axios';

@Injectable()
export class RaventrackProvider implements INotificationProvider {
    private readonly logger = new Logger(RaventrackProvider.name);
    type = NotificationType.ANALYTICS;

    constructor(private readonly configService: ConfigService) { }

    async send(id: string, payload: any): Promise<boolean> {
        const url = this.configService.get<string>('RAVENTRACK_URL');
        const token = this.configService.get<string>('RAVENTRACK_ACCESS_TOKEN');

        if (!url || !token) {
            this.logger.warn('Raventrack config missing. Skipping track.');
            return false;
        }

        try {
            await axios.post(`${url}/track`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            return true;
        } catch (err) {
            this.logger.error(`Raventrack track failed: ${err.message}`);
            return false;
        }
    }
}
