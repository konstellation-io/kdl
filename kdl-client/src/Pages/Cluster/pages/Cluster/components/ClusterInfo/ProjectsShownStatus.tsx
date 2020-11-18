import { ErrorMessage, SpinnerCircular } from 'kwc';
import {
  GET_PROJECT_FILTERS,
  GetProjectFilters,
} from 'Graphql/client/queries/getProjectsFilters.graphql';

import { GetProjects } from 'Graphql/queries/types/GetProjects';
import React from 'react';
import { loader } from 'graphql.macro';
import styles from './ClusterInfo.module.scss';
import useProjectFilters from 'Pages/Cluster/apollo/hooks/useProjectFilters';
import { useQuery } from '@apollo/client';

const GetProjectsQuery = loader('Graphql/queries/getProjects.graphql');

function ProjectsShownStatus() {
  const { data, error, loading } = useQuery<GetProjects>(GetProjectsQuery);
  const { data: projectFiltersData } = useQuery<GetProjectFilters>(
    GET_PROJECT_FILTERS
  );
  const { filterProjects } = useProjectFilters();

  if (loading) return <SpinnerCircular />;
  if (error || !data || !projectFiltersData) return <ErrorMessage />;

  const filters = projectFiltersData.projectFilters;
  const projects = filterProjects(data.projects, filters);

  const projectsOk = projects.filter((p) => !p.error).length;
  const projectsError = projects.length - projectsOk;

  return (
    <div className={styles.projectsShownStatus}>
      <div className={styles.ok}>
        <span className={styles.nStateProjects}>{projectsOk}</span>
        <span>ok</span>
      </div>
      <div className={styles.error}>
        <span className={styles.nStateProjects}>{projectsError}</span>
        <span>error</span>
      </div>
    </div>
  );
}

export default ProjectsShownStatus;
