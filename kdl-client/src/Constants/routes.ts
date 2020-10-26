enum ROUTE {
  HOME = '/',
  NEW_CLUSTER = '/new-cluster',
  CHECK_LOCAL_CLUSTER_REQUIREMENTS = '/check-local-cluster-requirements',
  INSTALL_LOCAL_CLUSTER = '/install-local-cluster',
  CONNECT_TO_REMOTE_CLUSTER = '/connect-to-remote-cluster',
  CLUSTER_LOGIN = '/cluster-login/:clusterId',
}

export type RouteClusterParams = {
  clusterId: string;
};

export const buildRoute = {
  cluster: (route: ROUTE, clusterId: string) =>
    route.replace(':clusterId', clusterId),
};

export default ROUTE;
