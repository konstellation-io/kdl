import React, { FC } from 'react';
import styles from './ArrowsNavigator.module.scss';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import ArrowForward from '@material-ui/icons/ArrowForwardIos';

type Props = {
  onBackClick: () => void;
  onForwardClick: () => void;
};

const ArrowsNavigator: FC<Props> = ({ onBackClick, onForwardClick }) => (
  <div className={styles.container}>
    <div className={styles.arrowNavigator} onClick={onBackClick}>
      <ArrowBack className="icon-small" />
    </div>
    <div className={styles.arrowNavigator} onClick={onForwardClick}>
      <ArrowForward className="icon-small" />
    </div>
  </div>
);

export default ArrowsNavigator;
