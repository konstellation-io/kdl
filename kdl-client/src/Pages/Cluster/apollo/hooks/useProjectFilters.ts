import { GET_PROJECT_FILTERS } from 'Graphql/client/queries/getProjectsFilters.graphql';
import { GetProjects_projects } from 'Graphql/queries/types/GetProjects';
import { ProjectState } from 'Pages/Cluster/pages/Cluster/components/ClusterInfo/components/ProjectStateIcon/ProjectStateIcon';
import { projectFilters } from './../cache';
import { useQuery } from '@apollo/client';

export type NewFilters = {
  name?: string;
  states?: ProjectState[];
};

function useProjectFilters() {
  // Makes sure cache is updated
  useQuery(GET_PROJECT_FILTERS);

  function updateFilters(newFilters: NewFilters) {
    const filters = projectFilters();

    projectFilters({
      ...filters,
      ...newFilters,
    });
  }

  function filterByState(project: GetProjects_projects) {
    const filters = projectFilters();

    if (filters.states.length === 0) return true;

    return (
      (filters.states.includes(ProjectState.ERROR) || !project.error) &&
      (filters.states.includes(ProjectState.STARTED) ||
        project.state !== ProjectState.STARTED) &&
      (filters.states.includes(ProjectState.STOPPED) ||
        project.state !== ProjectState.STOPPED) &&
      (filters.states.includes(ProjectState.NOT_FAVORITE) || project.favorite)
    );
  }

  function filterProjects(projects: GetProjects_projects[]) {
    const filters = projectFilters();

    let filteredProjects = projects
      .filter((project) => project.name.includes(filters.name))
      .filter(filterByState);

    projectFilters({
      ...filters,
      nFiltered: filteredProjects.length,
    });

    return filteredProjects;
  }

  return { updateFilters, filterProjects };
}

export default useProjectFilters;
