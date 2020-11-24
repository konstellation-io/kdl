import LocalCluster, { LocalClusterStates } from './LocalCluster';
import React, { FunctionComponent } from 'react';
import RemoteCluster, { RemoteClusterStates } from './RemoteCluster';

import ActionButton from './ActionButton';
import CopyToClipboard from 'Components/CopyToClipboard/CopyToClipboard';
import { Link } from 'react-router-dom';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import cx from 'classnames';
import styles from './Cluster.module.scss';

export type Action = {
  label: string;
  Icon: FunctionComponent<SvgIconProps>;
  onClick?: Function;
  to?: string;
};

export interface ClusterBaseProps {
  clusterId: string;
  name: string;
  actions: Action[];
}

type ClusterProps = {
  clusterId: string;
  name: string;
  url?: string;
  warning?: boolean;
  state: LocalClusterStates | RemoteClusterStates;
  local?: boolean;
  actions: Action[];
  onOpenUrl: string | null;
};
function Cluster({
  clusterId,
  name,
  url,
  warning,
  state,
  actions,
  local = false,
  onOpenUrl,
}: ClusterProps) {
  const cluster = (
    <div className={styles.container}>
      <div className={styles.bg}>
        <div className={styles.bgBand} />
      </div>
      <div
        className={cx(styles.label, styles[state], {
          [styles.noOffset]: local,
        })}
      >
        {state.replace('_', ' ')}
      </div>
      <div className={cx(styles.triangle, { [styles.down]: local })}>
        <div className={cx(styles.stateBorder, styles[state])} />
        <div className={cx(styles.state, styles[state])} />
      </div>
      <div className={styles.actions}>
        {warning && <p className={styles.warning}>WARNING</p>}
        {actions.map((action) => (
          <ActionButton {...action} key={action.label} />
        ))}
      </div>
      <div className={styles.nameSection}>
        <p className={styles.name}>{name}</p>
        {local && <div className={styles.localTag}>Local</div>}
      </div>
      {url && (
        <div className={styles.url}>
          <p className={styles.text} title={url}>
            {url}
          </p>
          <CopyToClipboard className={styles.copy}>{url}</CopyToClipboard>
        </div>
      )}
    </div>
  );

  return onOpenUrl === null ? (
    <div className={styles.cannotOpen}>{cluster}</div>
  ) : (
    <Link to={onOpenUrl}>{cluster}</Link>
  );
}

export { LocalCluster, RemoteCluster };
export default Cluster;
