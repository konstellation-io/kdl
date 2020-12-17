/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AccessLevel {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER',
}

export enum ProjectState {
  ARCHIVED = 'ARCHIVED',
  STARTED = 'STARTED',
  STOPPED = 'STOPPED',
}

export enum RepositoryType {
  EXTERNAL = 'EXTERNAL',
  INTERNAL = 'INTERNAL',
}

export interface AddUserInput {
  email: string;
  accessLevel: AccessLevel;
}

export interface RemoveUsersInput {
  userIds: string[];
}

export interface UpdateAccessLevelInput {
  userIds: string[];
  accessLevel: AccessLevel;
}

export interface UpdateProjectInput {
  id: string;
  name: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
