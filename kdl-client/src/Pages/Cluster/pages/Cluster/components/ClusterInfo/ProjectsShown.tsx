import {
  ErrorMessage,
  MultiSelect,
  MultiSelectOption,
  SpinnerCircular,
} from 'kwc';
import {
  GET_PROJECT_FILTERS,
  GetProjectFilters,
} from 'Graphql/client/queries/getProjectsFilters.graphql';
import ProjectStateIcon, {
  ProjectState,
} from './components/ProjectStateIcon/ProjectStateIcon';

import { GetProjects } from 'Graphql/queries/types/GetProjects';
import React from 'react';
import { loader } from 'graphql.macro';
import styles from './ClusterInfo.module.scss';
import useProjectFilters from 'Pages/Cluster/apollo/hooks/useProjectFilters';
import { useQuery } from '@apollo/client';

const GetProjectsQuery = loader('Graphql/queries/getProjects.graphql');

const projectStatesOrdered = [
  ProjectState.ERROR,
  ProjectState.STOPPED,
  ProjectState.STARTED,
  ProjectState.ARCHIVED,
  ProjectState.NOT_FAVORITE,
];

function ProjectsShown() {
  const { data, error, loading } = useQuery<GetProjects>(GetProjectsQuery);
  const { data: localData } = useQuery<GetProjectFilters>(GET_PROJECT_FILTERS);
  const { updateFilters } = useProjectFilters();

  const filters = localData?.projectFilters;

  if (loading) return <SpinnerCircular />;
  if (error || !data) return <ErrorMessage />;

  const projectStatesOptions = projectStatesOrdered.map(
    (state: ProjectState) =>
      ({
        label: state,
        Icon: <ProjectStateIcon state={state} />,
      } as MultiSelectOption<ProjectState>)
  );

  function onStateSelection(newStates: ProjectState[]) {
    updateFilters({ states: newStates });
  }

  return (
    <div className={styles.projectsShown}>
      <span className={styles.nProjects}>{filters?.nFiltered || 0}</span>
      <span>PROJECTS SHOWN</span>
      <MultiSelect<ProjectState>
        onChange={onStateSelection}
        label=""
        hideError
        placeholder="ALL PROJECTS"
        selectionUnit="STATE"
        selectAllText="ALL PROJECTS"
        options={projectStatesOptions}
        formSelectedOptions={filters?.states || []}
        className={styles.formProjectStates}
      />
    </div>
  );
}

export default ProjectsShown;
