import { Button, HorizontalBar } from 'kwc';
import Card, { CardState } from 'Components/Layout/Card/Card';
import React, { FC } from 'react';

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

type ToolProps = {
  img: string;
  title: string;
  description: string;
  disabled?: boolean;
};
const Tool: FC<ToolProps> = ({ img, title, description, disabled = false }) => (
  <div className={cx(styles.cardContent, { [styles.disabled]: disabled })}>
    <div className={styles.imgContainer}>
      <img className={styles.toolImg} src={img} alt={`${title}_img`} />
    </div>
    <p className={styles.toolTitle}>{title}</p>
    <p className={styles.toolDescription}>{description}</p>
  </div>
);

function Tools() {
  const [active, setActive] = useState(false);
  function toggleActive() {
    setActive(!active);
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.row}>
          <ToolGroup title="Code repository">
            <Card>
              <Tool
                img={GiteaImg}
                title="Gitea"
                description="Nam dapibus nisl vitae elit fringilla."
              />
            </Card>
          </ToolGroup>
          <ToolGroup title="Storage">
            <Card>
              <Tool
                img={MinioImg}
                title="Minio"
                description="Nam dapibus nisl vitae elit fringilla."
              />
            </Card>
          </ToolGroup>
          <ToolGroup title="Analysis">
            <Card state={active ? CardState.OK : CardState.ALERT}>
              <Tool
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
                  img={VSCodeImg}
                  title="VSCode"
                  description="Nam dapibus nisl vitae elit fringilla."
                  disabled={!active}
                />
              </Card>
              <Card>
                <Tool
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
