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
          methodName = `${prop}__find`;
        } else if (this.relationDefinitions[prop].type == 'hasOne') {
          methodName = `${prop}__findOne`;
        } else if (this.relationDefinitions[prop].type == 'belongsTo') {
          methodName = `${prop}__findOne`;
        }
        let filter = {
          where: {}
        }
        filter.where[this.relationDefinitions[prop].keyTo] = record[this.relationDefinitions[prop].keyFrom]
        Object.defineProperty(record, methodName, {
          value: async (query) => {
            query = query ? R.mergeDeepWith(R.concat, filter, query) : filter;
            return await this.relationDefinitions[prop].methods[methodName](query, this.relationDefinitions[prop].modelTo)
          }
        })
        if (typeof property == 'string') {
          record[property] = await record[methodName]()
        } else {
          record[property.relation] = await record[methodName](property.scope)
        }
      }))
    }))
  }


}

module.exports = Include
