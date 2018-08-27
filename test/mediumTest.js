const Medium = artifacts.require("Medium");
const range = require("lodash").range;

contract('Medium', function(accounts) {

  before(async function() {
    const mediumContract = await Medium.deployed();
    return Promise.all(range(5).map(i => mediumContract.post(`title ${i}`, `body ${i}`, "author 1")));
  });

  it("posts new articles", async function() {
    const mediumContract = await Medium.deployed();
    const initialArticleCount = (await mediumContract.getArticleAddresses()).length;
    await mediumContract.post("title", "body", "authorName");
    const finalArticleCount = (await mediumContract.getArticleAddresses()).length;
    assert.equal(finalArticleCount, initialArticleCount + 1);
  });

  it("emits events when new articles post", async function() {
    let eventEmitted = false;
    const mediumContract = await Medium.deployed();
    mediumContract["posted"]().watch(() => eventEmitted = true );
    await mediumContract.post("title", "body", "authorName");
    assert.equal(true, eventEmitted);
  });

  it("rearranges articles after upvoting", async function() {
    const mediumContract = await Medium.deployed();
    const originalTopAddresses = await mediumContract.getNArticleAddresses(2);
    await mediumContract.upVote(1, { value: 30000000000000000 });
    const newTopAddresses = await mediumContract.getNArticleAddresses(2);
    assert.equal(newTopAddresses[0], originalTopAddresses[1]);
    assert.equal(newTopAddresses[1], originalTopAddresses[0]);
  });

  it("deletes articles", async function() {
    const mediumContract = await Medium.deployed();
    const initialArticleCount = (await mediumContract.getArticleAddresses()).length;
    const articleAddressToDelete = await mediumContract.getArticleFromId(2);
    await mediumContract.deleteArticle(2);
    assert.equal(initialArticleCount - 1, (await mediumContract.getArticleAddresses()).length);
    const articleAddresses = await mediumContract.getArticleAddresses();
    assert.equal(-1, articleAddresses.indexOf(articleAddressToDelete))
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
