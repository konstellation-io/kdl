import React from 'react';

import styles from './Token.module.scss';
import KeyIcon from '@material-ui/icons/VpnKey';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from 'kwc';

type Props = {
  label: string;
  creationDate: string;
  lastUsedDate: string;
};

const Token: React.FC<Props> = ({ label, creationDate, lastUsedDate }) => {
  return (
    <div className={styles.container}>
      <div className={styles.ownerContainer}>
        <div className={styles.owner}>
          <KeyIcon className="icon-small" />
          <span className={styles.ownerName}>{label}</span>
        </div>
        <Button label="DELETE" Icon={DeleteIcon} />
      </div>
      <div className={styles.datesContainer}>
        <div>
          <span className={styles.dateLabel}>GENERATED ON:</span>
          <span className={styles.date}>{creationDate}</span>
        </div>
        <div>
          <span className={styles.dateLabel}>LAST USED:</span>
          <span className={styles.date}>{lastUsedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default Token;