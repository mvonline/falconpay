import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

@Injectable()
export class FalconLogger implements LoggerService {
    private logger: winston.Logger;

    constructor(serviceName: string) {
        const jsonFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
        );

        this.logger = winston.createLogger({
            level: 'info',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        nestWinstonModuleUtilities.format.nestLike(serviceName, {
                            colors: true,
                            prettyPrint: true,
                        }),
                    ),
                }),
                new winston.transports.File({
                    filename: `logs/${serviceName}-error.log`,
                    level: 'error',
                    format: jsonFormat
                }),
                new winston.transports.File({
                    filename: `logs/${serviceName}-combined.log`,
                    format: jsonFormat
                }),
            ],
        });
    }


    log(message: any) {
        this.logger.info(message);
    }

    error(message: any, trace?: string) {
        this.logger.error(message, { trace });
    }

    warn(message: any) {
        this.logger.warn(message);
    }

    debug(message: any) {
        this.logger.debug(message);
    }

    verbose(message: any) {
        this.logger.verbose(message);
    }
}
