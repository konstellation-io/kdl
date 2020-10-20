const cluster = {
  type: 'object',
  required: ['type'],
  properties: {
    type: {
      type: 'string',
      enum: ['local', 'remote']
    },
    url: {
      type: 'string',
      format: 'hostname'
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
