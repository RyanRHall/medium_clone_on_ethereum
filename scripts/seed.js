const faker = require("faker");
const _ = require("lodash");
const Medium = artifacts.require("Medium");
faker.seed(123);
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider("http://localhost:8545")
const web3 = new Web3(provider);
const accounts = web3.eth.accounts;

function paragraph() {
  return `<p>${faker.lorem.sentences(8)}</p>`
}
function paragraphs(n) {
  result = "";
  for (var i = 0; i < n; i++) {
    result = result + paragraph();
  }
  return result;
}

module.exports = async function(callback) {
  const mediumContract = await Medium.deployed();
  for (let i = 0; i < 20; i++) {
    await mediumContract.post(faker.company.catchPhrase(), paragraphs(12), `${faker.name.firstName()} ${faker.name.lastName()}`, { from: _.sample(accounts) });
    await mediumContract.upVote(i, { value: faker.random.number(30) * 10000000000000000 });
  }
  callback();
}
