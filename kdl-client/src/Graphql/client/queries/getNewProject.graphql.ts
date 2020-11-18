import { RepositoryType } from './../../types/globalTypes';
import { gql } from '@apollo/client';

export interface GetNewProject_newProject_repository_errors {
  slug: string;
  url: string;
  connection: string;
}

export interface GetNewProject_newProject_repository_values {
  type: RepositoryType | null;
  slug: string;
  url: string;
  skipTest: boolean;
}

export interface GetNewProject_newProject_repository {
  values: GetNewProject_newProject_repository_values;
  errors: GetNewProject_newProject_repository_errors;
}

export interface GetNewProject_newProject_information_errors {
  name: string;
  description: string;
}

export interface GetNewProject_newProject_information_values {
  name: string;
  description: string;
}

export interface GetNewProject_newProject_information {
  values: GetNewProject_newProject_information_values;
  errors: GetNewProject_newProject_information_errors;
}

export interface GetNewProject_newProject {
  information: GetNewProject_newProject_information;
  repository: GetNewProject_newProject_repository;
}

export interface GetNewProject {
  newProject: GetNewProject_newProject;
}

export const GET_NEW_PROJECT = gql`
  {
    newProject @client {
      information {
        values {
          name
          description
        }
        errors {
          description
        }
      }
      repository {
        values {
          type
          slug
          url
          skipTest
        }
        errors {
          slug
          url
          connection
        }
      }
    }
  }
`;
