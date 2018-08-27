var Medium = artifacts.require("Medium");

module.exports = function(deployer) {
  Medium.deployed().then(contract => {
     // contract.post(faker.company.catchPhrase(), "body 1", "Ryan");
     contract.post("title", "body 1", "Ryan", { from: account } )
      .then(msg => console.log("success:", msg))
      .catch(err => console.log("error:", err));
  });
};
