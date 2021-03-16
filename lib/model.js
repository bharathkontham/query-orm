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
  return await this.connector.create(instance);
};
Model.prototype.updateById = async function (id, attributes) {
  return await this.connector.updateById(id, attributes);
};
Model.prototype.updateByQuery = async function (where, attributes) {
  return await this.connector.updateByQuery(where, attributes);
};
Model.prototype.deleteById = async function (id) {
  return await this.connector.deleteById(id);
};
Model.prototype.deleteByQuery = async function (where, attributes) {
  return await this.connector.deleteByQuery(where, attributes);
};
Model.prototype.count = async function (where) {
  return await this.connector.count(where);
};

module.exports = Model;
