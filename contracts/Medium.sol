pragma solidity ^0.4.24;

import "./Article.sol";

contract Medium {
  mapping (uint => address) public articleAddresses;
  uint[] public articleIds;
  uint nextId = 0;

  event posted(uint articleId)

  function post(string title, string body) public {
    address newArticle = new Article(title, body, nextId);
    articleAddresses[nextId] = address(newArticle);
    emit posted(nextId);
    articleIds.push(nextId);
    nextId++;
  }

  function getArticleIds() view returns(uint[]) {
    return articleIds;
  }
}
