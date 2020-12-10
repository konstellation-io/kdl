/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegenerateSSHKey
// ====================================================

export interface RegenerateSSHKey_regenerateSSHKey {
  __typename: 'SSHKey';
  public: string;
  private: string;
  creationDate: string;
  lastActivity: string | null;
}

export interface RegenerateSSHKey {
  regenerateSSHKey: RegenerateSSHKey_regenerateSSHKey;
}
