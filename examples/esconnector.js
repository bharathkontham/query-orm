class ESConnector {
  constructor (modelDefinition, dataSource) {
    this.settings = dataSource.settings;
    this.modelIdField = modelDefinition.id.property;
    this.idGenerated = modelDefinition.id.generated;
    this.modelSchema = modelDefinition.schema;
  }
}

module.exports = ESConnector;
