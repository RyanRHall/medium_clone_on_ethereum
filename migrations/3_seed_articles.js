var Medium = artifacts.require("Medium");

module.exports = async function(deployer) {
  const instance = await Medium.deployed();
  instance.post("title 1", "body 1");
  instance.post("title 2", "body 2");
  instance.post("title 3", "body 3");
  instance.post("title 4", "body 4");
  instance.post("title 5", "body 5");
  instance.post("title 6", "body 6");
  instance.post("title 7", "body 7");
};
