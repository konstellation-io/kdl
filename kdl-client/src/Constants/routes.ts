enum ROUTE {
  HOME = '/',
  NEW_SERVER = '/new-server',
  CHECK_LOCAL_SERVER_REQUIREMENTS = '/check-local-server-requirements',
  INSTALL_LOCAL_SERVER = '/install-local-server',
  CONNECT_TO_REMOTE_SERVER = '/connect-to-remote-server',
  SERVER_LOGIN = '/server-login/:serverId',
  SERVER = '/server/:serverId',
  SERVER_USERS = '/server/:serverId/users',
  USER_SSH_KEY = '/server/:serverId/user/ssh-key',
  USER_API_TOKENS = '/server/:serverId/user/api-tokens',
  NEW_SERVER_USER = '/server/:serverId/new-user',
  NEW_PROJECT = '/server/:serverId/new-project',
  PROJECT = '/server/:serverId/project/:projectId',
  CREATION_PROJECT = '/server/:serverId/new-project/create',
}

export type RouteServerParams = {
  serverId: string;
};

export type RouteProjectParams = {
  serverId: string;
  projectId: string;
};

export const buildRoute = {
  server: (route: ROUTE, serverId: string) =>
    route.replace(':serverId', serverId),
  project: (route: ROUTE, serverId: string, projectId: string) =>
    buildRoute.server(route, serverId).replace(':projectId', projectId),
};

export default ROUTE;
