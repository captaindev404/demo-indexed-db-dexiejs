import Dexie from 'dexie';
import faker from 'faker';

const db = new Dexie('offline_db');
db.version(0.1).stores({
  customers: 'id, name, location',
});

db.on('populate', () => {
  for (let i = 0; i < 50; i++) {
    db.customers.add({
      id: i,
      url: `customers/${i}`,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`, //faker.name,
      location: `${faker.address.city()}, ${faker.address.countryCode()}`,//faker.address,
      latestOrderUrl: `orders/${faker.random.number()}`
    });
  }
});
db.on("blocked", ()  => {
  alert ("Database upgrading was blocked by another window. " +
    "Please close down any other tabs or windows that has this page open");
});

db.version(0.2).stores({
  customers: 'id, name, location',
})
  .upgrade(tx => {
    return tx.customers.toCollection().modify(customer => {
      customer.firstName = customer.name.split(' ')[0];
      customer.lastName = customer.name.split(' ')[1];
    })
  });

db.version(0.3).stores({
  customers: 'id, name, location, firstName',
  names: '++id, name',
})
  .upgrade(tx => {
    return tx.customers.toCollection().modify(customer => {
      db.names.add({ name: customer.name});
    });
  });

db.open();

// We don't want to add again all these data
/*for(let i = 0; i < 50; i++) {
  db.customers.add({
    id: i,
    url: `customers/${i}`,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`, //faker.name,
    location: `${faker.address.city()}, ${faker.address.countryCode()}`,//faker.address,
    latestOrderUrl: `orders/${faker.random.number()}`
  });
}*/


