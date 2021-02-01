import { Server } from 'Hooks/useServers';
import { openedServer } from './../cache';

function useOpenedServer() {
  function updateOpenedServer(newServer: Server | null) {
    if (newServer === null) {
      openedServer(null);
    } else {
      openedServer({
        url: '',
        ...newServer,
      });
    }
  }

  return { updateOpenedServer };
}

export default useOpenedServer;
