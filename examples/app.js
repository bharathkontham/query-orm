const ORM = require('../index.js');
const DIRNAME = __dirname;

const myormapp = new ORM({
  appRoot: DIRNAME,
  modelConfig: './model-config.json',
  dataSources: './datasource.json'
});

console.log(myormapp.modelConfig);
console.log(myormapp.models.User.name);
console.log(myormapp.models.User.schema);
