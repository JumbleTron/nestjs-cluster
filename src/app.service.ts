import { Injectable } from '@nestjs/common';
import { MetricsCollectorService } from './metrics/metricCollectorService';
import { preEventsCounter } from './metrics/metrics.constants';

@Injectable()
export class AppService {
  constructor(
    private readonly metricsCollectorService: MetricsCollectorService,
  ) {}

  getHello(): string {
    this.metricsCollectorService.incrementCounter(preEventsCounter, {
      provider: 'JT',
    });
    return 'Hello World!';
  }
}
