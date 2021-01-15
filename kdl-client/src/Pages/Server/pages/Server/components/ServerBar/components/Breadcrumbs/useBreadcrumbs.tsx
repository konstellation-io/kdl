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
  enhancedRouteConfiguration,
  projectRoutesConfiguration,
  routeConfiguration,
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
  const { data: projectsData } = useQuery<GetProjects>(GetProjectsQuery);
  const { data: projectData } = useQuery<GetOpenedProject>(GET_OPENED_PROJECT);
  const { data: serverData } = useQuery<GetOpenedServer>(GET_OPENED_SERVER);
  const {
    name: serverName,
    id: serverId,
    url: serverUrl,
  } = serverData?.openedServer || {
    name: '',
    id: '',
    url: '',
  };
  const openedProject = projectData?.openedProject || {
    id: '',
    name: '',
  };
  const projectSections: enhancedRouteConfiguration[] = useProjectNavigation(
    serverId,
    openedProject.id
  );

  // Add server crumb
  crumbs.push({
    crumbText: serverName,
    LeftIconComponent: ServerIcon,
    bottomComponent: (
      <ServerMetrics serverUrl={serverUrl || ''} serverId={serverId} />
    ),
  });

  // Check if we are in a project
  if (routeMatch && openedProject) {
    // Add crumb for the project
    crumbs.push({
      crumbText: openedProject.name,
      LeftIconComponent: ProjectIcon,
      bottomComponent: (
        <ProjectSelector
          options={projectsData?.projects || []}
          selectedProjectId={openedProject.id}
          serverId={serverId}
        />
      ),
    });

    // Add crumb for the section
    const lastParam: string = location.pathname.split('/').pop() || '';
    const projectRoute: routeConfiguration | undefined = Object.values(
      projectRoutesConfiguration
    ).find(
      (configuration) =>
        configuration.label.toLowerCase() === lastParam.toLowerCase()
    );
    if (projectRoute) {
      crumbs.push({
        crumbText: projectRoute.label,
        LeftIconComponent: projectRoute.icon,
        RightIconComponent: ExpandMoreIcon,
        bottomComponent: (
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
