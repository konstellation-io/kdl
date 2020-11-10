import { Link, useParams } from 'react-router-dom';
import ROUTE, { RouteClusterParams, buildRoute } from 'Constants/routes';

import IconAdd from '@material-ui/icons/Add';
import React from 'react';
import styles from './Project.module.scss';

function AddProject() {
  const { clusterId } = useParams<RouteClusterParams>();

  return (
    <div className={styles.addProjectContainer}>
      <Link to={buildRoute.cluster(ROUTE.NEW_PROJECT, clusterId)}>
        <div className={styles.addProjectBg}>
          <div className={styles.addProjectBgUpper} />
          <div className={styles.addProjectBgLower} />
        </div>
      </Link>
      <div className={styles.addProjectLabel}>
        <IconAdd className="icon-regular" />
        <p>ADD PROJECT</p>
      </div>
    </div>
  );
}

export default AddProject;
