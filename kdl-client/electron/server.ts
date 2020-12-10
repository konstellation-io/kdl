import store from '../store/store';
import { v4 } from 'uuid';

type Server = {
  id: string;
  name: string;
  type: 'local' | 'remote';
  state: string;
  url: string;
}

type NewServer = {
  name: string;
  type: 'local' | 'remote';
  state: string;
  url?: string;
  warning?: boolean;
}

export function updateServerState(serverId: string, newState: string) {
  const servers = store.get('servers') as Server[];
  const server = servers.find(c => c.id === serverId);

  if (server) {
    server.state = newState;
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
