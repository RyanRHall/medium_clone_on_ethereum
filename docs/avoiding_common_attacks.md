# Avoiding Common Attacks

#### Re-Entry Attacks

Re-entry attacks are possible when a contract invokes a function on another contract. This is dangerous if the originating contract somehow gets invokes recursively and performs multiple operations (like sending ether) on different levels of the stack.

The simple fix for this kind of susceptibility is to always finish external work in contracts before changing internal contract variables or sending ether.

```solidity
// Medium.sol
function upVote(uint id) public payable stopInEmergency {
  // calculate article points based on price
  uint points = msg.value / 10000000000000000;
  Article article = Article(getArticleFromId(id));
  article.upVote(points);
  // rearrange articleAddressesByPoints
  uint idx = articleIdIndex[id];
  Article leftArticle;
  Article rightArticle;
  while(idx > 0) {
    leftArticle = Article(articleAddressesByPoints[idx - 1]);
    rightArticle = Article(articleAddressesByPoints[idx]);
    if(rightArticle.points() > leftArticle.points()) {
      (articleAddressesByPoints[idx], articleAddressesByPoints[idx - 1]) = (leftArticle, rightArticle);
      articleIdIndex[leftArticle.id()] = idx;
      articleIdIndex[rightArticle.id()] = idx - 1;
      idx--;
    } else {
      break;
    }
  }
  // pay author
  article.author().transfer(msg.value);
}
```

In the Medium contract, authors are paid when someone up-votes their article. The important steps in this function are to update properties on the article contract, change internal contract properties, and pay the author (in that order!). The external function call is the first to happen, and the author is paid at the very end.

#### Transaction Ordering and Timestamp Dependence
None of the contracts rely on timestamps or block order

#### Integer Overflow and Underflow

There is very little risk of integer overflow or underflow since no integer variables are dictated by user input
