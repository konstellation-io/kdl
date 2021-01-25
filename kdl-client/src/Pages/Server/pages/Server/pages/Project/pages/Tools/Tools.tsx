import { Button, HorizontalBar } from 'kwc';
import Card, { CardState } from 'Components/Layout/Card/Card';
import React, { FC, useEffect } from 'react';

import DroneImg from './img/drone.png';
import GiteaImg from './img/gitea.png';
import IconOk from '@material-ui/icons/Check';
import IconStart from '@material-ui/icons/PlayArrow';
import IconStop from '@material-ui/icons/Stop';
import IconWarn from '@material-ui/icons/Warning';
import JupyterImg from './img/jupyter.png';
import MinioImg from './img/minio.png';
import MlFlowImg from './img/mlflow.png';
import ToolGroup from './ToolGroup';
import VSCodeImg from './img/vscode.png';
import cx from 'classnames';
import styles from './Tools.module.scss';
import { useState } from 'react';
import useExternalBrowserWindows, {
  channelName,
} from './useExternalBrowserWindows';
import { useParams } from 'react-router-dom';
import { IpcMainEvent, remote } from 'electron';

export enum ToolTypes {
  GITEA,
  MINIO,
  JUPYTER,
  VSCODE,
  DRONE,
  MLFLOW,
}

type ToolProps = {
  img: string;
  title: string;
  description: string;
  disabled?: boolean;
  onClick?: () => void;
};

const Tool: FC<ToolProps> = ({
  img,
  title,
  description,
  disabled = false,
  onClick = () => {},
}) => (
  <div
    className={cx(styles.cardContent, { [styles.disabled]: disabled })}
    onClick={() => disabled && onClick()}
  >
    <div className={styles.imgContainer}>
      <img className={styles.toolImg} src={img} alt={`${title}_img`} />
    </div>
    <p className={styles.toolTitle}>{title}</p>
    <p className={styles.toolDescription}>{description}</p>
  </div>
);
const { ipcMain } = remote;

function Tools() {
  const { projectId } = useParams();
  const [active, setActive] = useState(false);
  const { openWindow } = useExternalBrowserWindows();
  function toggleActive() {
    setActive(!active);
  }

  const onMessage = (_: IpcMainEvent, args: any) => {
    console.log(`Message received on the main window: ${args}`);
  };

  useEffect(() => {
    ipcMain.on(channelName, onMessage);
    return () => {
      ipcMain.removeListener(channelName, onMessage);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.row}>
          <ToolGroup title="Code repository">
            <Card>
              <Tool
                onClick={() =>
                  openWindow(
                    'https://gitea.io/en-us/',
                    `${projectId}-${ToolTypes.GITEA}`,
                    GiteaImg
                  )
                }
                img={GiteaImg}
                title="Gitea"
                description="Nam dapibus nisl vitae elit fringilla."
              />
            </Card>
          </ToolGroup>
          <ToolGroup title="Storage">
            <Card>
              <Tool
                onClick={() =>
                  openWindow(
                    'https://min.io/',

                    `${projectId}-${ToolTypes.MINIO}`,
                    MinioImg
                  )
                }
                img={MinioImg}
                title="Minio"
                description="Nam dapibus nisl vitae elit fringilla."
              />
            </Card>
          </ToolGroup>
          <ToolGroup title="Analysis">
            <Card state={active ? CardState.OK : CardState.ALERT}>
              <Tool
                onClick={() =>
                  openWindow(
                    'https://jupyter.org/',

                    `${projectId}-${ToolTypes.JUPYTER}`,
                    JupyterImg
                  )
                }
                img={JupyterImg}
                title="Jupyter"
                description="Nam dapibus nisl vitae elit fringilla."
                disabled={!active}
              />
            </Card>
          </ToolGroup>
        </div>
        <div className={styles.row}>
          <ToolGroup title="Experiments">
            <div className={styles.multiCard}>
              <Card state={active ? CardState.OK : CardState.ALERT}>
                <Tool
                  onClick={() =>
                    openWindow(
                      'https://code.visualstudio.com/',

                      `${projectId}-${ToolTypes.VSCODE}`,
                      VSCodeImg
                    )
                  }
                  img={VSCodeImg}
                  title="VSCode"
                  description="Nam dapibus nisl vitae elit fringilla."
                  disabled={!active}
                />
              </Card>
              <Card>
                <Tool
                  onClick={() =>
                    openWindow(
                      'https://www.drone.io/',

                      `${projectId}-${ToolTypes.DRONE}`,
                      DroneImg
                    )
                  }
                  img={DroneImg}
                  title="Drone"
                  description="Nam dapibus nisl vitae elit fringilla."
                />
              </Card>
            </div>
          </ToolGroup>
          <ToolGroup title="Results">
            <Card>
              <Tool
                onClick={() =>
                  openWindow(
                    'https://mlflow.org/',

                    `${projectId}-${ToolTypes.MLFLOW}`,
                    MlFlowImg
                  )
                }
                img={MlFlowImg}
                title="MlFlow"
                description="Nam dapibus nisl vitae elit fringilla."
              />
            </Card>
          </ToolGroup>
        </div>
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
