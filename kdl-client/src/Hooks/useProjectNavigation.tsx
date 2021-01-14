import { useMemo } from 'react';
import ROUTE, { buildRoute } from '../Constants/routes';
import IconHome from '@material-ui/icons/Dashboard';
import IconSettings from '@material-ui/icons/Settings';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

export interface routeConfiguration {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
}
interface projectRouteConfiguration {
  [key: string]: routeConfiguration;
}

export const projectRoutesConfiguration: projectRouteConfiguration = {
  [ROUTE.PROJECT_OVERVIEW]: {
    label: 'Overview',
    icon: IconHome,
  },
  [ROUTE.PROJECT_TOOLS]: {
    label: 'Tools',
    icon: IconSettings,
  },
};

export interface enhancedRouteConfiguration extends routeConfiguration {
  to: string;
  id: string;
}

function useProjectNavigation(serverId: string, projectId: string) {
  const routesConfigurations: enhancedRouteConfiguration[] = useMemo(
    () =>
      Object.entries(projectRoutesConfiguration).map(
        ([routeString, routeConfiguration]) => {
          const route = routeString as ROUTE;
          return {
            id: `${projectId}-${routeConfiguration.label}`,
            to: buildRoute.project(route, serverId, projectId),
            label: routeConfiguration.label,
            icon: routeConfiguration.icon,
          };
        }
      ),
    [serverId, projectId]
  );
  return routesConfigurations;
}

export default useProjectNavigation;
