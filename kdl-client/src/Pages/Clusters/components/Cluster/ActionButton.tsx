import { Action } from './Cluster';
import React from 'react';
import styles from './Cluster.module.scss';
import { useHistory } from 'react-router-dom';

function ActionButton({ label, Icon, onClick, to }: Action) {
  const history = useHistory();

  function handleOnClick() {
    if (onClick) onClick();
    else if (to) history.push(to || '');
  }

  return (
    <div className={styles.actionButtonContainer}>
      <div onClick={handleOnClick} className={styles.actionButtonBg} />
      <div className={styles.actionButtonContent}>
        <Icon className={'icon-regular'} />
        <p className={styles.actionButtonLabel}>{label}</p>
      </div>
    </div>
  );
}

export default ActionButton;
