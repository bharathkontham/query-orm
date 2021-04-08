const path = require('path');
const {
  Validator
} = require('jsonschema');
const Connector = require('./connector.js');
const {
  camelCaseToLowerDash
} = require('./utils.js');
const Observer = require('./oberver.js');

const V = new Validator();

class Model {
  constructor(appRoot, modelName, modelConfig, dataSources) {
    this.modelDefinition = require(path.join(appRoot, `${modelConfig.directory}/${camelCaseToLowerDash(modelName)}.json`));
    this.name = this.modelDefinition.name;
    this.schema = this.modelDefinition.schema;
    this.id = this.modelDefinition.id;
    this.relations = this.modelDefinition.relations || {};
    this.validations = this.modelDefinition.validations || {};
    this.dataSource = modelConfig.models[modelName].dataSource;
    this.plural = this.modelDefinition.plural;
    this.options = this.modelDefinition.options || {};

    this.connector = new Connector(appRoot, this.modelDefinition, this.dataSource, dataSources);
    this.Observer = new Observer(this.name);
  }
  observe(name, listener) {
    this.Observer.observe(name, listener);
  }
}

const FilterSchema = {
  id: '/FilterSchema',
  title: 'Filter',
  properties: {
    where: {
      type: 'object',
      default: {}
    },
    skip: {
      type: 'integer'
    },
    limit: {
      type: 'integer'
    },
    searchafter: {
      type: 'array',
      items: {
        type: ['string', 'number', 'boolean']
      }
    },
    order: {
      type: ['array', 'string'],
      items: {
        type: 'string'
      }
    },
    include: {
      type: ['string', 'array'],
      items: {
        type: ['string', 'object']
      }
    },
    fields: {
      type: 'array',
      items: {
        type: ['string', 'object']
      }
    }
  },
  additionalProperties: false
};
const FilterValidation = (filter) => {
  /*
    Supported Filter
    - where
    - skip
    - limit
    - searchafter
    - order
    - include
    - fields
  */
  const validate = V.validate(filter, FilterSchema);
  if (validate && validate.errors && validate.errors.length > 0) {
    throw new Error('Invalid query filter!');
  }
  return true;
};

Model.prototype.find = async function (filter) {
  FilterValidation(filter);
  return await this.connector.find(filter);
};
Model.prototype.findById = async function (id) {
  return await this.connector.findById(id);
};
Model.prototype.findOne = async function (filter) {
  FilterValidation(filter);
  return await this.connector.findOne(filter);
};
Model.prototype.create = async function (instance) {
  let result = null;
  await this.Observer.trigger(this.name, 'save', async (next) => {
    const created = await this.connector.create(instance);
    result = await next(created);
  }, instance);
  return result;
};
Model.prototype.updateById = async function (id, attributes) {
  let result = null;
  await this.Observer.trigger(this.name, 'save', async (next) => {
    const updated = await this.connector.updateById(id, attributes);
    result = await next(updated);
  }, {
    id,
    attributes
  });
  return result;
};
Model.prototype.updateByQuery = async function (where, attributes) {
  let result = null;
  await this.Observer.trigger(this.name, 'save', async (next) => {
    const updated = await this.connector.updateByQuery(where, attributes);
    result = await next(updated);
  }, {
    where,
    attributes
  });
  return result;
};
Model.prototype.deleteById = async function (id) {
  let result = null;
  await this.Observer.trigger(this.name, 'delete', async (next) => {
    const deleted = await this.connector.deleteById(id);
    result = await next(deleted);
  }, {
    id
  });
  return result;
};
Model.prototype.deleteByQuery = async function (where, attributes) {
  let result = null;
  await this.Observer.trigger(this.name, 'delete', async (next) => {
    const deleted = await this.connector.deleteByQuery(where, attributes);
    result = await next(deleted);
  }, {
    where,
    attributes
  });
  return result;
};
Model.prototype.count = async function (where) {
  return await this.connector.count(where);
};

module.exports = Model;
