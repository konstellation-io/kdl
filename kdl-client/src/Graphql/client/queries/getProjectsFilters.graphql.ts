import { ProjectFilters } from './../../../Pages/Cluster/apollo/models/ProjectFilters';
import { gql } from '@apollo/client';

export interface GetProjectFilters {
  projectFilters: ProjectFilters;
}

export const GET_PROJECT_FILTERS = gql`
  {
    projectFilters @client {
      name
      states
      nFiltered
    }
  }
`;
