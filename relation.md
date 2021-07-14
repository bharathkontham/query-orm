# query-orm relations

Loopback like ORM built to work with any node.js framework.

[![npm version](https://badge.fury.io/js/query-orm.svg)](https://www.npmjs.com/package/query-orm)

- [query-orm relations](#query-orm-relations)
  - [Definition](#definition)
  - [hasMany](#hasmany)
    - [hasMany-find](#hasmany-find)
    - [hasMany-create](#hasmany-create)
    - [hasMany-updateByQuery](#hasmany-updatebyquery)
    - [hasMany-deleteByQuery](#hasmany-deletebyquery)
  - [hasOne](#hasone)
    - [hasOne-findOne](#hasone-findone)
    - [hasOne-create](#hasone-create)
    - [hasOne-updateByQuery](#hasone-updatebyquery)
    - [hasOne-deleteByQuery](#hasone-deletebyquery)
  - [belongsTo](#belongsto)
    - [belongsTo-findOne](#belongsto-findone)
    - [belongsTo-setOrCreate](#belongsto-setorcreate)
  - [hasManyThrough](#hasManyThrough)
    - [hasManyThrough-find](#hasManyThrough-add)
    - [hasManyThrough-create](#hasManyThrough-remove)
    - [hasManyThrough-find](#hasManyThrough-find)
    - [hasManyThrough-deleteByQuery](#hasManyThrough-deletebyquery)

## Definition

Model.json
```
...
relations: {
    "user": {
      "type": "belongsTo",
      "model": "User",
      "foreignKey": "userId"
    },
    "workers": {
      "type": "hasManyThrough",
      "model": "User",
      "foreignKey": "storeId",
      "through": "WorkStore",
      "keyThrough": "userId"
    }
}

relations: {
    "workers": {
      "type": "hasManyThrough",
      "model": "User",
      "foreignKey": "storeId",
      "through": "WorkStore",
      "keyThrough": "userId"
    }
}
```
## hasMany

Refer example at (https://github.com/bharathkontham/query-orm/tree/main/example)

A hasMany relation builds a one-to-many connection with another model.

** If User model has hasMany relation with Order model **

### hasMany-find

Model.relations.property.find(relationId, filter)

Example
```
User.realtions.orders.find(userId, filter)
```

### hasMany-create

Model.relations.property.create(relationId, data)

Example
```
User.realtions.orders.create(userId, data)
```

### hasMany-updateByQuery

Model.relations.property.updateByQuery(relationId, where, data)

Example
```
User.realtions.orders.updateByQuery(userId, where, data)
```

### hasMany-deleteByQuery

Model.relations.property.deleteByQuery(relationId, where)

Example
```
User.realtions.orders.deleteByQuery(userId, where)
```


## hasOne

A hasOne relation sets up a one-to-one connection with another model

** If User model has hasOne relation with Order model **

### hasOne-findOne

Model.relations.property.findOne(relationId)

Example
```
User.realtions.order.findOne(userId)
```

### hasOne-create

Model.relations.property.create(relationId, data)

Example
```
User.realtions.order.create(userId, data)
```

### hasOne-updateByQuery

Model.relations.property.updateByQuery(relationId, where, data)

Example
```
User.realtions.order.updateByQuery(userId, where, data)
```

### hasOne-deleteByQuery

Model.relations.property.deleteByQuery(relationId, where)

Example
```
User.realtions.order.deleteByQuery(userId, where)
```

## belongsTo

A belongsTo relation sets up either a many-to-one or a one-to-one connection with another model

** If Order model has belongsTo relation with User model **

### belongsTo-findOne

Model.relations.property.findOne(relationId)

Example
```
Order.realtions.user.findOne(userId)
```

### belongsTo-setOrCreate

Model.relations.property.setOrCreate(modelFromId, relationId, data(optional))

Example
```
Order.realtions.user.setOrCreate(orderId, userId, data)
```

## hasManyThrough

Refer example at (https://github.com/bharathkontham/query-orm/tree/main/example)

A hasManyThrough relation builds a many-to-many connection between two models with through model.

** If User model has hasMany relation with Store model and also Store has many realtion with User **

### hasMany-find

Model.relations.property.find(relationId, filter)

Example - list workers associated with store 
```
Store.realtions.workers.find(storeId, filter)
```

Example - list user working stores.
```
User.realtions.workingStores.find(userId, filter)
```

### hasManyThrough-add

Model.relations.property.add(relationId, anothermodelRelationId)

Example - Adding user as worker in store 
```
Store.realtions.workers.add(storeId, userId)
```

### hasManyThrough-remove

Model.relations.property.remove(relationId, anothermodelRelationId)

Example - Remove worker user from store
```
Store.realtions.workers.remove(storeId, userId)
```

### hasMany-deleteByQuery

Model.relations.property.deleteByQuery(relationId, where)
where clause on through model only

Example - remove all worker users from store
```
Store.realtions.workers.deleteByQuery(storeId, where)
```
