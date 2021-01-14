import React, { FC } from 'react';

import MetricChart from './MetricChart';
import styles from './ServerMetrics.module.scss';
import CopyToClipboard from '../../../../../../../../Components/CopyToClipboard/CopyToClipboard';
import { Button, BUTTON_ALIGN } from 'kwc';
import IconProjects from '@material-ui/icons/Widgets';
import IconUsers from '@material-ui/icons/Person';
import ROUTE, { buildRoute } from '../../../../../../../../Constants/routes';

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

type Props = {
  serverId: string;
  serverUrl: string;
};

const ServerMetrics: FC<Props> = ({ serverUrl, serverId }) => (
  <div className={styles.container}>
    <div className={styles.serverUrl}>
      <span className={styles.label}>SERVER URL</span>
      <span className={styles.url}>{serverUrl}</span>
      <CopyToClipboard>{serverUrl}</CopyToClipboard>
    </div>
    <div className={styles.charts}>
      {metrics.map((metric) => (
        <MetricChart key={metric.label} {...metric} />
      ))}
    </div>
    <div className={styles.buttons}>
      <Button
        label="USERS"
        Icon={IconUsers}
        to={buildRoute.server(ROUTE.SERVER_USERS, serverId)}
        className={styles.selectButton}
        align={BUTTON_ALIGN.LEFT}
      />
      <Button
        label="PROJECTS"
        to={buildRoute.server(ROUTE.SERVER, serverId)}
        Icon={IconProjects}
        className={styles.selectButton}
        align={BUTTON_ALIGN.LEFT}
      />
    </div>
  </div>
);
export default ServerMetrics;
