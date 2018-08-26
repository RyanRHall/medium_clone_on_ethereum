const Article = artifacts.require("Article");
const Medium = artifacts.require("Medium");
const range = require("lodash").range;

contract('Article', function(accounts) {

  before(async function() {
    const mediumContract = await Medium.deployed();
    return Promise.all(range(5).map(i => mediumContract.post(`title ${i}`, `body ${i}`, "author 1")));
  });

  it("has public getter methods", async function() {
    const mediumContract = await Medium.deployed();
    const articleContract = await Article.at(await mediumContract.articleAddressesByPoints(0));
    assert(typeof (await articleContract.title()), "string");
    assert(typeof (await articleContract.body()), "string");
    assert(typeof (await articleContract.authorName()), "string");
    assert(typeof (await articleContract.author()), "string");
    assert(typeof (await articleContract.id()).toNumber(), "number");
    assert(typeof (await articleContract.points()).toNumber(), "number");
  });

  it("permits article owners to patch", async function() {
    const mediumContract = await Medium.deployed();
    const articleContract = await Article.at(await mediumContract.articleAddressesByPoints(0));
    await articleContract.patch("new title", "new body", { from: (await articleContract.author()) });
    assert.equal("new title", (await articleContract.title()));
    assert.equal("new body", (await articleContract.body()));
  });

  it("prohibits non-article owners from patching", async function() {
    const mediumContract = await Medium.deployed();
    const articleContract = await Article.at(await mediumContract.articleAddressesByPoints(0));
    const originalTitle = await articleContract.title();
    const originalBody = await articleContract.body();
    const otherAccount = accounts[0] === (await articleContract.author()) ? accounts[1] : accounts[0];
    try {
      await articleContract.patch("new title", "new body", { from: otherAccount })
      assert(false, "non-article owner was successful at patching")
    } catch(e) { /* test passes */ }
  });

  it("permits upvotes from Medium", async function() {
    const mediumContract = await Medium.deployed();
    const articleContract = await Article.at(await mediumContract.articleAddressesByPoints(0));
    const originalPoints = (await articleContract.points()).toNumber();
    await mediumContract.upVote(0, { value: 10000000000000000 });
    assert.equal(originalPoints + 1, (await articleContract.points()).toNumber())
  });

  it("prohibits upvotes that don't originate from Medium", async function() {
    const mediumContract = await Medium.deployed();
    const articleContract = await Article.at(await mediumContract.articleAddressesByPoints(0));
    try {
      await articleContract.upVote(1);
      assert(false, "article was manually upvoted")
    } catch(e) { /* test passes */ }

  });

  it("emits event when deleted", async function() {
    const mediumContract = await Medium.deployed();
    const articleContract = await Article.at(await mediumContract.articleAddressesByPoints(0));
    let eventEmitted = false;
    articleContract["deleted"]().watch(() => eventEmitted = true );
    await mediumContract.deleteArticle(await articleContract.id(), { from: await articleContract.author() });
    assert.equal(true, eventEmitted);
  });

});
