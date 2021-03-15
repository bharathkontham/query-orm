class Test {
  constructor(obj) {
    this.connectorConfig = obj;
    this.settings = obj.settings;
    this.init(this.connectorConfig);
  }

  init(connectorConfig) {
    return connectorConfig.name;
  }
}

module.exports = Test;