import { NavLink, useParams } from 'react-router-dom';
import ROUTE, { RouteProjectParams, buildRoute } from 'Constants/routes';
import React, { FC, useCallback, useEffect, useState } from 'react';

import IconAssets from '@material-ui/icons/LineStyle';
import IconCollapse from '@material-ui/icons/KeyboardBackspace';
import IconDocumentation from '@material-ui/icons/Description';
import IconExperiments from '@material-ui/icons/TrackChanges';
import IconGoals from '@material-ui/icons/Flag';
import IconHome from '@material-ui/icons/Dashboard';
import IconKG from '@material-ui/icons/BlurOn';
import IconRuntimes from '@material-ui/icons/Games';
import IconSettings from '@material-ui/icons/Settings';
import IconTools from '@material-ui/icons/Build';
import NavigationButton from './NavigationButton';
import { SpinnerCircular } from 'kwc';
import cx from 'classnames';
import styles from './ProjectNavigation.module.scss';
import useWorkspace from 'Hooks/useWorkspace';

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
  const [opened, setOpened] = useState(false);

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

  const getRoute = useCallback(
    (route: ROUTE) => buildRoute.project(route, serverId, projectId),
    [serverId, projectId]
  );

  if (loading || !workspace?.project) return <SpinnerCircular />;

  return (
    <div className={cx(styles.container, { [styles.opened]: opened })}>
      <div className={styles.top}>
        <NavButtonLink to={getRoute(ROUTE.PROJECT)}>
          <NavigationButton label="OVERVIEW" Icon={IconHome} />
        </NavButtonLink>
        <NavButtonLink to={getRoute(ROUTE.HOME)}>
          <NavigationButton label="TOOLS" Icon={IconTools} />
        </NavButtonLink>
        <NavButtonLink to={getRoute(ROUTE.HOME)}>
          <NavigationButton label="KNOWLEDGE GRAPH" Icon={IconKG} />
        </NavButtonLink>
        <NavButtonLink to={getRoute(ROUTE.HOME)}>
          <NavigationButton label="DOCUMENTATION" Icon={IconDocumentation} />
        </NavButtonLink>
        <NavButtonLink to={getRoute(ROUTE.HOME)}>
          <NavigationButton label="ASSETS" Icon={IconAssets} />
        </NavButtonLink>
        <NavButtonLink to={getRoute(ROUTE.HOME)}>
          <NavigationButton label="GOALS" Icon={IconGoals} />
        </NavButtonLink>
        <NavButtonLink to={getRoute(ROUTE.HOME)}>
          <NavigationButton label="EXPERIMENTS" Icon={IconExperiments} />
        </NavButtonLink>
        <NavButtonLink to={getRoute(ROUTE.HOME)}>
          <NavigationButton label="RUNTIMES" Icon={IconRuntimes} />
        </NavButtonLink>
      </div>
      <div className={styles.bottom}>
        <div onClick={toggleSettings}>
          <NavigationButton label="SETTINGS" Icon={IconSettings} />
        </div>
        <div
          className={cx({
            [styles.collapsed]: !workspace.project.navigationOpened,
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
