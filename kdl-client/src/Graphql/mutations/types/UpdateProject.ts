/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateProjectInput } from './../../types/globalTypes';

// ====================================================
// GraphQL mutation operation: UpdateProject
// ====================================================

export interface UpdateProject_updateProject {
  __typename: 'Project';
  id: string;
  name: string;
}

export interface UpdateProject {
  updateProject: UpdateProject_updateProject;
}

export interface UpdateProjectVariables {
  input: UpdateProjectInput;
}
