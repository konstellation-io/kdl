import React from 'react';
import cx from 'classnames';
import styles from './Cluster.module.scss';

export enum DIRECTION {
  UP = 'up',
  DOWN = 'down',
}

type Props = {
  direction: DIRECTION;
};
function Cluster({ direction }: Props) {
  return <div className={cx(styles.triangle, styles[direction])} />;
}

export default Cluster;
