import ClusterDetails from './ClusterDetails';
import ProjectsShown from './ProjectsShown';
import ProjectsShownStatus from './ProjectsShownStatus';
import React from 'react';
import styles from './ClusterInfo.module.scss';

function ClusterInfo() {
  return (
    <div className={styles.container}>
      <ClusterDetails />
      <ProjectsShown />
      <ProjectsShownStatus />
    </div>
  );
}

export default ClusterInfo;
