const { MockList } = require('apollo-server');
const casual = require('casual');

module.exports = {
  Query: () => ({
    me: () => ({
      id: casual.uuid,
      email: 'admin@intelygenz.com'
    }),
    projects: () => new MockList([2, 6])
  }),
  User: () => ({
    id: casual.uuid,
    email: casual.email,
  }),
  Project: () => ({
    id: casual.uuid,
    name: casual.name,
    description: casual.description,
    favorite: casual.boolean,
    repository: this.Repository,
    error: casual.random_element([null, casual.error]),
    state: casual.random_element(['STARTED', 'STOPPED']),
  }),
  Repository: () => ({
    id: casual.uuid,
    type: casual.random_element(['INTERNAL', 'EXTERNAL'])
  })
};