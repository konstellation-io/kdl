import { InMemoryCache, makeVar } from '@apollo/client';
import {
  ProjectFilters,
  ProjectOrder,
  ProjectSelection,
} from './models/ProjectFilters';

import { Cluster } from 'Hooks/useClusters';
import { NewProject } from './models/NewProject';

export const initialProjectFilters: ProjectFilters = {
  name: '',
  selection: ProjectSelection.ACTIVE,
  order: ProjectOrder.AZ,
  nFiltered: 0,
};

export const initialNewProject: NewProject = {
  information: {
    values: { name: '', description: '' },
    errors: {
      name: 'This field is mandatory, please fill it.',
      description: 'Please, write a description is important for the project.',
    },
  },
  repository: {
    values: {
      type: null,
    },
    errors: { type: 'Please choose a repo type' },
  },
  externalRepository: {
    values: {
      url: '',
      isConnectionTested: false,
      hasConnectionError: '',
      warning: false,
    },
    errors: {
      url: '',
      warning: 'not accepted',
    },
  },
  internalRepository: {
    values: { slug: '', url: '' },
    errors: { slug: '' },
  },
};

export const projectFilters = makeVar(initialProjectFilters);
export const newProject = makeVar(initialNewProject);
export const openedCluster = makeVar<Cluster | null>(null);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        projectFilters: { read: () => projectFilters() },
        newProject: { read: () => newProject() },
        openedCluster: { read: () => openedCluster() },
        projects: { merge: false },
      },
    },
  },
});

export default cache;
