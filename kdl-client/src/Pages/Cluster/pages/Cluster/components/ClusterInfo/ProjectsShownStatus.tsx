import { ErrorMessage, SpinnerCircular } from 'kwc';

import { GetProjects } from 'Graphql/queries/types/GetProjects';
import React from 'react';
import { loader } from 'graphql.macro';
import styles from './ClusterInfo.module.scss';
import useProjectFilters from 'Pages/Cluster/apollo/hooks/useProjectFilters';
import { useQuery } from '@apollo/client';

const GetProjectsQuery = loader('Graphql/queries/getProjects.graphql');

function ProjectsShownStatus() {
  const { data, error, loading } = useQuery<GetProjects>(GetProjectsQuery);
  const { filterProjects } = useProjectFilters();

  if (loading) return <SpinnerCircular />;
  if (error || !data) return <ErrorMessage />;

  const projects = filterProjects(data.projects);

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
