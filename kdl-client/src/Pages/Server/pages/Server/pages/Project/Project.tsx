import { Button, ErrorMessage, SpinnerCircular } from 'kwc';
import Panel, { PANEL_SIZE } from 'Components/Layout/Panel/Panel';
import React, { useEffect, useState } from 'react';

import { GetProjectMembers_project_members } from 'Graphql/queries/types/GetProjectMembers';
import { GetProjects } from 'Graphql/queries/types/GetProjects';
import MemberDetails from './components/MemberDetails/MemberDetails';
import ProjectSettings from './components/ProjectSettings/ProjectSettings';
import { RouteProjectParams } from 'Constants/routes';
import UpdateRepository from './components/UpdateRepository/UpdateRepository';
import { loader } from 'graphql.macro';
import styles from './Project.module.scss';
import useBoolState from 'Hooks/useBoolState';
import useOpenedProject from 'Pages/Server/apollo/hooks/useOpenedProject';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

const GetProjectsQuery = loader('Graphql/queries/getProjects.graphql');

function Project() {
  const { projectId } = useParams<RouteProjectParams>();
  const { data, error, loading } = useQuery<GetProjects>(GetProjectsQuery);
  const { updateOpenedProject } = useOpenedProject();

  const {
    value: isSettingsShown,
    toggle: toggleSettings,
    deactivate: hideSettings,
  } = useBoolState(true);

  const {
    value: isRepoEditShown,
    activate: showRepoEdit,
    deactivate: hideRepoEdit,
  } = useBoolState(false);

  const [
    memberDetails,
    setMemberDetails,
  ] = useState<GetProjectMembers_project_members | null>(null);

  function closeAll() {
    hideSettings();
    hideRepoEdit();
  }

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

  // FIXME: get real openedProject
  const project = data.projects[0];

  return (
    <div className={styles.container}>
      <div className={styles.panels}>
        <Panel
          title="Settings"
          show={isSettingsShown}
          close={closeAll}
          noShrink
        >
          <ProjectSettings
            showRepoEdit={showRepoEdit}
            openMemberDetails={setMemberDetails}
            memberDetails={memberDetails}
          />
        </Panel>
        <Panel
          title="Edit Repository Information"
          show={isRepoEditShown}
          close={hideRepoEdit}
          size={PANEL_SIZE.BIG}
          dark
        >
          <UpdateRepository project={project} close={hideRepoEdit} />
        </Panel>
        <Panel
          title="Member details"
          show={memberDetails !== null}
          close={() => setMemberDetails(null)}
          noShrink
          dark
        >
          {memberDetails === null ? (
            <></>
          ) : (
            <MemberDetails
              member={memberDetails}
              close={() => setMemberDetails(null)}
              projectId={project.id}
            />
          )}
        </Panel>
      </div>
      <div className={styles.content}>
        Project Page
        <Button label="toggle" onClick={toggleSettings} />
      </div>
    </div>
  );
}

export default Project;
