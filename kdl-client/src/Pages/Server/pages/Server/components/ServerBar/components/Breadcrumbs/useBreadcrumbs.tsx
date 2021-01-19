import { useRouteMatch, useLocation } from 'react-router-dom';
import ROUTE from 'Constants/routes';
import { useQuery } from '@apollo/client';
import {
  GET_OPENED_SERVER,
  GetOpenedServer,
} from 'Graphql/client/queries/getOpenedServer.graphql';
import React from 'react';
import ServerIcon from 'Components/Icons/ServerIcon/ServerIcon';
import ServerIconStyle from 'Components/Icons/ServerIcon/ServerIcon.module.scss';
import ProjectIcon from 'Components/Icons/ProjectIcon/ProjectIcon';
import ProjectIconStyle from 'Components/Icons/ProjectIcon/ProjectIcon.module.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ServerMetrics from 'Pages/Server/pages/Server/components/ServerBar/components/ServerMetrics/ServerMetrics';
import { CrumbProps } from 'Pages/Server/pages/Server/components/ServerBar/components/Breadcrumbs/components/Crumb/Crumb';
import {
  GET_OPENED_PROJECT,
  GetOpenedProject,
} from 'Graphql/client/queries/getOpenedProject.graphql';
import useProjectNavigation, {
  EnhancedRouteConfiguration,
  projectRoutesConfiguration,
} from 'Hooks/useProjectNavigation';
import ProjectSelector from '../ProjectSelector/ProjectSelector';
import { GetProjects } from 'Graphql/queries/types/GetProjects';
import { loader } from 'graphql.macro';
import SectionSelector from '../SectionSelector/SectionSelector';
import cx from 'classnames';
const GetProjectsQuery = loader('Graphql/queries/getProjects.graphql');

function useBreadcrumbs() {
  const crumbs: CrumbProps[] = [];
  const routeMatch = useRouteMatch(ROUTE.PROJECT);
  const location = useLocation();
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useQuery<GetProjects>(GetProjectsQuery);
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useQuery<GetOpenedProject>(GET_OPENED_PROJECT);
  const {
    data: serverData,
    loading: serverLoading,
    error: serverError,
  } = useQuery<GetOpenedServer>(GET_OPENED_SERVER);

  const {
    name: serverName,
    id: serverId,
    url: serverUrl,
    state: serverState,
  } = serverData?.openedServer || {
    name: '',
    id: '',
    url: '',
    state: '',
  };
  const openedProject = projectData?.openedProject || {
    id: '',
    name: '',
    state: '',
  };
  const projectSections: EnhancedRouteConfiguration[] = useProjectNavigation(
    serverId,
    openedProject.id
  );

  // Add server crumb
  crumbs.push({
    crumbText: serverName,
    LeftIconComponent: (
      <ServerIcon className={cx('icon-small', ServerIconStyle[serverState])} />
    ),
    BottomComponent: (
      <ServerMetrics serverUrl={serverUrl || ''} serverId={serverId} />
    ),
  });

  // Check if we are in a project
  if (routeMatch && openedProject) {
    // Add crumb for the project
    crumbs.push({
      crumbText: openedProject.name,
      LeftIconComponent: (
        <ProjectIcon
          className={cx('icon-small', ProjectIconStyle[openedProject.state])}
        />
      ),
      BottomComponent: (
        <ProjectSelector
          options={projectsData?.projects || []}
          selectedProjectId={openedProject.id}
          serverId={serverId}
        />
      ),
    });

    // Add crumb for the section
    const lastParam: string = location.pathname.split('/').pop() || '';
    const projectRoute = Object.values(projectRoutesConfiguration).find(
      ({ label }) => label.toLowerCase() === lastParam.toLowerCase()
    );

    if (projectRoute) {
      const { label: crumbText, Icon } = projectRoute;
      crumbs.push({
        crumbText,
        LeftIconComponent: <Icon className="icon-small" />,
        RightIconComponent: ExpandMoreIcon,
        BottomComponent: (
          <SectionSelector
            options={projectSections}
            selectedSection={lastParam}
          />
        ),
      });
    }
  }

  return {
    crumbs,
  };
}

export default useBreadcrumbs;
