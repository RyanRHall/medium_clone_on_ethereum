pragma solidity ^0.4.24;

import "./Article.sol";

contract Medium {
  mapping (uint => address) public articleAddresses;
  uint[] public articleIds;
  uint nextId = 0;

  function post(string title, string body) public returns(address) {
    address newArticle = new Article(title, body, nextId);
    articleAddresses[nextId] = address(newArticle);
    articleIds.push(nextId);
    nextId++;
    return(newArticle);
  }

  function getArticleIds() view returns(uint[]) {
    return articleIds;
  }
}
