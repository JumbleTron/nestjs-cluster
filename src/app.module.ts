import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './metrics/metrics.module';
import { preEventsCounter } from './metrics/metrics.constants';

@Module({
  imports: [MetricsModule.forRoot([preEventsCounter])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
