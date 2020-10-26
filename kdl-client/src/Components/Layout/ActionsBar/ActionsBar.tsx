import React, { FC } from 'react';

import { HorizontalBar } from 'kwc';
import cx from 'classnames';
import styles from './ActionsBar.module.scss';

type Props = {
  centerActions?: boolean;
  children: JSX.Element | JSX.Element[];
};
const ActionsBar: FC<Props> = ({ children, centerActions = false }) => {
  return (
    <div className={styles.container}>
      <HorizontalBar
        className={cx(styles.actions, { [styles.center]: centerActions })}
      >
        {children}
      </HorizontalBar>
    </div>
  );
};

export default ActionsBar;
