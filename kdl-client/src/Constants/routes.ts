enum ROUTE {
  HOME = '/',
  NEW_SERVER = '/new-server',
  CHECK_LOCAL_SERVER_REQUIREMENTS = '/check-local-server-requirements',
  INSTALL_LOCAL_SERVER = '/install-local-server',
  CONNECT_TO_REMOTE_SERVER = '/connect-to-remote-server',
  SERVER_LOGIN = '/server-login/:serverId',
  SERVER = '/server/:serverId',
  SERVER_USERS = '/server/:serverId/users',
  NEW_SERVER_USER = '/server/:serverId/new-user',
  NEW_PROJECT = '/server/:serverId/new-project',
  PROJECT = '/server/:serverId/project/:projectId',
}

export type RouteServerParams = {
  serverId: string;
};

export const buildRoute = {
  server: (route: ROUTE, serverId: string) =>
    route.replace(':serverId', serverId),
  project: (route: ROUTE, serverId: string, projectId: string) =>
    buildRoute.server(route, serverId).replace(':projectId', projectId),
};

export default ROUTE;
