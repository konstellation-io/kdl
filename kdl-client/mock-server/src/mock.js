const { MockList } = require('apollo-server');
const casual = require('casual');

module.exports = {
  Query: () => ({
    me: () => ({
      id: casual.uuid,
      email: 'admin@intelygenz.com'
    }),
    projects: () => new MockList([4, 8]),
    users: () => new MockList([4, 8])
  }),
  User: () => ({
    id: casual.uuid,
    email: casual.email,
    creationDate: new Date().toUTCString(),
    accessLevel: casual.random_element(['ADMIN', 'VIEWER', 'MANAGER']),
    lastActivity: new Date().toUTCString()
  }),
  Project: () => ({
    id: casual.uuid,
    name: casual.name,
    description: casual.description,
    favorite: casual.boolean,
    repository: this.Repository,
    creationDate: () => (new Date()).toISOString(),
    error: casual.random_element([null, casual.error]),
    state: casual.random_element(['STARTED', 'STOPPED', 'ARCHIVED']),
  }),
  Repository: () => ({
    id: casual.uuid,
    type: casual.random_element(['INTERNAL', 'EXTERNAL'])
  })
};
