import React from 'react';
import cx from 'classnames';
import styles from './Repository.module.scss';

export enum LOCATION {
  IN = 'in',
  OUT = 'out',
}
export enum SIZE {
  SMALL = 'small',
  MEDIUM = 'medium',
}

type Props = {
  squareLocation: LOCATION;
  size?: SIZE;
  shouldAnimate?: boolean;
};
function RepositoryTypeComponent({
  squareLocation,
  size = SIZE.MEDIUM,
  shouldAnimate = true,
}: Props) {
  return (
    <div
      className={cx(styles.square, styles[squareLocation], styles[size], {
        [styles.notAnimate]: !shouldAnimate,
      })}
    >
      <div className={styles.s4} />
      <div className={styles.s3} />
      <div className={styles.s2} />
      <div className={styles.s1} />
    </div>
  );
}

export default RepositoryTypeComponent;
