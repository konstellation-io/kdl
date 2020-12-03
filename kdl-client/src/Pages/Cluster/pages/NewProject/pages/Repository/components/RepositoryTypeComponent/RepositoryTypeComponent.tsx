import React from 'react';
import cx from 'classnames';
import styles from './Repository.module.scss';

export enum LOCATION {
  IN = 'in',
  OUT = 'out',
}

type Props = {
  squareLocation: LOCATION;
};
function RepositoryTypeComponent({ squareLocation }: Props) {
  return (
    <div className={cx(styles.square, styles[squareLocation])}>
      <div className={styles.s4} />
      <div className={styles.s3} />
      <div className={styles.s2} />
      <div className={styles.s1} />
    </div>
  );
}

export default RepositoryTypeComponent;
