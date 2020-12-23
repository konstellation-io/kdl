import React from 'react';

import styles from './Token.module.scss';
import KeyIcon from '@material-ui/icons/VpnKey';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from 'kwc';

type Props = {
  id: string;
  name: string;
  creationDate: string;
  lastUsedDate: string;
  onDeleteClick: (id: string) => void;
};

const Token: React.FC<Props> = ({
  id,
  name,
  creationDate,
  lastUsedDate,
  onDeleteClick,
}) => (
  <div className={styles.container}>
    <div className={styles.wrapper}>
      <div className={styles.labelContainer}>
        <div className={styles.labelWrapper}>
          <KeyIcon className="icon-small" />
          <div className={styles.infoContainer}>
            <span className={styles.label}>{name}</span>
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
        </div>
        <Button
          label="DELETE"
          Icon={DeleteIcon}
          onClick={() => onDeleteClick(id)}
        />
      </div>
    </div>
  </div>
);

export default Token;
