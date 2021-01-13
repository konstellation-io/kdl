import { Button, Left, Right, SearchSelect, SearchSelectTheme } from 'kwc';
import useServers, { ServerType } from 'Hooks/useServers';

import IconAdd from '@material-ui/icons/Add';
import ROUTE from 'Constants/routes';
import React from 'react';
import styles from './ServersBar.module.scss';

type Props = {
  nServers: number;
  setValue: Function;
};
function ServersBar({ nServers, setValue }: Props) {
  const { servers } = useServers();
  const hasLocalServer = !!servers.find((c) => c.type === ServerType.LOCAL);
  const addServerRoute = hasLocalServer
    ? ROUTE.CONNECT_TO_REMOTE_SERVER
    : ROUTE.NEW_SERVER;

  return (
    <div className={styles.container}>
      <Left>
        <SearchSelect
          label=""
          options={[]}
          onChange={(value: string) => setValue('serverSearch', value)}
          className={styles.formSearch}
          placeholder="Search"
          theme={SearchSelectTheme.TRANSPARENT}
          showSearchIcon
          hideError
          hideLabel
        />
      </Left>
      <Right className={styles.right}>
        <p className={styles.nServers}>{`${nServers} servers shown`}</p>
        <Button label="ADD SERVER" Icon={IconAdd} to={addServerRoute} />
      </Right>
    </div>
  );
}

export default ServersBar;
