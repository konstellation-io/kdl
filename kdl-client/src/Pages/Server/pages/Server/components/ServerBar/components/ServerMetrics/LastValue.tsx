import { Metric } from './ServerMetrics';
import React from 'react';
import styles from './ServerMetrics.module.scss';

function LastValue(metric: Metric) {
  return (
    <div className={styles.lastValue}>
      <p className={styles.value} style={{ color: metric.color }}>{`${
        metric.data.slice(-1)[0].y
      }${metric.unit}`}</p>
      <p className={styles.label}>{metric.label}</p>
    </div>
  );
}
export default LastValue;