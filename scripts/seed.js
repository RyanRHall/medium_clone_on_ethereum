const Medium = artifacts.require("Medium");
const faker = require("faker");
const _ = require("lodash");
faker.seed(123);

module.exports = async function(deployer) {
  const instance = await Medium.deployed();
  _.times(20, function() {
    instance.post(faker.company.catchPhrase(), "body 1", "Ryan");
  })
};
