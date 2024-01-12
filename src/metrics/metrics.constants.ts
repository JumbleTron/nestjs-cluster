import { MetricConfiguration, MetricType } from './metricCollectorService';

export const preEventsCounter: MetricConfiguration<['provider']> = {
  type: MetricType.COUNTER,
  name: 'pre_events_total',
  description: 'Total numbers of preEvent',
  labels: ['provider'],
};
