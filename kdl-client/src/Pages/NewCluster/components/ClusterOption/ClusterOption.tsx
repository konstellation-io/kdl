import { Button } from 'kwc';
import React from 'react';
import styles from './ClusterOption.module.scss';

type Props = {
  title: string;
  subtitle: string;
  actionLabel: string;
  to: string;
  Cluster: JSX.Element;
};

function ClusterOption({ title, subtitle, actionLabel, to, Cluster }: Props) {
  return (
    <div className={styles.container}>
      <div>{Cluster}</div>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={styles.button}>
        <Button label={actionLabel} to={to} primary />
      </div>
    </div>
  );
}

export default ClusterOption;
