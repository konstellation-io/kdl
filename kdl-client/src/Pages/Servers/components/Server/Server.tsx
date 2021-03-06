import LocalServer, { LocalServerStates } from './LocalServer';
import ROUTE, { buildServerRoute } from 'Constants/routes';
import React, { FunctionComponent } from 'react';
import RemoteServer, { RemoteServerStates } from './RemoteServer';

import ActionButton from './ActionButton';
import CopyToClipboard from 'Components/CopyToClipboard/CopyToClipboard';
import { Link } from 'react-router-dom';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import cx from 'classnames';
import styles from './Server.module.scss';

export type Action = {
  label: string;
  Icon: FunctionComponent<SvgIconProps>;
  onClick?: Function;
  to?: string;
};

export interface ServerBaseProps {
  serverId: string;
  name: string;
  actions: Action[];
}

type ServerProps = {
  serverId: string;
  name: string;
  url?: string;
  warning?: boolean;
  state: LocalServerStates | RemoteServerStates;
  local?: boolean;
  actions: Action[];
  canRedirect?: boolean;
};
function Server({
  serverId,
  name,
  url,
  warning,
  state,
  actions,
  local = false,
  canRedirect = true,
}: ServerProps) {
  const server = (
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

  return canRedirect ? (
    <Link to={buildServerRoute(ROUTE.SERVER, serverId)}>{server}</Link>
  ) : (
    <div className={styles.cannotOpen}>{server}</div>
  );
}

export { LocalServer, RemoteServer };
export default Server;
