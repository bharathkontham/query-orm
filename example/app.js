const ORM = require('query-orm');
const DIRNAME = __dirname;

const app = new ORM({
  appRoot: DIRNAME,
  modelConfig: './model-config.json',
  dataSources: './datasource.json'
});
app.on('model-init', (d) => {
  console.log(d);
  console.log(d.model);
  // if (d.model === 'User') {
  //   app.models.User.findById('asdasd').then((v) => {
  //     console.log(v);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  // }
});

(async () => {
  const user = await app.models['User'].create({
    "username": "naveena",
    "firstname": "naveena",
    "lastname": "ch",
    "password": "Naveena@1"
  })
  console.log("===========user=======================")
  console.log(user)


  const order = await app.models['User'].relations.orders.create('WxtL5nkBSDSEpNGM7l1m', {
    name: "frock"
  })
  console.log("====================order====================")
  console.log(order)


  const orders = await app.models['User'].relations.orders.find('WxtL5nkBSDSEpNGM7l1m', {})
  console.log("====================ordersss====================")
  console.log(orders)


  const user = await app.models['User'].find({
    include: "orders"
  })
  console.log("========================user include orders=============================")
  console.log(JSON.stringify(user))


  const belongsToUser = await app.models['Order'].relations.user.findOne(user[0].userId)
  console.log("========================Order relational user=============================")
  console.log(belongsToUser)


  const orderWithUser = await app.models['Order'].find({
    include: "user"
  })
  console.log("========================order include user=============================")
  console.log(JSON.stringify(orderWithUser))


  const order = await app.models.Order.create({
    name: "shirt"
  })


  const OrderUser = await app.models.Order.relations.user.setOrCreate(order.id, 'WxtL5nkBSDSEpNGM7l1m')
  console.log(OrderUser)

  
})()


app.on('error', (e) => {
  console.log('error', e);
});