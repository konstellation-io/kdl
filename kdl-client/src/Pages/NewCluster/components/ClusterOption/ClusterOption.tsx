import { Button } from 'kwc';
import React from 'react';
import clusterStyles from '../Cluster/Cluster.module.scss';
import containerStyles from '../../NewCluster.module.scss';
import cx from 'classnames';
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
    <div
      className={cx(
        styles.container,
        clusterStyles.hoverContainer,
        containerStyles.cluster
      )}
    >
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
