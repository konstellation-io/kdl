const store = require('../store/store');
const { v4 } = require('uuid');

function updateClusterState(clusterId, newState) {
  const clusters = store.get('clusters');
  const cluster = clusters.find(c => c.id === clusterId);
  cluster.state = newState;

  store.set('clusters', clusters);
}

function createCluster(newCluster) {
  const clusterId = v4();

  const clusters = store.get('clusters');
  store.set('clusters', [...clusters, {
    ...newCluster,
    id: clusterId,
  }]);

  return clusterId;
}

module.exports = {
  updateClusterState,
  createCluster
};
