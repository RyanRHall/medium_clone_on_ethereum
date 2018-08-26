var Medium = artifacts.require("Medium");

module.exports = async function(deployer) {
  const instance = await Medium.deployed();
  instance.post("title 1", "body 1", "Ryan");
  instance.post("title 2", "body 2", "Ryan");
  instance.post("title 3", "body 3", "Ryan");
  instance.post("title 4", "body 4", "Ryan");
  instance.post("title 5", "body 5", "Ryan");
  instance.post("title 6", "body 6", "Ryan");
  instance.post("title 7", "body 7", "Ryan");
};
