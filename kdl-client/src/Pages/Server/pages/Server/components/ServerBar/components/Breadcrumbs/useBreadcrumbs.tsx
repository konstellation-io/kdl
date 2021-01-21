import { useRouteMatch, useLocation } from 'react-router-dom';
import ROUTE from 'Constants/routes';
import { useQuery } from '@apollo/client';
import {
  GET_OPENED_SERVER,
  GetOpenedServer,
} from 'Graphql/client/queries/getOpenedServer.graphql';
import React from 'react';
import ServerIcon from 'Components/Icons/ServerIcon/ServerIcon';
import ProjectIcon from 'Components/Icons/ProjectIcon/ProjectIcon';
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

  const projectSections: EnhancedRouteConfiguration[] = useProjectNavigation(
    serverData?.openedServer?.id || '',
    projectData?.openedProject?.id || ''
  );

  const loading = projectLoading || projectsLoading || serverLoading;
  const error = projectError || projectsError || serverError;

  if (loading || !projectsData || !serverData?.openedServer)
    return { loading, crumbs };
  if (error) throw Error('cannot retrieve data at useBreadcrumbs');

  const {
    name: serverName,
    id: serverId,
    url: serverUrl,
    state: serverState,
  } = serverData.openedServer;
  const openedProject = projectData?.openedProject;

  // Add server crumb
  crumbs.push({
    crumbText: serverName,
    LeftIconComponent: (
      <ServerIcon className="icon-small" state={serverState} />
    ),
    BottomComponent: (
      <ServerMetrics serverUrl={serverUrl} serverId={serverId} />
    ),
  });

  // Check if we are in a project
  if (routeMatch && openedProject) {
    // Add crumb for the project
    const { name, state, id } = openedProject;
    crumbs.push({
      crumbText: name,
      LeftIconComponent: <ProjectIcon className="icon-small" state={state} />,
      BottomComponent: (
        <ProjectSelector
          options={projectsData.projects}
          selectedProjectId={id}
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
