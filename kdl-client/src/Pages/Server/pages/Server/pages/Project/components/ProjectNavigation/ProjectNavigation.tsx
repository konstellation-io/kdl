import { NavLink, useParams } from 'react-router-dom';
import { RouteProjectParams } from 'Constants/routes';
import React, { FC, useEffect, useState } from 'react';

import IconCollapse from '@material-ui/icons/KeyboardBackspace';
import IconSettings from '@material-ui/icons/Settings';
import NavigationButton from './NavigationButton';
import { SpinnerCircular } from 'kwc';
import cx from 'classnames';
import styles from './ProjectNavigation.module.scss';
import useWorkspace from 'Hooks/useWorkspace';
import useProjectNavigation from 'Hooks/useProjectNavigation';

const NavButtonLink: FC<any> = ({ children, ...props }) => (
  <NavLink {...props} activeClassName={styles.active} exact>
    {children}
  </NavLink>
);

type Props = {
  toggleSettings: () => void;
};

function ProjectNavigation({ toggleSettings }: Props) {
  const { serverId, projectId } = useParams<RouteProjectParams>();
  const { workspace, loading, toggleProjectNavOpened } = useWorkspace();
  const [opened, setOpened] = useState(
    workspace?.project.navigationOpened || false
  );

  // navigationOpened state can be retrieve from useWorkspace, having this
  // state here prevents lagging between updating a new value and retriving it.
  useEffect(() => {
    if (workspace?.project) {
      setOpened(workspace.project.navigationOpened);
    }
  }, [workspace]);

  function onToggleOpened() {
    setOpened(!opened);
    toggleProjectNavOpened();
  }

  const projectRoutes = useProjectNavigation(serverId, projectId);

  if (loading || !workspace?.project) return <SpinnerCircular />;

  return (
    <div className={cx(styles.container, { [styles.opened]: opened })}>
      <div className={styles.top}>
        {projectRoutes.map(({ Icon, label, to }) => (
          <NavButtonLink to={to} key={label}>
            <NavigationButton label={label} Icon={Icon} />
          </NavButtonLink>
        ))}
      </div>
      <div className={styles.bottom}>
        <div onClick={toggleSettings}>
          <NavigationButton label="SETTINGS" Icon={IconSettings} />
        </div>
        <div
          className={cx({
            [styles.collapsed]: !opened,
          })}
          onClick={onToggleOpened}
        >
          <NavigationButton label="COLLAPSE" Icon={IconCollapse} />
        </div>
      </div>
    </div>
  );
}

export default ProjectNavigation;
