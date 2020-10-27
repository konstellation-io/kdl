const cluster = {
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
    }
  }
};

const schema = {
  clusters: {
    definition: 'Collection of all clusters added in the machine.',
    type: 'array',
    default: [],
    items: cluster
  }
};

module.exports = schema;
