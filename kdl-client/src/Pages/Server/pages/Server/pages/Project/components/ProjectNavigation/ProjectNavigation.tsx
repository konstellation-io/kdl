import { NavLink, useParams } from 'react-router-dom';
import ROUTE, { RouteProjectParams, buildRoute } from 'Constants/routes';
import React, { FC, useCallback, useEffect, useState } from 'react';

import IconCollapse from '@material-ui/icons/KeyboardBackspace';
import IconHome from '@material-ui/icons/Dashboard';
import IconSettings from '@material-ui/icons/Settings';
import IconTools from 'Components/Icons/HomeRepairService';
import NavigationButton from './NavigationButton';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SpinnerCircular } from 'kwc';
import { SvgIconTypeMap } from '@material-ui/core';
import cx from 'classnames';
import extensions from 'extensions/extensions';
import styles from './ProjectNavigation.module.scss';
import useWorkspace from 'Hooks/useWorkspace';

const NavButtonLink: FC<any> = ({ children, ...props }) => (
  <NavLink {...props} activeClassName={styles.active} exact>
    {children}
  </NavLink>
);

export type NavigationData = {
  route: string;
  label: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
};
const navigationData: NavigationData[] = [
  {
    route: ROUTE.PROJECT_OVERVIEW,
    label: 'OVERVIEW',
    Icon: IconHome,
  },
  {
    route: ROUTE.PROJECT_TOOLS,
    label: 'TOOLS',
    Icon: IconTools,
  },
];

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

  const getRoute = useCallback(
    (route: string) => buildRoute.project(route as ROUTE, serverId, projectId),
    [serverId, projectId]
  );

  if (loading || !workspace?.project) return <SpinnerCircular />;

  const navElements = navigationData.concat(extensions.getNavigationElements());

  return (
    <div className={cx(styles.container, { [styles.opened]: opened })}>
      <div className={styles.top}>
        {navElements.map(({ route, label, Icon }) => (
          <NavButtonLink key={label} to={getRoute(route)}>
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

enum Foo {
  FOO = 'FOO',
  BAR = 'BAR',
}

const obj: { [key in keyof typeof Foo]: string } = { [Foo.FOO]: 'bar' };

export default ProjectNavigation;
