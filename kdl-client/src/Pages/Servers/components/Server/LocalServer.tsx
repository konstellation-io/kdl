import ROUTE, { buildRoute } from 'Constants/routes';
import Server, { ServerBaseProps } from './Server';

import React from 'react';
import useServers from 'Hooks/useServers';

export enum LocalServerStates {
  STARTED = 'STARTED',
  STOPPED = 'STOPPED',
  STARTING = 'STARTING',
  STOPPING = 'STOPPING',
}

export interface LocalServerProps extends ServerBaseProps {
  state: LocalServerStates;
}
export function LocalServer(props: LocalServerProps) {
  const { getServerActions } = useServers();
  const actions = getServerActions(props.state, props.serverId);

  const serverReady = props.state === LocalServerStates.STARTED;
  const onOpenUrl = serverReady
    ? buildRoute.server(ROUTE.SERVER, props.serverId)
    : null;

  return <Server {...props} actions={actions} onOpenUrl={onOpenUrl} local />;
}

export default LocalServer;
