import React from 'react';
import cx from 'classnames';
import styles from './Server.module.scss';

export enum DIRECTION {
  UP = 'up',
  DOWN = 'down',
}

type Props = {
  direction: DIRECTION;
};
function Server({ direction }: Props) {
  return (
    <div className={cx(styles.triangle, styles[direction])}>
      <div className={styles.t4}>▲</div>
      <div className={styles.t3}>▲</div>
      <div className={styles.t2}>▲</div>
      <div className={styles.t1}>▲</div>
    </div>
  );
}

export default Server;
