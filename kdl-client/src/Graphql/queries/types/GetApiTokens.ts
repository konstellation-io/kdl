/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetApiTokens
// ====================================================

export interface GetApiTokens_apiTokens {
  __typename: 'ApiToken';
  label: string;
  creationDate: string;
  lastUsedDate: string;
}

export interface GetApiTokens {
  apiTokens: GetApiTokens_apiTokens[];
}
