import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
const { Resource } = require('@opentelemetry/resources');

import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Logger } from '@nestjs/common';

const logger = new Logger('Tracing');

export function initTracing(serviceName: string) {
    const exporter = new JaegerExporter({
        endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    });

    const sdk = new NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
        spanProcessor: new (require('@opentelemetry/sdk-trace-base').SimpleSpanProcessor)(exporter),
        instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();

    process.on('SIGTERM', () => {
        sdk
            .shutdown()
            .then(() => logger.log('Tracing terminated'))
            .catch((error) => logger.error('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
}
