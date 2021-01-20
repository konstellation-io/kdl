import { useMemo } from 'react';
import ROUTE, { buildRoute } from '../Constants/routes';
import IconHome from '@material-ui/icons/Dashboard';
import IconSettings from '@material-ui/icons/Settings';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

export interface RouteConfiguration {
  label: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
}

export const projectRoutesConfiguration: {
  [key: string]: RouteConfiguration;
} = {
  [ROUTE.PROJECT_OVERVIEW]: {
    label: 'Overview',
    Icon: IconHome,
  },
  [ROUTE.PROJECT_TOOLS]: {
    label: 'Tools',
    Icon: IconSettings,
  },
};

export interface EnhancedRouteConfiguration extends RouteConfiguration {
  to: string;
}

function useProjectNavigation(serverId: string, projectId: string) {
  const routesConfigurations: EnhancedRouteConfiguration[] = useMemo(
    () =>
      Object.entries(projectRoutesConfiguration).map(
        ([routeString, { label, Icon }]) => ({
          to: buildRoute.project(routeString as ROUTE, serverId, projectId),
          label,
          Icon,
        })
      ),
    [serverId, projectId]
  );
  return routesConfigurations;
}

export default useProjectNavigation;
