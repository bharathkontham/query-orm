const {
  validate
} = require("jsonschema");

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
    self.relationDefinitions[property].methods = self.relationDefinitions[property].methods || {};
    self.relationDefinitions[property].methods[`${property}__find`] = scopeMethods.find;
  }
}

class BelongsTo {
  constructor(self, property) {
    self.relationDefinitions[property].methods = self.relationDefinitions[property].methods || {};
    self.relationDefinitions[property].methods[`${property}__findOne`] = scopeMethods.findOne;
  }
}

class HasOne {
  constructor(self, property) {
    self.relationDefinitions[property].methods = self.relationDefinitions[property].methods || {};
    self.relationDefinitions[property].methods[`${property}__findOne`] = scopeMethods.findOne;
  }
}

const RelationClasses = {
  belongsTo: BelongsTo,
  hasMany: HasMany,
  hasOne: HasOne
};

exports.RelationClasses = RelationClasses;

class Relation {
  constructor(self, preperty, definition) {
    definition = definition || {};
    self.relationDefinitions = self.relationDefinitions || {};
    self.relationDefinitions[preperty] = {};
    if (!validateType(definition.type)) {
      throw new Error('Invalid relation type')
    }
    self.relationDefinitions[preperty].type = normalizeType(definition.type);
    self.relationDefinitions[preperty].modelFrom = self;
    self.relationDefinitions[preperty].keyFrom = self.id.property;
    if (typeof definition.model === 'string') {
      self.relationDefinitions[preperty].modelTo = self.connector.modelBuilder.models[definition.model];
    } else {
      self.relationDefinitions[preperty].modelTo = definition.model;
    }
    self.relationDefinitions[preperty].keyTo = definition.foreignKey || `${self.name.toLowerCase()}Id`;

    new RelationClasses[self.relationDefinitions[preperty].type](self, preperty)
  }
}

exports.HasMany = HasMany;
exports.BelongsTo = BelongsTo;
exports.HasOne = HasOne;

exports.Relation = Relation;
