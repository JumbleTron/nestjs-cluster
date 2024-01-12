import { DynamicModule, Module } from '@nestjs/common';
import {
  MetricConfiguration,
  MetricsCollectorService,
} from './metricCollectorService';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [],
  controllers: [MetricsController],
  providers: [MetricsCollectorService],
})
export class MetricsModule {
  static forRoot(metrics: MetricConfiguration<string[]>[] = []): DynamicModule {
    return {
      module: MetricsModule,
      providers: [
        {
          provide: MetricsCollectorService,
          useFactory(): MetricsCollectorService {
            const service = new MetricsCollectorService();
            service.init(metrics);

            return service;
          },
        },
      ],
      exports: [MetricsCollectorService],
      controllers: [],
    };
  }
}
