import React, { MouseEvent } from 'react';

import IconCompleted from '@material-ui/icons/Check';
import IconError from '@material-ui/icons/Error';
import IconIncomplete from '@material-ui/icons/Schedule';
import cx from 'classnames';
import styles from './Stepper.module.scss';

type Props = {
  label: string;
  error: boolean;
  completed: boolean;
  active: boolean;
  visited: boolean;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
};
function Step({ label, completed, error, active, visited, onClick }: Props) {
  let Icon;
  switch (true) {
    case completed:
      Icon = IconCompleted;
      break;
    case error:
      Icon = IconError;
      break;
    default:
      Icon = IconIncomplete;
  }

  return (
    <div
      className={cx(styles.step, {
        [styles.completed]: completed,
        [styles.error]: error,
        [styles.active]: active,
        [styles.visited]: visited,
      })}
      onClick={onClick}
    >
      <div className={styles.circle}>
        <Icon className="icon-small" />
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}

export default Step;
