import { Cluster } from 'Hooks/useClusters';
import { openedCluster } from './../cache';

function useOpenedCluster() {
  function updateOpenedCluster(newCluster: Cluster | null) {
    if (newCluster === null) {
      openedCluster(null);
    } else {
      openedCluster({
        url: '',
        ...newCluster,
      });
    }
  }

  return { updateOpenedCluster };
}

export default useOpenedCluster;
