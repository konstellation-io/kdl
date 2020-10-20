import React, { FC } from 'react';

import cx from 'classnames';
import styles from './ColumnPage.module.scss';

type Props = {
  title: string;
  subtitle?: string;
  onBgClick?: Function;
  children: JSX.Element;
};
const ColumnPage: FC<Props> = ({ title, subtitle, onBgClick, children }) => {
  return (
    <>
      <div
        className={cx(styles.bg, { [styles.active]: !!onBgClick })}
        onClick={() => onBgClick && onBgClick()}
      />
      <div className={styles.container}>
        <h1>{title}</h1>
        {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
};

export default ColumnPage;
