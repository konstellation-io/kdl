import { NavLink, useParams } from 'react-router-dom';
import React, { FC, useEffect, useState } from 'react';
import usePanel, { PanelType } from 'Pages/Server/apollo/hooks/usePanel';

import IconCollapse from '@material-ui/icons/KeyboardBackspace';
import IconSettings from '@material-ui/icons/Settings';
import NavigationButton from './NavigationButton';
import { PANEL_ID } from 'Pages/Server/apollo/models/Panel';
import { RouteProjectParams } from 'Constants/routes';
import { SpinnerCircular } from 'kwc';
import cx from 'classnames';
import styles from './ProjectNavigation.module.scss';
import useProjectNavigation from 'Hooks/useProjectNavigation';
import useWorkspace from 'Hooks/useWorkspace';

const NavButtonLink: FC<any> = ({ children, ...props }) => (
  <NavLink {...props} activeClassName={styles.active} exact>
    {children}
  </NavLink>
);

function ProjectNavigation() {
  const { serverId, projectId } = useParams<RouteProjectParams>();
  const { workspace, loading, toggleProjectNavOpened } = useWorkspace();
  const [opened, setOpened] = useState(
    workspace?.project.navigationOpened || false
  );
  const { togglePanel } = usePanel(PanelType.PRIMARY, {
    id: PANEL_ID.SETTINGS,
    title: 'Settings',
    fixedWidth: true,
  });

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
        <div onClick={togglePanel}>
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
