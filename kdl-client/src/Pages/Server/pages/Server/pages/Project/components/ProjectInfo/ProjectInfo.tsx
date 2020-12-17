import { GetProjects_projects } from 'Graphql/queries/types/GetProjects';
import IconTime from '@material-ui/icons/AccessTime';
import React from 'react';
import cx from 'classnames';
import { formatDate } from 'Utils/format';
import styles from './ProjectInfo.module.scss';

type Props = {
  project: GetProjects_projects;
};
function ProjectInfo({ project }: Props) {
  const connectedToRepo = project.repository?.connected;

  return (
    <div>
      <div className={styles.time}>
        <IconTime className="icon-small" />
        <p>{`ACTIVE FROM: ${formatDate(
          new Date(project.lastActivationDate),
          true
        )}`}</p>
      </div>
      <div
        className={cx(styles.connection, {
          [styles.connected]: connectedToRepo,
        })}
      >
        <p>
          {connectedToRepo
            ? 'Connection established'
            : 'You are not connected from the repository'}
        </p>
      </div>
    </div>
  );
}

export default ProjectInfo;
