import { Button, ErrorMessage, SpinnerCircular } from 'kwc';
import React, { useEffect, useState } from 'react';

import { GetProjects } from 'Graphql/queries/types/GetProjects';
import Panel from 'Components/Layout/Panel/Panel';
import ProjectSettings from './components/ProjectSettings/ProjectSettings';
import { RouteProjectParams } from 'Constants/routes';
import { loader } from 'graphql.macro';
import styles from './Project.module.scss';
import useOpenedProject from 'Pages/Server/apollo/hooks/useOpenedProject';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

const GetProjectsQuery = loader('Graphql/queries/getProjects.graphql');

function Project() {
  const { projectId } = useParams<RouteProjectParams>();
  const { data, error, loading } = useQuery<GetProjects>(GetProjectsQuery);
  const [showSettings, setShowSettings] = useState(true);
  const { updateOpenedProject } = useOpenedProject();

  useEffect(() => {
    // const openedProject = data?.projects.find(p => p.id === projectId);
    // FIXME: uncomment prev line and remove next line
    const openedProject = data?.projects[0];

    openedProject && updateOpenedProject(openedProject);
  }, [data, projectId, updateOpenedProject]);

  useEffect(
    () => () => updateOpenedProject(null),
    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (loading) return <SpinnerCircular />;
  if (error || !data) return <ErrorMessage />;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        Project Page
        <Button label="toggle" onClick={() => setShowSettings(!showSettings)} />
      </div>
      <Panel
        title="Settings"
        show={showSettings}
        close={() => setShowSettings(false)}
      >
        <ProjectSettings />
      </Panel>
    </div>
  );
}

export default Project;
