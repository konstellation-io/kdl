import React, { FC } from 'react';

import ActionsBar from 'Components/Layout/ActionsBar/ActionsBar';
import cx from 'classnames';
import styles from './ColumnPage.module.scss';

type Props = {
  title: string;
  subtitle?: string;
  onBgClick?: Function;
  children: JSX.Element;
  actions?: JSX.Element | JSX.Element[];
};
const ColumnPage: FC<Props> = ({
  title,
  subtitle,
  onBgClick,
  actions,
  children,
}) => {
  return (
    <>
      <div
        className={cx(styles.bg, { [styles.active]: !!onBgClick })}
        onClick={() => onBgClick && onBgClick()}
      />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>{title}</h1>
          {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
          <div className={styles.children}>{children}</div>
        </div>
        {actions && <ActionsBar>{actions}</ActionsBar>}
      </div>
    </>
  );
};

export default ColumnPage;
