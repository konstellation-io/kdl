import { StoreKey, StoreUpdate } from 'types/store';
import { useEffect, useState } from 'react';

import { ipcRenderer } from 'electron';

export type Workspace = {
  project: {
    navigationOpened: boolean;
  };
};

function useWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function onStoreUpdate(_: unknown, { key, value }: StoreUpdate) {
      if (key === StoreKey.WORKSPACE) {
        setWorkspace(value);
      }
    }

    ipcRenderer.send('subscribeToValue', StoreKey.WORKSPACE);
    ipcRenderer.on('subscribeToValueReply', onStoreUpdate);

    async function fetchData() {
      const storeWorkspace = await ipcRenderer.invoke(
        'getStoreValue',
        StoreKey.WORKSPACE
      );
      setWorkspace(storeWorkspace);
      setLoading(false);
    }
    fetchData();

    return () => {
      ipcRenderer.removeListener('subscribeToValueReply', onStoreUpdate);
    };
  }, []);

  function toggleProjectNavOpened() {
    if (workspace) {
      ipcRenderer.send('setStoreValue', {
        key: 'workspace.project.navigationOpened',
        value: !workspace.project.navigationOpened,
      });
    }
  }

  return {
    workspace,
    toggleProjectNavOpened,
    loading,
  };
}

export default useWorkspace;
