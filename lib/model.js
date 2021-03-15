const path = require('path');
const {
  Validator
} = require('jsonschema');
const Connector = require('./connector.js');
const {
  camelCaseToLowerDash
} = require('./utils.js');

const V = new Validator();

class Model {
  constructor (appRoot, modelName, modelConfig, dataSources) {
    this.modelDefinition = require(path.join(appRoot, `${modelConfig.directory}/${camelCaseToLowerDash(modelName)}.json`));
    this.name = this.modelDefinition.name;
    this.schema = this.modelDefinition.schema;
    this.id = this.modelDefinition.id;
    this.relations = this.modelDefinition.relations || {};
    this.validations = this.modelDefinition.validations || {};
    this.dataSource = this.modelDefinition.dataSource;
    this.plural = this.modelDefinition.plural;

    this.connector = new Connector(appRoot, this.modelDefinition, dataSources);
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
  */
  const validate = V.validate(filter, FilterSchema);
  if (validate && validate.errors && validate.errors.length > 0) {
    throw new Error('Invalid query filter!');
  }
  return true;
};

Model.prototype.find = (filter) => {
  FilterValidation(filter);
  return this.connector.find(filter);
};
Model.prototype.findById = (id) => {
  return this.connector.findById(id);
};
Model.prototype.findOne = (filter) => {
  FilterValidation(filter);
  return this.connector.findOne(filter);
};
Model.prototype.create = (instance) => {
  return this.connector.create(instance);
};
Model.prototype.updateById = (id, attributes) => {
  return this.connector.updateById(id, attributes);
};
Model.prototype.updateByQuery = (filter, attributes) => {
  return this.connector.updateByQuery(filter, attributes);
};
Model.prototype.deleteById = (id) => {
  return this.connector.deleteById(id);
};
Model.prototype.deleteByQuery = (filter, attributes) => {
  return this.connector.deleteByQuery(filter, attributes);
};
Model.prototype.count = (where) => {
  return this.connector.count(where);
};

module.exports = Model;
