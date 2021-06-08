const R = require('ramda')
class Include {
  constructor(model) {
    model.getRelationalData = this.getRelationalData;
  }

  async getRelationalData(include, result) {
    if (typeof include == 'string') {
      include = [include]
    } else if (typeof include == 'object' && !Array.isArray(include)) {
      include = [include]
    }
    await Promise.all(result.map(async (record) => {
      await Promise.all(include.map(async (property) => {
        let methodName = ''
        let relationalKey = ''
        let prop = typeof property == 'string' ? property : property.relation;
        if (this.relationDefinitions[prop].type == 'hasMany') {
          methodName = 'find';
          relationalKey = record[this.relationDefinitions[prop].keyFrom];
        } else if (this.relationDefinitions[prop].type == 'hasOne') {
          methodName = 'findOne';
          relationalKey = record[this.relationDefinitions[prop].keyFrom];
        } else if (this.relationDefinitions[prop].type == 'belongsTo') {
          methodName = 'findOne';
          relationalKey = record[this.relationDefinitions[prop].keyTo];
        }
        if (typeof property == 'string') {
          record[property] = await this.relations[prop][methodName](relationalKey)
        } else {
          record[property.relation] = await this.relations[prop][methodName](relationalKey, property.scope)
        }
      }))
    }))
  }


}

module.exports = Include