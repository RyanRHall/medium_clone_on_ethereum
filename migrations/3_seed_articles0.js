var Medium = artifacts.require("Medium");
const faker = require("faker");
const _ = require("lodash");

module.exports = function(deployer) {
  const mediumContract = await Medium.deployed();

  await Promise.all(_.range(20).map(i => {
    console.log(`seeding contract ${i + 1} of 20`);
    return mediumContract.post(faker.company.catchPhrase(), "body 1", "Ryan", { from: account, gas: 300000 });
  }))

};
