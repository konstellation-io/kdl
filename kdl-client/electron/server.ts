import store from '../store/store';
import { v4 } from 'uuid';

export type Server = {
  id: string;
  name: string;
  type: 'local' | 'remote';
  state: string;
  url: string;
  warning?: boolean;
}

type NewServer = {
  name: string;
  type: 'local' | 'remote';
  state: string;
  url?: string;
  warning?: boolean;
}

type UpdateFields = {
  state?: string;
  warning?: boolean;
};

export function updateServer(serverId: string, newFields: UpdateFields) {
  const servers = store.get('servers') as Server[];
  const serverIdx = servers.findIndex(c => c.id === serverId);

  if (serverIdx !== -1) {
    servers[serverIdx] = {
      ...servers[serverIdx],
      ...newFields
    };

    store.set('servers', servers);
  }
}

export function createServer(newServer: NewServer) {
  const serverId = v4();

  const servers = store.get('servers') as Server[];
  store.set('servers', [...servers, {
    ...newServer,
    id: serverId,
  }]);

  return serverId;
}
