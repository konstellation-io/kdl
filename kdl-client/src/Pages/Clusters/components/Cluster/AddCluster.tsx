import IconAdd from '@material-ui/icons/Add';
import React from 'react';
import styles from './Cluster.module.scss';
import { useHistory } from 'react-router-dom';

type Props = {
  label: string;
  to: string;
};
function AddCluster({ label, to }: Props) {
  const history = useHistory();

  return (
    <div className={styles.addClusterContainer}>
      <div className={styles.addClusterBg} onClick={() => history.push(to)} />
      <div className={styles.addClusterLabel}>
        <IconAdd className="icon-regular" />
        <p>{label}</p>
      </div>
    </div>
  );
}

export default AddCluster;
