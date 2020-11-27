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
    errors: { description: '' },
  },
  repository: {
    values: {
      type: null,
      slug: '',
      url: '',
      skipTest: false,
    },
    errors: { slug: '', url: '', connection: '' },
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
