import { Controller, Get, Res } from '@nestjs/common';
import { MetricsCollectorService } from './metricCollectorService';
import { type Response } from 'express';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsCollectorService: MetricsCollectorService,
  ) {}

  @Get()
  async check(@Res() res: Response) {
    await this.metricsCollectorService.getResponse(res);
  }
}
