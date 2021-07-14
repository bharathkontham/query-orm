const ORM = require('query-orm');
const DIRNAME = __dirname;

const app = new ORM({
  appRoot: DIRNAME,
  modelConfig: './model-config.json',
  dataSources: './datasource.json'
});
const modelsCount = 4;
let modelsLoaded = 0;
app.on('model-init', (d) => {
  console.log(d);
  console.log(d.model);
  modelsLoaded++;
  if(modelsLoaded === modelsCount) {
    run();
  }
  // if (d.model === 'User') {
  //   app.models.User.findById('asdasd').then((v) => {
  //     console.log(v);
  //   }).catch((e) => {
  //     console.log(e);
  //   });
  // }
  console.log(d.model);
});
const run = async () => {
  await app.models['User'].deleteByQuery({});
  await app.models['Order'].deleteByQuery({});
  await app.models['Store'].deleteByQuery({});
  await app.models['WorkStore'].deleteByQuery({});

  const user = await app.models['User'].create({
    "username": "naveena",
    "firstname": "naveena",
    "lastname": "ch",
    "password": "Naveena@1"
  })
  console.log("===========user=======================")
  console.log(user)


  const order = await app.models['User'].relations.orders.create(user.userId, {
    name: "frock"
  })
  console.log("====================order====================")
  console.log(order)


  const orders = await app.models['User'].relations.orders.find(user.userId, {})
  console.log("====================ordersss====================")
  console.log(orders)


  const users = await app.models['User'].find({
    include: "orders"
  })
  console.log("========================user include orders=============================")
  console.log(JSON.stringify(users))


  const belongsToUser = await app.models['Order'].relations.user.findOne(users[0].userId)
  console.log("========================Order relational user=============================")
  console.log(belongsToUser)


  const orderWithUser = await app.models['Order'].find({
    include: "user"
  })
  console.log("========================order include user=============================")
  console.log(JSON.stringify(orderWithUser))


  const order2 = await app.models.Order.create({
    name: "shirt"
  })


  const OrderUser = await app.models.Order.relations.user.setOrCreate(order2.id, user.userId)
  console.log(OrderUser)

  console.log("Has many through relation");
  const user1 = await app.models['User'].create({
    "username": "user1",
    "firstname": "user1",
    "lastname": "G",
    "password": "Durga@1"
  });
  
  const user2 = await app.models['User'].create({
    "username": "user2",
    "firstname": "user2",
    "lastname": "G",
    "password": "Durga@1"
  })


  const store1 = await app.models['Store'].create({
    "name": "store1"
  })

  const store2 = await app.models['Store'].create({
    "name": "store2"
  })

  console.log(await app.models['User'].relations.workingStores.add(user1.userId, store1.id));
  console.log(await app.models['User'].relations.workingStores.add(user1.userId, store2.id));

  console.log(await app.models['Store'].relations.workers.add(store1.id, user2.userId));
  console.log(await app.models['Store'].relations.workers.add(store2.id, user2.userId));

  console.log("Store1 workers");
  console.log(JSON.stringify(await app.models['Store'].relations.workers.find(store1.id, {})))

  await app.models['Store'].relations.workers.remove(store1.id, user1.userId);
  console.log("Removed user1 from store1");
  console.log("Remaining workers in store1 ", JSON.stringify(await app.models['Store'].find({
    where: { id: store1.id},
    include: [{"relation": "workers", scope:{where:{"firstname":"user2"}}}]
  })));

  await app.models['Store'].relations.workers.deleteByQuery(store2.id, {});
  console.log("Removed all workers from store2");
  console.log("Remaining workers in store2 ", JSON.stringify(await app.models['Store'].find({
    where: { id: store2.id},
    include: [{"relation": "workers"}]
  })));

  
};


app.on('error', (e) => {
  console.log('error', e);
});