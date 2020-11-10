import { ErrorMessage, SpinnerCircular } from 'kwc';

import AddProject from './components/Project/AddProject';
import { GetProjects } from 'Graphql/queries/types/GetProjects';
import Project from './components/Project/Project';
import React from 'react';
import { loader } from 'graphql.macro';
import styles from './Projects.module.scss';
import useProjectFilters from 'Pages/Cluster/apollo/hooks/useProjectFilters';
import { useQuery } from '@apollo/client';

const GetProjectsQuery = loader('Graphql/queries/getProjects.graphql');
function Projects() {
  const { data, error, loading } = useQuery<GetProjects>(GetProjectsQuery);
  const { filterProjects } = useProjectFilters();

  if (loading) return <SpinnerCircular />;
  if (error || !data) return <ErrorMessage />;

  const projects = filterProjects(data.projects);

  return (
    <div className={styles.container}>
      {[
        ...projects.map((project) => (
          <Project key={project.id} project={project} />
        )),
        <AddProject key="add-project" />,
      ]}
    </div>
  );
}

export default Projects;
