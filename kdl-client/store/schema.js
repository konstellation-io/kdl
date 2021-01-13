const server = {
  type: 'object',
  required: ['id', 'type', 'name'],
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: ['local', 'remote']
    },
    state: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    warning: {
      type: 'boolean',
      default: false
    }
  }
};

const workspaceProject = {
  type: 'object',
  required: ['navigationOpened'],
  properties: {
    navigationOpened: {
      type: 'boolean',
      default: true
    }
  }
};

const initialWorkspace = {
  project: {
    navigationOpened: true
  }
};

const schema = {
  servers: {
    definition: 'Collection of all servers added in the machine.',
    type: 'array',
    default: [],
    items: server
  },
  workspace: {
    definition: 'User workspace settings to store layout customization',
    type: 'object',
    required: ['project'],
    default: initialWorkspace,
    properties: {
      project: workspaceProject
    }
  }
};

module.exports = schema;
