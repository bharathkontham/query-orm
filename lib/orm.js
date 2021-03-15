const path = require('path');
const Model = require('./model.js');

class ORM {
  constructor (configuration) {
    this.appRoot = configuration.appRoot;
    this.modelConfig = require(path.join(this.appRoot, configuration.modelConfig));
    this.dataSourceConfig = require(path.join(this.appRoot, configuration.dataSources));
    this.models = {};
    const modelNames = Object.keys(this.modelConfig.models);
    modelNames.forEach((modelName) => {
      this.models[modelName] = new Model(this.appRoot, modelName, this.modelConfig, this.dataSourceConfig);
    });
  }
}

module.exports = ORM;
