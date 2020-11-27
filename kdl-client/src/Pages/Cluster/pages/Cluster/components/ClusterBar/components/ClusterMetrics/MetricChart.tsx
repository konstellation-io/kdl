import { Metric } from './ClusterMetrics';
import React from 'react';
import TimeSeriesChart from 'Components/Charts/TimeSeriesChart/TimeSeriesChart';
import { format } from 'd3-format';
import { formatDate } from 'Utils/format';
import styles from './ClusterMetrics.module.scss';

function LastValue({ label, color, unit, data }: Metric) {
  return (
    <div className={styles.chart}>
      <TimeSeriesChart
        title={label}
        color={color}
        data={data}
        unit={unit}
        formatYAxis={(v) => format('.3s')(v)}
        formatXAxis={(date) => formatDate(new Date(date), true)}
      />
    </div>
  );
}
export default LastValue;
