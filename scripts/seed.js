let Web3 = require('web3');
let contract = require('truffle-contract');
let Medium = contract(require('../build/contracts/Medium.json'));

var provider = new Web3.providers.HttpProvider("http://localhost:8545");
Medium.setProvider(provider);
const web3 = new Web3(provider);
const account = web3.eth.accounts[0];
Medium.deployed().then(contract => {
   // contract.post(faker.company.catchPhrase(), "body 1", "Ryan");
   contract.post("title", "body 1", "Ryan", { from: account } )
    .then(msg => console.log("success:", msg))
    .catch(err => console.log("error:", err));
});
