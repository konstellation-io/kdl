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

  return (
    <Server {...props} actions={actions} canRedirect={serverReady} local />
  );
}

export default LocalServer;
