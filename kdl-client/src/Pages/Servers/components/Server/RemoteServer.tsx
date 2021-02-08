import Server, { ServerBaseProps } from './Server';

import React from 'react';
import useServers from 'Hooks/useServers';
import { ipcRenderer } from 'electron';

export enum RemoteServerStates {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
}
export interface RemoteServerProps extends ServerBaseProps {
  state: RemoteServerStates;
  url?: string;
}
export function RemoteServer(props: RemoteServerProps) {
  const { getServerActions } = useServers();
  const actions = getServerActions(props.state, props.serverId);

  // FIXME: pass the admin-ui url as arg in the send function
  const onOpenUrl = () => ipcRenderer.send('loadServer');

  return <Server {...props} actions={actions} onOpenUrl={onOpenUrl} />;
}

export default RemoteServer;
