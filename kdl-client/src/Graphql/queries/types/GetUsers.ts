/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AccessLevel } from './../../types/globalTypes';

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_users {
  __typename: 'User';
  id: string;
  email: string;
  creationDate: string;
  accessLevel: AccessLevel;
  lastActivity: string | null;
}

export interface GetUsers {
  users: GetUsers_users[];
}
