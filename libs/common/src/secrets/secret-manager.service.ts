import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const vault = require('node-vault');


@Injectable()
export class SecretManagerService implements OnModuleInit {
    private readonly logger = new Logger(SecretManagerService.name);
    private vaultClient: any;
    private readonly useVault: boolean;

    constructor(private readonly configService: ConfigService) {
        this.useVault = this.configService.get<string>('USE_VAULT') === 'true';
    }

    async onModuleInit() {
        if (this.useVault) {
            const endpoint = this.configService.get<string>('VAULT_ADDR') || 'http://localhost:8200';
            const token = this.configService.get<string>('VAULT_TOKEN') || 'root';

            this.vaultClient = vault({
                apiVersion: 'v1',
                endpoint,
                token,
            });
            this.logger.log('Vault Secret Manager initialized');
        } else {
            this.logger.warn('Vault not enabled. Falling back to environment variables.');
        }
    }

    async getSecret(key: string, path: string = 'secret/data/falconpay'): Promise<string | null> {
        if (!this.useVault) {
            return this.configService.get<string>(key) || null;
        }

        try {
            const result = await this.vaultClient.read(path);
            return result.data.data[key] || null;
        } catch (err) {
            this.logger.error(`Error reading secret ${key} from path ${path}: ${err.message}`);
            // Fallback to config service
            return this.configService.get<string>(key) || null;
        }
    }
}
