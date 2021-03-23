# query-orm

Loopback like ORM built to work with any node.js framework.

[![npm version](https://badge.fury.io/js/query-orm.svg)](https://www.npmjs.com/package/query-orm)

* [Installation](#installation)
* [Usage](#usage)
* [Filters](#filters)
* [Relations](#relations)
* [Connectors](#connectors)

## Installation

```shell
npm i query-orm
```

## Usage

### app.js

```javascript
const QueryORM = require('query-orm');

const app = new QueryORM({
  appRoot: DIRNAME,
  modelConfig: './model-config.json',
  dataSources: './datasource.json'
});

app.on('model-init', (data) => {
  console.log(data);
});

app.on('error', (error) => {
  console.log(error);
});

async function createUser (data) {
  const createdUser = await app.models.User.create(data);
  return createdUser;
}

createUser({
  firstname: 'Bharath',
  lastname: 'Reddy',
  username: 'bharathreddy',
  password: 'Test@1234'
}).then((createdUser) => {
  console.log(createdUser)
}).catch((error) => {
  console.log(error);
});

app.models.User.find({
  where: {
    username: 'bharathreddy'
  }
}).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error);
});
```

### datasources.json

```json
{
  "testdatasource": {
    "name": "testdatasource",
    "settings": {
      "indexName": "testindex",
      "isAlias": false,
      "isPattern": false,
      "mappings": {
        "properties": {
          "docType": {
            "type": "keyword"
          },
          "userId": {
            "type": "keyword"
          },
          "username": {
            "type": "keyword"
          },
          "firstname": {
            "type": "keyword"
          },
          "lastname": {
            "type": "keyword"
          },
          "password": {
            "type": "keyword"
          },
          "created": {
            "type": "date"
          },
          "updated": {
            "type": "date"
          }
        }
      },
      "aliases": {},
      "indexSettings": {
        "number_of_shards": 1,
        "number_of_replicas": 2
      },
      "createIndex": true,
      "updateMapping": true,
      "version": 7,
      "defaultLimit": 200,
      "configuration": {
        "nodes": [
          "https://localhost:9200"
        ],
        "requestTimeout": 30000,
        "pingTimeout": 3000,
        "auth": {
          "username": "admin",
          "password": "admin"
        },
        "agent": {
          "maxSockets": 1,
          "keepAlive": false
        },
        "ssl": {
          "rejectUnauthorized": false
        },
        "sniffInterval": 10000
      }
    },
    "connector": "query-orm-connector-elastic",
    "localConnector": false
  }
}
```

### model-config.json

```json
{
  "directory": "./models",
  "models": {
    "User": {
      "dataSource": "testdatasource"
    }
  }
}
```

### models/user.json

```json
{
  "name": "User",
  "plural": "users",
  "validations": {},
  "id": {
    "property": "userId",
    "generated": true
  },
  "schema": {
    "type": "object",
    "properties": {
      "userId": {
        "type": "string"
      },
      "username": {
        "type": "string"
      },
      "password": {
        "type": "string"
      },
      "firstname": {
        "type": "string"
      },
      "lastname": {
        "type": "string"
      },
      "created": {
        "type": "string",
        "format": "date-time"
      },
      "updated": {
        "type": "string",
        "format": "date-time"
      }
    },
    "required": [
      "firstname",
      "lastname",
      "userId",
      "username",
      "password"
    ]
  },
  "relations": {}
}
```

## Model Methods

### find

This method is for fetching data from Model's dataSource based on given query filter.

Example:

```javascript
await app.models.User.find({
  where: {
    firstname: 'bharath'
  },
  limit: 100,
  skip: 10
})
```

### findOne

This method is for fetching only one matched record from Model's dataSource based on given query filter.

**limit** and **skip** options will not work here.

Example:

```javascript
await app.models.User.findOne({
  where: {
    firstname: 'bharath'
  }
})
```

### findById

This method is for fetching the record from Model's dataSource based on given id parameter.

**limit** and **skip** options will not work here.

Example:

```javascript
await app.models.User.findById('id123');
```

### count

This method is for fetching the count from Model's dataSource based on given query filter.

**limit** and **skip** options will not work here.

Example:

```javascript
await app.models.User.count({
  firstname: 'bharath'
});
```

### create

This method is for create a record in Model.

Example:

```javascript
await app.models.User.create({
  firstname: 'bharath'
});
```

### updateById

This method is for updating a record matching the given id with attributes object provided.

Example:

```javascript
await app.models.User.updateById('id123', {
  firstname: 'bharath'
});
```

### updateByQuery

This method is for updating multiple records matched for given query with attributes object provided.

Example:

```javascript
await app.models.User.updateByQuery({
  and: [{
    lastname: 'reddy'
  }, {
    firstname: 'test'
  }]
}, {
  firstname: 'bharath'
});
```

### deleteById

This method is for deleting a record that matches the given id.

Example:

```javascript
await app.models.User.deleteById('id123');
```

### deleteByQuery

This method is for deleting multiple records that matches the given query.

Example:

```javascript
await app.models.User.updateByQuery({
  and: [{
    lastname: 'reddy'
  }, {
    firstname: 'test'
  }]
});
```

## Querying Data

### Base Filters

```javascript
{
  "where": {},
  "limit": 100,
  "skip": 2, // offset
  "searchafter": [], // optional for pagination
  "order": [], // [] or ""
  "fields": [], // [] or ""
  "include": [], // [] or "" for relations
}
```

**where** is the main query attribute.
It supports **and** and **or** queries.

## Relations

NA. Coming soon.

## Connectors

* [Elasticsearch](https://www.npmjs.com/package/query-orm-connector-elastic)
