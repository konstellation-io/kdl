import {
  GET_OPENED_PROJECT,
  GetOpenedProject,
} from 'Graphql/client/queries/getOpenedProject.graphql';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { ErrorMessage } from 'kwc';
import ProjectInfo from '../ProjectInfo/ProjectInfo';
import React from 'react';
import TabGit from '../TabGit/TabGit';
import TabInfo from '../TabInfo/TabInfo';
import cx from 'classnames';
import styles from './ProjectSettings.module.scss';
import { useQuery } from '@apollo/client';

type Props = {
  showRepoEdit: () => void;
};
function ProjectSettings({ showRepoEdit }: Props) {
  const { data: localData } = useQuery<GetOpenedProject>(GET_OPENED_PROJECT);
  const openedProject = localData?.openedProject;

  if (!openedProject || !openedProject.repository) return <ErrorMessage />;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <ProjectInfo project={openedProject} />
      </div>
      <Tabs defaultIndex={1}>
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
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </div>
      </Tabs>
    </div>
  );
}

export default ProjectSettings;
