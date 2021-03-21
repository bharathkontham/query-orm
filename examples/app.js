const ORM = require('../index.js');
const DIRNAME = __dirname;

const myormapp = new ORM({
  appRoot: DIRNAME,
  modelConfig: './model-config.json',
  dataSources: './datasource.json'
});
myormapp.on('model-init', (d) => {
  console.log(d);
  console.log(d.model);
  if (d.model === 'User') {
    myormapp.models.User.findById('asdasd').then((v) => {
      console.log(v);
    }).catch((e) => {
      console.log(e);
    });
  }
});

myormapp.on('error', (e) => {
  console.log('error', e);
});
