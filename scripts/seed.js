const faker = require("faker");
const _ = require("lodash");
const Medium = artifacts.require("Medium");
faker.seed(123);

module.exports = async function(callback) {
  const mediumContract = await Medium.deployed();
  _.times(20, () => {
    mediumContract.post(faker.company.catchPhrase(), faker.lorem.paragraphs(12), `${faker.name.firstName()} ${faker.name.lastName()}`);
  })
  callback();
}
