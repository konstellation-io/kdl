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

const schema = {
  servers: {
    definition: 'Collection of all servers added in the machine.',
    type: 'array',
    default: [],
    items: server
  }
};

module.exports = schema;
