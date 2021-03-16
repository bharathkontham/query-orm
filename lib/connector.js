const path = require('path');
class Connector {
  constructor (appRoot, modelDefinition, dataSources) {
    this.modelDefinition = modelDefinition;
    if (!dataSources[this.modelDefinition.dataSource]) {
      throw new Error(`dataSource '${this.modelDefinition.dataSource}' for model '${this.modelDefinition.name}' is not found!`);
    }
    this.dataSource = dataSources[this.modelDefinition.dataSource];
    let ConnectorModule;
    if (this.dataSource.localConnector) {
      ConnectorModule = require(path.join(appRoot, this.dataSource.connector));
    } else {
      ConnectorModule = require(this.dataSource.connector);
    }
    this.dbConnector = new ConnectorModule(this.modelDefinition, this.dataSource);
  }
}

Connector.prototype.find = async function (filter) {
  return await this.dbConnector.find(filter);
};
Connector.prototype.findById = async function (id) {
  return await this.dbConnector.findById(id);
};
Connector.prototype.findOne = async function (filter) {
  return await this.dbConnector.findOne(filter);
};
Connector.prototype.create = async function (instance) {
  return await this.dbConnector.create(instance);
};
Connector.prototype.updateById = async function (id, attributes) {
  return await this.dbConnector.updateById(id, attributes);
};
Connector.prototype.updateByQuery = async function (where, attributes) {
  return await this.dbConnector.updateByQuery(where, attributes);
};
Connector.prototype.deleteById = async function (id) {
  return await this.dbConnector.deleteById(id);
};
Connector.prototype.deleteByQuery = async function (where, attributes) {
  return await this.dbConnector.deleteByQuery(where, attributes);
};
Connector.prototype.count = async function (where) {
  return await this.dbConnector.count(where);
};

module.exports = Connector;
