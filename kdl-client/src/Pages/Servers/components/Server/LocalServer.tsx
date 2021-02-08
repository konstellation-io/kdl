import Server, { ServerBaseProps } from './Server';

import React from 'react';
import useServers from 'Hooks/useServers';
import { ipcRenderer } from 'electron';

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

  // FIXME: pass the admin-ui url as arg in the send function
  const onOpenUrl = serverReady ? () => ipcRenderer.send('loadServer') : null;

  return <Server {...props} actions={actions} onOpenUrl={onOpenUrl} local />;
}

export default LocalServer;
