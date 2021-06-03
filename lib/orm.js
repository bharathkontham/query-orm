const path = require('path');
const Model = require('./model.js');
const EventEmitter = require('events');
const {Relation} = require('./relation.js');
const Include = require('./include.js');
const R = require('ramda')

class ORM extends EventEmitter {
  constructor (configuration) {
    super();
    this.appRoot = configuration.appRoot;
    this.modelConfig = require(path.join(this.appRoot, configuration.modelConfig));
    this.dataSourceConfig = require(path.join(this.appRoot, configuration.dataSources));
    this.models = {};
    const modelNames = Object.keys(this.modelConfig.models);
    modelNames.forEach((modelName) => {
      this.models[modelName] = new Model(this.appRoot, modelName, this.modelConfig, this.dataSourceConfig);
      this.models[modelName].connector.init().then(() => {
        this.emit('model-init', {
          model: modelName,
          message: `${modelName} connector ${this.dataSourceConfig.name} initiated successfully`
        });
      }).catch((error) => {
        this.emit('error', error);
      });
    });

    R.forEachObjIndexed((model, name) => {
      model.connector.modelBuilder = model.connector.modelBuilder || {
        models: {}
      };
      model.connector.modelBuilder.models = this.models;
      R.forEachObjIndexed((definition, property) => {
        new Relation(model, property, definition)
      }, model.relations)
      new Include(model);
    }, this.models)

  }
}

module.exports = ORM;
