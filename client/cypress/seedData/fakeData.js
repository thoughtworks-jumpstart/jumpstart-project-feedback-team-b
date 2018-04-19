let faker = require("faker");

const User = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.random.words()
};

const ExistingUser = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.random.words()
};

module.exports = { User, ExistingUser };
