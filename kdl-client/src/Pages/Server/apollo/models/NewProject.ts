import { RepositoryType } from 'Graphql/types/globalTypes';

export interface InformationValues {
  name: string;
  description: string;
}

export interface InformationErrors {
  description: string;
}

export interface RepositoryValues {
  type: RepositoryType | null;
  slug: string;
  url: string;
  skipTest: boolean;
}

export interface RepositoryErrors {
  slug: string;
  url: string;
  connection: string;
}

export interface NewProject_Information {
  values: InformationValues;
  errors: InformationErrors;
}

export interface NewProject_Repository {
  values: RepositoryValues;
  errors: RepositoryErrors;
}

export interface NewProject {
  information: NewProject_Information;
  repository: NewProject_Repository;
}
