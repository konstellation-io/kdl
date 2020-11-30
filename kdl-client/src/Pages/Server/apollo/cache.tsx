import { InMemoryCache, makeVar } from '@apollo/client';
import {
  ProjectFilters,
  ProjectOrder,
  ProjectSelection,
} from './models/ProjectFilters';
import { UserSelection, UserSettings } from './models/UserSettings';

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

const initialStateUserSettings: UserSettings = {
  selectedUserIds: [],
  userSelection: UserSelection.NONE,
  filters: {
    email: null,
    accessLevel: null,
  },
};

export const projectFilters = makeVar(initialProjectFilters);
export const newProject = makeVar(initialNewProject);
export const openedServer = makeVar<Server | null>(null);
export const userSettings = makeVar<UserSettings>(initialStateUserSettings);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        projectFilters: { read: () => projectFilters() },
        newProject: { read: () => newProject() },
        openedServer: { read: () => openedServer() },
        userSettings: { read: () => userSettings() },
        projects: { merge: false },
        users: { merge: false },
      },
    },
  },
});

export default cache;
