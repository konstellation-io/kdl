import Panel, { PANEL_SIZE } from 'Components/Layout/Panel/Panel';
import React, { useEffect, useState } from 'react';

import { GetProjectMembers_project_members } from 'Graphql/queries/types/GetProjectMembers';
import { GetProjects_projects } from 'Graphql/queries/types/GetProjects';
import MemberDetails from './components/MemberDetails/MemberDetails';
import ProjectSettings from './components/ProjectSettings/ProjectSettings';
import UpdateRepository from './components/UpdateRepository/UpdateRepository';
import styles from './Project.module.scss';
import useBoolState from 'Hooks/useBoolState';

type Props = {
  openedProject: GetProjects_projects;
  hideSettings: () => void;
  isSettingsShown: boolean;
};
function ProjectPanels({
  openedProject,
  hideSettings,
  isSettingsShown,
}: Props) {
  const {
    value: isRepoEditShown,
    activate: showRepoEdit,
    deactivate: hideRepoEdit,
  } = useBoolState(false);

  const [
    memberDetails,
    setMemberDetails,
  ] = useState<GetProjectMembers_project_members | null>(null);

  // Stores last opened tab inside project settings panel. When you reopen
  // this panel, last opened tab will remain opened.
  const [settingsOpenedTab, setSettingsOpenedTab] = useState(0);

  // When closing settings, close all panels
  useEffect(() => {
    if (!isSettingsShown) {
      hideSettings();
      hideRepoEdit();
      setMemberDetails(null);
    }
  }, [isSettingsShown, hideRepoEdit, hideSettings]);

  // Only one secondary panel can be opened at a time
  function onOpenRepoEdit() {
    setMemberDetails(null);
    showRepoEdit();
  }
  function onSetMemberDetails(value: GetProjectMembers_project_members | null) {
    setMemberDetails(value);
    hideRepoEdit();
  }

  return (
    <div className={styles.panels}>
      <Panel
        title="Settings"
        show={isSettingsShown}
        close={hideSettings}
        noShrink
      >
        <ProjectSettings
          showRepoEdit={onOpenRepoEdit}
          openMemberDetails={onSetMemberDetails}
          memberDetails={memberDetails}
          settingsOpenedTab={settingsOpenedTab}
          setSettingsOpenedTab={setSettingsOpenedTab}
        />
      </Panel>
      <Panel
        title="Edit Repository Information"
        show={isRepoEditShown}
        close={hideRepoEdit}
        size={PANEL_SIZE.BIG}
        dark
      >
        <UpdateRepository project={openedProject} close={hideRepoEdit} />
      </Panel>
      <Panel
        title="Member details"
        show={memberDetails !== null}
        close={() => setMemberDetails(null)}
        noShrink
        dark
      >
        {memberDetails && (
          <MemberDetails
            member={memberDetails}
            close={() => setMemberDetails(null)}
            projectId={openedProject.id}
          />
        )}
      </Panel>
    </div>
  );
}

export default ProjectPanels;
