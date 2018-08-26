const Medium = artifacts.require("Medium");
const range = require("lodash").range;

contract('Medium', function(accounts) {

  it("posts new articles", async function() {
    const mediumContract = await Medium.deployed();
    const initialArticleCount = (await mediumContract.getArticleIds()).length;
    await mediumContract.post("title", "body", "authorName");
    const finalArticleCount = (await mediumContract.getArticleIds()).length;
    assert.equal(finalArticleCount, initialArticleCount + 1);
  });

  it("emits events when new articles post", async function() {
    let eventEmitted = false;
    const mediumContract = await Medium.deployed();
    mediumContract["posted"]().watch(() => eventEmitted = true );
    await mediumContract.post("title", "body", "authorName");
    assert.equal(true, eventEmitted);
  });

  it("maintains a list of article IDs", async function() {
    const mediumContract = await Medium.deployed();
    const articleIds = (await mediumContract.getArticleIds()).map(bigNumber => bigNumber.toNumber());
    for (var i = 0; i < articleIds.length; i++) {
      assert.equal(i, articleIds[i]);
    }
  });

  it("permits lookup of article addresses by ID", async function() {
    const mediumContract = await Medium.deployed();
    const maxArticleId = (await mediumContract.getArticleIds()).length;
    range(maxArticleId).forEach(id => mediumContract.articleAddresses(id));
  });

  it("permits upvoting", async function() {
    const mediumContract = await Medium.deployed();
    await mediumContract.upVote(0, { value: 30000000000000000 });
  });

  it("can be stopped by admin", async function() {
    const mediumContract = await Medium.deployed();
    await mediumContract.setBreaker(true);
    try {
      await mediumContract.post("title", "body", "author");
      assert(false, "breaker was not tripped")
    } catch(e) { /* test passes */ }
    try {
      await mediumContract.upVote(0, { value: 30000000000000000 });
      assert(false, "breaker was not tripped")
    } catch(e) { /* test passes */ }
  });

  it("can support multiple admins", async function() {
    const mediumContract = await Medium.deployed();
    await mediumContract.addAdmin(accounts[1]);
    await mediumContract.setBreaker(true, { from: accounts[1] });
  });
});
