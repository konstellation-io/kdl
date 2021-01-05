import Card, { CardState } from 'Components/Layout/Card/Card';
import React, { FC } from 'react';

import { Button } from 'kwc';
import DroneImg from './img/drone.png';
import GiteaImg from './img/gitea.png';
import JupyterImg from './img/jupyter.png';
import MinioImg from './img/minio.png';
import MlFlowImg from './img/mlflow.png';
import ToolGroup from './ToolGroup';
import VSCodeImg from './img/vscode.png';
import styles from './Tools.module.scss';
import { useState } from 'react';

type ToolProps = {
  img: string;
  title: string;
  description: string;
};
const Tool: FC<ToolProps> = ({ img, title, description }) => (
  <div className={styles.cardContent}>
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
      <div style={{ marginTop: 32 }}>
        <Button label="TOGGLE ACTIVE" onClick={toggleActive} border />
      </div>
    </div>
  );
}

export default Tools;
