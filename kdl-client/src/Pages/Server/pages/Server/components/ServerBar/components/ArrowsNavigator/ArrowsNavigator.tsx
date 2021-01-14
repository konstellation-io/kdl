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
    <ArrowBack className="icon-small" onClick={onBackClick} />
    <ArrowForward className="icon-small" onClick={onForwardClick} />
  </div>
);

export default ArrowsNavigator;
