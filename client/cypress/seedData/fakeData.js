let faker = require("faker");

const User = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.random.words()
};

module.exports = User;
