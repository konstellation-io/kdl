import React, { useState } from 'react';

import { CSSTransition } from 'react-transition-group';
import LastValue from './LastValue';
import MetricChart from './MetricChart';
import cx from 'classnames';
import styles from './ServerMetrics.module.scss';

export type MetricData = {
  x: Date;
  y: number;
};

export type Metric = {
  label: string;
  unit: string;
  color: string;
  data: MetricData[];
};

const t1 = new Date();
t1.setHours(t1.getHours() - 2);
const t2 = new Date();
t2.setHours(t2.getHours() - 1);
const t3 = new Date();

const metrics: Metric[] = [
  {
    label: 'RAM',
    unit: 'GB',
    color: '#FC915F',
    data: [
      { x: t1, y: 200 },
      { x: t2, y: 300 },
      { x: t3, y: 100 },
    ],
  },
  {
    label: 'CPU',
    unit: 'Cores',
    color: '#3FF',
    data: [
      { x: t1, y: 10 },
      { x: t2, y: 33 },
      { x: t3, y: 92 },
    ],
  },
  {
    label: 'STORAGE',
    unit: 'GB',
    color: '#6DAA48',
    data: [
      { x: t1, y: 12 },
      { x: t2, y: 0 },
      { x: t3, y: 37 },
    ],
  },
];

function ServerMetrics() {
  const metricLastValues = metrics.map((metric) => (
    <LastValue key={metric.label} {...metric} />
  ));
  const metricCharts = metrics.map((metric) => (
    <MetricChart key={metric.label} {...metric} />
  ));
  const [opened, setOpened] = useState(false);

  function toggleOpened() {
    setOpened(!opened);
  }

  return (
    <div className={styles.container}>
      <div
        className={cx(styles.lastValues, { [styles.opened]: opened })}
        onClick={toggleOpened}
      >
        {metricLastValues}
      </div>
      <CSSTransition
        in={opened}
        timeout={500}
        classNames={{
          enter: styles.enter,
          enterActive: styles.enterActive,
          exit: styles.exit,
          exitDone: styles.exitDone,
        }}
        unmountOnExit
      >
        <div className={styles.charts}>{metricCharts}</div>
      </CSSTransition>
    </div>
  );
}

export default ServerMetrics;
