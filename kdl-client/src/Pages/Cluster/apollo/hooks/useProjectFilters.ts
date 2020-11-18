import { GetProjects_projects } from 'Graphql/queries/types/GetProjects';
import { ProjectFilters } from '../models/ProjectFilters';
import { ProjectState } from 'Pages/Cluster/pages/Cluster/components/ClusterInfo/components/ProjectStateIcon/ProjectStateIcon';
import { projectFilters } from './../cache';

export type NewFilters = {
  name?: string;
  states?: ProjectState[];
};

function useProjectFilters() {
  function updateFilters(newFilters: NewFilters) {
    const filters = projectFilters();

    projectFilters({
      ...filters,
      ...newFilters,
    });
  }

  function filterByState(
    project: GetProjects_projects,
    states: ProjectState[]
  ) {
    if (states.length === 0) return true;

    return (
      (states.includes(ProjectState.ERROR) || !project.error) &&
      (states.includes(ProjectState.STARTED) ||
        project.state !== ProjectState.STARTED) &&
      (states.includes(ProjectState.STOPPED) ||
        project.state !== ProjectState.STOPPED) &&
      (states.includes(ProjectState.NOT_FAVORITE) || project.favorite)
    );
  }

  function filterProjects(
    projects: GetProjects_projects[],
    filters: ProjectFilters
  ) {
    let filteredProjects = projects
      .filter((project) => project.name.includes(filters.name))
      .filter((project) => filterByState(project, filters.states));

    projectFilters({
      ...filters,
      nFiltered: filteredProjects.length,
    });

    return filteredProjects;
  }

  return { updateFilters, filterProjects };
}

export default useProjectFilters;
