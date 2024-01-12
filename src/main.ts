import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MetricsModule } from './metrics/metrics.module';
import cluster from 'node:cluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

async function bootstrapMetrics() {
  const app = await NestFactory.create(MetricsModule);
  await app.listen(3003);
}

if (cluster.isPrimary) {
  for (let i = 0; i < 4; i++) {
    cluster.fork();
  }
  bootstrapMetrics();
} else {
  bootstrap();
}
