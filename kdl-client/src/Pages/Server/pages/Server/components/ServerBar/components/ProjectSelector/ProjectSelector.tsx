import React, { FC } from 'react';
import styles from './ProjectSelector.module.scss';
import { GetProjects_projects } from 'Graphql/queries/types/GetProjects';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import ROUTE, { buildRoute } from 'Constants/routes';
import { Button } from 'kwc';
import IconAdd from '@material-ui/icons/Add';

type Props = {
  options: GetProjects_projects[];
  selectedProjectId: string;
  serverId: string;
};
const ProjectSelector: FC<Props> = ({
  selectedProjectId,
  options,
  serverId,
}) => (
  <div className={styles.container}>
    <ul>
      {options.map(({ id, name }: GetProjects_projects) => (
        <Link to={buildRoute.project(ROUTE.PROJECT, serverId, id)} key={id}>
          <li
            className={cx(styles.project, {
              [styles.selectedProject]: id === selectedProjectId,
            })}
          >
            {name}
          </li>
        </Link>
      ))}
    </ul>
    <Button
      Icon={IconAdd}
      label="NEW PROJECT"
      className={styles.addProjectButton}
      to={buildRoute.server(ROUTE.NEW_PROJECT, serverId)}
    />
  </div>
);
export default ProjectSelector;
