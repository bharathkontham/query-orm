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

## Definition

Model.json
```
...
relations: {
    "user": {
      "type": "belongsTo",
      "model": "User",
      "foreignKey": "userId"
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
