import {
  GET_OPENED_PROJECT,
  GetOpenedProject,
} from 'Graphql/client/queries/getOpenedProject.graphql';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { ErrorMessage } from 'kwc';
import { GetProjectMembers_project_members } from 'Graphql/queries/types/GetProjectMembers';
import ProjectInfo from '../ProjectInfo/ProjectInfo';
import React from 'react';
import TabDangerZone from '../TabDangerZone/TabDangerZone';
import TabGit from '../TabGit/TabGit';
import TabInfo from '../TabInfo/TabInfo';
import TabMembers from '../TabMembers/TabMembers';
import cx from 'classnames';
import styles from './ProjectSettings.module.scss';
import { useQuery } from '@apollo/client';

type Props = {
  showRepoEdit: () => void;
  openMemberDetails: (member: GetProjectMembers_project_members | null) => void;
  memberDetails: GetProjectMembers_project_members | null;
  settingsOpenedTab: number;
  setSettingsOpenedTab: (index: number) => void;
};
function ProjectSettings({
  showRepoEdit,
  openMemberDetails,
  memberDetails,
  settingsOpenedTab,
  setSettingsOpenedTab,
}: Props) {
  const { data: localData } = useQuery<GetOpenedProject>(GET_OPENED_PROJECT);
  const openedProject = localData?.openedProject;

  if (!openedProject || !openedProject.repository) return <ErrorMessage />;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <ProjectInfo project={openedProject} />
      </div>
      <Tabs onSelect={setSettingsOpenedTab} selectedIndex={settingsOpenedTab}>
        <TabList>
          <Tab>INFO</Tab>
          <Tab>GIT</Tab>
          <Tab>MEMBERS</Tab>
          <Tab className={cx('react-tabs__tab', 'danger-tab')}>DANGER ZONE</Tab>
        </TabList>

        <div className={styles.tabContent}>
          <TabPanel>
            <TabInfo project={openedProject} />
          </TabPanel>
          <TabPanel>
            <TabGit
              repository={openedProject.repository}
              showRepoEdit={showRepoEdit}
            />
          </TabPanel>
          <TabPanel>
            <TabMembers
              projectId={openedProject.id}
              openMemberDetails={openMemberDetails}
              memberDetails={memberDetails}
            />
          </TabPanel>
          <TabPanel>
            <TabDangerZone />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
}

export default ProjectSettings;
