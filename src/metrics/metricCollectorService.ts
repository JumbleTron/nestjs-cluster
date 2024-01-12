import {
  AggregatorRegistry,
  Counter,
  Gauge,
  Histogram,
  RegistryContentType,
} from 'prom-client';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

export enum MetricType {
  'COUNTER' = 'counter',
  'GAUGE' = 'gauge',
  'HISTOGRAM' = 'histogram',
}
export type MetricLabels<T extends string[]> = Partial<
  Record<T[number], string>
>;
export type MetricConfiguration<T extends string[]> = {
  type: MetricType;
  name: string;
  description: string;
  labels?: T;
  buckets?: number[];
};

@Injectable()
export class MetricsCollectorService {
  private aggregatorRegistry: AggregatorRegistry<RegistryContentType>;
  private metrics = new Map<string, any>();

  constructor() {
    this.aggregatorRegistry = new AggregatorRegistry();
  }

  init(metric: MetricConfiguration<string[]>[] = []): void {
    metric.forEach((metric) => {
      const configuration = {
        name: metric.name,
        help: metric.description,
        labelNames: metric.labels,
      };

      if (metric.type === MetricType.COUNTER) {
        this.metrics.set(metric.name, new Counter(configuration));
      }
      if (metric.type === MetricType.HISTOGRAM) {
        const histogram = new Histogram({
          ...configuration,
          ...(metric?.buckets && { buckets: metric?.buckets }),
        });
        this.metrics.set(metric.name, histogram);
      }
      if (metric.type === MetricType.GAUGE) {
        this.metrics.set(metric.name, new Gauge(configuration));
      }
    });
  }

  async getResponse(res: Response) {
    const metrics = await this.aggregatorRegistry.clusterMetrics();
    res.contentType(this.aggregatorRegistry.contentType).send(metrics);
  }

  incrementCounter<T extends string[]>(
    config: MetricConfiguration<T>,
    labels: MetricLabels<T> = {},
  ): void {
    const counter = this.getCounterByName(config.name);
    if (counter instanceof Counter) {
      counter.inc(labels);
    }
  }

  incrementGauge<T extends string[]>(
    config: MetricConfiguration<T>,
    labels: MetricLabels<T> = {},
  ): void {
    const gauge = this.getGaugeByName(config.name);
    if (gauge instanceof Gauge) {
      gauge.inc(labels);
    }
  }

  decrementGauge<T extends string[]>(
    config: MetricConfiguration<T>,
    labels: MetricLabels<T> = {},
  ): void {
    const gauge = this.getGaugeByName(config.name);
    if (gauge instanceof Gauge) {
      gauge.dec(labels);
    }
  }

  setGauge<T extends string[]>(
    config: MetricConfiguration<T>,
    value: number,
    labels: MetricLabels<T> = {},
  ): void {
    const gauge = this.getGaugeByName(config.name);
    if (gauge instanceof Gauge) {
      gauge.set(labels, value);
    }
  }

  observeHistogram<T extends string[]>(
    config: MetricConfiguration<T>,
    value: number,
    labels: MetricLabels<T> = {},
  ): void {
    const histogram = this.getHistogramByName(config.name);
    if (histogram instanceof Histogram) {
      histogram.observe(labels, value);
    }
  }

  private getCounterByName(name: string) {
    const metric = this.metrics.get(name);
    if (metric instanceof Counter) {
      return metric;
    }
    console.log('Counter not found!');

    return null;
  }

  private getHistogramByName(name: string) {
    const metric = this.metrics.get(name);
    if (metric instanceof Histogram) {
      return metric;
    }
    console.log('Histogram not found!');

    return null;
  }

  private getGaugeByName(name: string) {
    const metric = this.metrics.get(name);
    if (metric instanceof Gauge) {
      return metric;
    }
    console.log('Gauge not found!');

    return null;
  }
}
