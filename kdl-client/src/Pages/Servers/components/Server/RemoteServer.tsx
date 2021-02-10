import Server, { ServerBaseProps } from './Server';

import React from 'react';
import useServers from 'Hooks/useServers';

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

  return <Server {...props} actions={actions} />;
}

export default RemoteServer;
