import React from 'react';
import cx from 'classnames';
import styles from './ProjectNavigation.module.scss';

type Props = {
  label: string;
  Icon: any;
};

function NavigationButton({ label, Icon }: Props) {
  return (
    <div className={styles.navButton} title={label}>
      <Icon className={cx('icon-regular', styles.icon)} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default NavigationButton;
