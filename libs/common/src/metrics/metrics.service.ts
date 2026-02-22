import { Injectable, OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, Registry } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
    private readonly registry: Registry;

    constructor() {
        this.registry = new Registry();
    }

    onModuleInit() {
        collectDefaultMetrics({ register: this.registry });
    }

    getMetrics() {
        return this.registry.metrics();
    }

    getRegistry() {
        return this.registry;
    }
}
