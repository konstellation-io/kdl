import { Button, ErrorMessage, HorizontalBar, SpinnerCircular } from 'kwc';
import Card, { CardState } from 'Components/Layout/Card/Card';
import React, { useEffect } from 'react';

import IconOk from '@material-ui/icons/Check';
import IconStart from '@material-ui/icons/PlayArrow';
import IconStop from '@material-ui/icons/Stop';
import IconWarn from '@material-ui/icons/Warning';
import ToolGroup from './ToolGroup';
import cx from 'classnames';
import styles from './Tools.module.scss';
import { useState } from 'react';
import useExternalBrowserWindows, {
  channelName,
} from './useExternalBrowserWindows';
import { useParams } from 'react-router-dom';
import { IpcMainEvent, remote } from 'electron';
import { RouteProjectParams } from '../../../../../../../../Constants/routes';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import {
  GetProjectTools,
  GetProjectToolsVariables,
} from 'Graphql/queries/types/GetProjectTools';
import { EnhancedTool, EnhancedToolGroups } from './config';
import Tool from './components/Tool/Tool';
import { mapTools } from './mappingFunctions';

const { ipcMain } = remote;
const GetProjectToolsQuery = loader('Graphql/queries/getProjectTools.graphql');

function Tools() {
  const { projectId } = useParams<RouteProjectParams>();
  const [active, setActive] = useState(false);
  const { data, loading, error } = useQuery<
    GetProjectTools,
    GetProjectToolsVariables
  >(GetProjectToolsQuery, {
    variables: { id: projectId },
  });
  const { openWindow } = useExternalBrowserWindows();
  function toggleActive() {
    setActive(!active);
  }

  function handleToolClick({ url, toolName, img }: EnhancedTool) {
    openWindow(url, `${projectId}-${toolName}`, img);
  }

  const onMessage = (event: IpcMainEvent, args: any) => {
    console.log(`Message received on the main window: ${args}`);
  };

  useEffect(() => {
    ipcMain.on(channelName, onMessage);
    return () => {
      ipcMain.removeListener(channelName, onMessage);
    };
  }, []);

  function renderCard(tool: EnhancedTool) {
    return (
      <Card
        key={tool.title}
        state={tool.isUserLocalTool || active ? CardState.OK : CardState.ALERT}
      >
        <Tool
          {...tool}
          onClick={() => handleToolClick(tool)}
          disabled={!tool.isUserLocalTool && !active}
        />
      </Card>
    );
  }

  function renderGroup({ title, tools: toolsCards }: EnhancedToolGroups) {
    return (
      <ToolGroup title={title} key={title}>
        <div className={styles.multiCard}>{toolsCards.map(renderCard)}</div>
      </ToolGroup>
    );
  }

  if (!data || loading) return <SpinnerCircular />;
  if (error) return <ErrorMessage />;

  const {
    project: { tools: projectTools, areToolsActive },
  } = data;

  const tools = mapTools(projectTools);
  const firstRow = tools.filter(({ row }) => row === 0);
  const secondRow = tools.filter(({ row }) => row === 1);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.row}>{firstRow.map(renderGroup)}</div>
        <div className={styles.row}>{secondRow.map(renderGroup)}</div>
      </div>
      <HorizontalBar className={styles.actions}>
        <div className={styles.actionsContent}>
          <div className={styles.left}>
            <div
              className={cx(styles.toolsStatus, { [styles.active]: active })}
            >
              {(() => {
                const Icon = active ? IconOk : IconWarn;
                return <Icon className="icon-regular" />;
              })()}
              <span>
                {`YOUR PRIVATE TOOLS ARE ${active ? 'RUNNING' : 'STOPPED'}`}
              </span>
            </div>
          </div>
          <div className={styles.right}>
            <span className={styles.actionMessage}>{`TO ${
              active ? 'STOP' : 'START'
            } YOUR PRIVATE TOOLS, JUST`}</span>
            <Button
              label={active ? 'STOP' : 'START'}
              onClick={toggleActive}
              Icon={active ? IconStop : IconStart}
              height={30}
              primary
            />
          </div>
        </div>
      </HorizontalBar>
    </div>
  );
}

export default Tools;
