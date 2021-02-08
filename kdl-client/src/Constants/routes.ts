enum ROUTE {
  HOME = '/',
  NEW_SERVER = '/new-server',
  CHECK_LOCAL_SERVER_REQUIREMENTS = '/check-local-server-requirements',
  INSTALL_LOCAL_SERVER = '/install-local-server',
  CONNECT_TO_REMOTE_SERVER = '/connect-to-remote-server',
}

export type RouteServerParams = {
  serverId: string;
};

export type RouteProjectParams = {
  serverId: string;
  projectId: string;
};

export default ROUTE;
