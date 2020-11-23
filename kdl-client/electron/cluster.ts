import store from '../store/store';
import { v4 } from 'uuid';

type Cluster = {
  id: string;
  name: string;
  type: 'local' | 'remote';
  state: string;
  url: string;
}

type NewCluster = {
  name: string;
  type: 'local' | 'remote';
  state: string;
  url?: string;
  warning?: boolean;
}

export function updateClusterState(clusterId: string, newState: string) {
  const clusters = store.get('clusters') as Cluster[];
  const cluster = clusters.find(c => c.id === clusterId);

  if (cluster) {
    cluster.state = newState;
    store.set('clusters', clusters);
  }
}

export function createCluster(newCluster: NewCluster) {
  const clusterId = v4();

  const clusters = store.get('clusters') as Cluster[];
  store.set('clusters', [...clusters, {
    ...newCluster,
    id: clusterId,
  }]);

  return clusterId;
}
