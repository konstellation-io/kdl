import AddServer from '../Server/AddServer';
import { Button } from 'kwc';
import IconAdd from '@material-ui/icons/Add';
import React from 'react';
import { Server } from 'Hooks/useServers';
import styles from './ServersSection.module.scss';

type Props = {
  title: string;
  subtitle: string;
  servers: Server[];
  ServerComponent: React.FC<any>;
  addServerRoute?: string;
};
function ServersSection({
  title,
  subtitle,
  servers,
  ServerComponent,
  addServerRoute,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <p className={styles.title}>{title}</p>
        {addServerRoute && (
          <Button
            label="ADD SERVER"
            Icon={IconAdd}
            className={styles.action}
            to={addServerRoute}
          />
        )}
      </div>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={styles.servers}>
        {servers.map((server) => (
          <ServerComponent {...server} key={server.id} serverId={server.id} />
        ))}
        {addServerRoute && <AddServer label="ADD SERVER" to={addServerRoute} />}
      </div>
    </div>
  );
}

export default ServersSection;
