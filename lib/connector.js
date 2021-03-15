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

Connector.prototype.find = (filter) => {
  return this.dbConnector.find(filter);
};
Connector.prototype.findById = (id) => {
  return this.dbConnector.findById(id);
};
Connector.prototype.findOne = (filter) => {
  return this.dbConnector.findOne(filter);
};
Connector.prototype.create = (instance) => {
  return this.dbConnector.create(instance);
};
Connector.prototype.updateById = (id, attributes) => {
  return this.dbConnector.updateById(id, attributes);
};
Connector.prototype.updateByQuery = (filter, attributes) => {
  return this.dbConnector.updateByQuery(filter, attributes);
};
Connector.prototype.deleteById = (id) => {
  return this.dbConnector.deleteById(id);
};
Connector.prototype.deleteByQuery = (filter, attributes) => {
  return this.dbConnector.deleteByQuery(filter, attributes);
};
Connector.prototype.count = (where) => {
  return this.dbConnector.count(where);
};

module.exports = Connector;
