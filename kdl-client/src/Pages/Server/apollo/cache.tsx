import { InMemoryCache, makeVar } from '@apollo/client';
import {
  ProjectFilters,
  ProjectOrder,
  ProjectSelection,
} from './models/ProjectFilters';

import { NewProject } from './models/NewProject';
import { Server } from 'Hooks/useServers';

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
export const openedServer = makeVar<Server | null>(null);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        projectFilters: { read: () => projectFilters() },
        newProject: { read: () => newProject() },
        openedServer: { read: () => openedServer() },
        projects: { merge: false },
      },
    },
  },
});

export default cache;
