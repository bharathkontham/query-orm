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
        let prop = typeof property == 'string' ? property : property.relation;
        if (this.relationDefinitions[prop].type == 'hasMany') {
          methodName = 'find';
        } else if (this.relationDefinitions[prop].type == 'hasOne') {
          methodName = 'findOne';
        } else if (this.relationDefinitions[prop].type == 'belongsTo') {
          methodName = 'findOne';
        }
        if (typeof property == 'string') {
          record[property] = await this.relations[prop][methodName](record[this.relationDefinitions[prop].keyFrom])
        } else {
          record[property.relation] = await this.relations[prop][methodName](record[this.relationDefinitions[prop].keyFrom], property.scope)
        }
      }))
    }))
  }

}

module.exports = Include