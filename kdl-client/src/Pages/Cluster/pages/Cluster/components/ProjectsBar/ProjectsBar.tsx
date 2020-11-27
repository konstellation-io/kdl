import { Button, Left, Right } from 'kwc';
import ROUTE, { RouteClusterParams, buildRoute } from 'Constants/routes';

import IconAdd from '@material-ui/icons/Add';
import ProjectsFilter from './components/ProjectsFilter/ProjectsFilter';
import ProjectsOrder from './components/ProjectsOrder/ProjectsOrder';
import React from 'react';
import styles from './ProjectsBar.module.scss';
import { useParams } from 'react-router-dom';

function ProjectsBar() {
  const { clusterId } = useParams<RouteClusterParams>();

  return (
    <div className={styles.container}>
      <Left className={styles.left}>
        <ProjectsFilter />
        <ProjectsOrder />
      </Left>
      <Right>
        <Button
          label="ADD PROJECT"
          Icon={IconAdd}
          className={styles.addProjectButton}
          to={buildRoute.cluster(ROUTE.NEW_PROJECT, clusterId)}
        />
      </Right>
    </div>
  );
}

export default ProjectsBar;
