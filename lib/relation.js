const {
  validate
} = require("jsonschema");
const R = require('ramda');

const RelationTypes = {
  belongsTo: 'belongsTo',
  hasMany: 'hasMany',
  hasOne: 'hasOne'
};

const scopeMethods = {
  findOne: async (filter, model) => {
    return await model.findOne(filter);
  },
  find: async (filter, model) => {
    return await model.find(filter);
  },
  create: async (data, model) => {
    return await model.create(data);
  },
  updateByQuery: async (where, data, model) => {
    return await model.updateByQuery(where, data);
  },
  deleteByQuery: async (where, model) => {
    return await model.deleteByQuery(where);
  }
};

exports.RelationTypes = RelationTypes;

function normalizeType(type) {
  if (!type) {
    return type;
  }
  const t1 = type.toLowerCase();
  for (const t2 in RelationTypes) {
    if (t2.toLowerCase() === t1) {
      return t2;
    }
  }
  return null;
}

function validateType(type) {
  return Object.keys(RelationTypes).indexOf(type) > -1
}

class HasMany {
  constructor(self, property) {
    self.relations[property] = self.relations[property] || {};
    self.relations[property]['find'] = async (relationId, filter) => {
      let query = {
        where: {}
      };
      query.where[self.relationDefinitions[property].keyTo] = relationId;
      query = (filter && !R.isEmpty(filter)) ? R.mergeDeepWith(R.concat, filter, query) : query;
      return await scopeMethods['find'](query, self.relationDefinitions[property].modelTo)
    }
    self.relations[property]['create'] = async (relationId, data) => {
      const query = {
        where: {}
      };
      query.where[self.relationDefinitions[property].keyFrom] = relationId;
      const parent = await self.find(query)
      if (!parent || R.isEmpty(parent)) {
        throw new Error('Parent record is not found')
      }
      data[self.relationDefinitions[property].keyTo] = relationId;
      return await scopeMethods['create'](data, self.relationDefinitions[property].modelTo)
    }
    self.relations[property]['updateByQuery'] = async (relationId, where, data) => {
      if (relationId == data[self.relationDefinitions[property].keyTo]) {
        let query = {};
        query[self.relationDefinitions[property].keyTo] = relationId;
        query = (where && !R.isEmpty(where)) ? R.mergeDeepWith(R.concat, where, query) : query;
        return await scopeMethods['updateByQuery'](query, data, self.relationDefinitions[property].modelTo)
      } else {
        throw new Error('Invalid relational key')
      }
    }
    self.relations[property]['deleteByQuery'] = async (relationId, where) => {
      let query = {};
      query[self.relationDefinitions[property].keyTo] = relationId;
      query = (where && !R.isEmpty(where)) ? R.mergeDeepWith(R.concat, where, query) : query;
      return await scopeMethods['deleteByQuery'](query, self.relationDefinitions[property].modelTo)
    }
  }
}

class BelongsTo {
  constructor(self, property) {
    self.relations[property] = self.relations[property] || {};
    self.relations[property]['findOne'] = async (relationId) => {
      let query = {
        where: {}
      };
      query.where[self.relationDefinitions[property].modelTo.id.property] = relationId;
      return await scopeMethods['findOne'](query, self.relationDefinitions[property].modelTo)
    }
    self.relations[property]['setOrCreate'] = async (modelFromId, relationId, data = {}) => {
      let where = {};
      where[self.relationDefinitions[property].modelFrom.id.property] = modelFromId
      const modelFrom = await scopeMethods['findOne']({where}, self.relationDefinitions[property].modelFrom)
      if (!modelFrom || R.isEmpty(modelFrom)) {
        throw new Error('From model record is not found!')
      }
      where = {}
      where[self.relationDefinitions[property].modelTo.id.property] = relationId
      let relatedData = await scopeMethods['findOne']({
        where
      }, self.relationDefinitions[property].modelTo)
      if (!relatedData || R.isEmpty(relatedData)) {
        relatedData = await scopeMethods['create'](data, self.relationDefinitions[property].modelTo)
        relationId = relatedData[self.relationDefinitions[property].modelTo.id.property]
      }
      where = {}
      where[self.relationDefinitions[property].modelFrom.id.property] = modelFromId
      modelFrom[self.relationDefinitions[property].keyTo] = relationId;
      return await scopeMethods['updateByQuery'](where, modelFrom, self.relationDefinitions[property].modelFrom)
    }
  }
}

class HasOne {
  constructor(self, property) {
    self.relations[property] = self.relations[property] || {};
    self.relations[property]['findOne'] = async (relationId) => {
      let query = {
        where: {}
      };
      query.where[self.relationDefinitions[property].keyTo] = relationId;
      return await scopeMethods['findOne'](query, self.relationDefinitions[property].modelTo)
    }
    self.relations[property]['create'] = async (relationId, data) => {
      const query = {
        where: {}
      };
      query.where[self.relationDefinitions[property].keyFrom] = relationId;
      const where = {}
      where[self.relationDefinitions[property].keyTo] = relationId
      const relationalRecords = await scopeMethods['find']({
        where
      })
      if (relationalRecords && relationalRecords.length) {
        throw new Error('Parent has already its child')
      }
      const parent = await self.find(query)
      if (!parent || R.isEmpty(parent)) {
        throw new Error('Parent record is not found')
      }
      data[self.relationDefinitions[property].keyTo] = relationId;
      return await scopeMethods['create'](data, self.relationDefinitions[property].modelTo)
    }
    self.relations[property]['updateByQuery'] = async (relationId, where, data) => {
      if (relationId == data[self.relationDefinitions[property].keyTo]) {
        let query = {};
        query[self.relationDefinitions[property].keyTo] = relationId;
        query = (where && !R.isEmpty(where)) ? R.mergeDeepWith(R.concat, where, query) : query;
        return await scopeMethods['updateByQuery'](query, data, self.relationDefinitions[property].modelTo)
      } else {
        throw new Error('Invalid relational key')
      }
    }
    self.relations[property]['deleteByQuery'] = async (relationId, where) => {
      let query = {};
      query[self.relationDefinitions[property].keyTo] = relationId;
      query = (where && !R.isEmpty(where)) ? R.mergeDeepWith(R.concat, where, query) : query;
      return await scopeMethods['deleteByQuery'](query, self.relationDefinitions[property].modelTo)
    }
  }
}

const RelationClasses = {
  belongsTo: BelongsTo,
  hasMany: HasMany,
  hasOne: HasOne
};

exports.RelationClasses = RelationClasses;

class Relation {
  constructor(self, property, definition) {
    definition = definition || {};
    self.relationDefinitions = self.relationDefinitions || {};
    self.relationDefinitions[property] = {};
    if (!validateType(definition.type)) {
      throw new Error('Invalid relation type')
    }
    self.relationDefinitions[property].type = normalizeType(definition.type);
    self.relationDefinitions[property].modelFrom = self;
    self.relationDefinitions[property].keyFrom = self.id.property;
    if (typeof definition.model === 'string') {
      self.relationDefinitions[property].modelTo = self.connector.modelBuilder.models[definition.model];
    } else {
      self.relationDefinitions[property].modelTo = definition.model;
    }
    self.relationDefinitions[property].keyTo = definition.foreignKey || `${self.name.toLowerCase()}Id`;

    new RelationClasses[self.relationDefinitions[property].type](self, property)
  }
}

exports.HasMany = HasMany;
exports.BelongsTo = BelongsTo;
exports.HasOne = HasOne;

exports.Relation = Relation;