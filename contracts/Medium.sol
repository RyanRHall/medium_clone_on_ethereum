pragma solidity ^0.4.24;

import "./Article.sol";

contract Medium {
  // CONTRACT VARIABLES
  // circuit breaker
  bool public stopped = false;
  // article addresses
  mapping (uint => address) public articleAddresses;
  uint[] public articleIds;
  // next article ID
  uint nextId = 0;
  // admins
  mapping (address => bool) private admins;

  // EVENTS
  event posted(uint articleId, address author);

  // MODIFIERS
  // circuit breaker
  modifier stopInEmergency { require(!stopped); _; }
  modifier onlyInEmergency { require(stopped); _; }
  // require admin access
  modifier adminOnly { require(admins[msg.sender]); _; }

  // CONSTRUCTOR
  constructor() public {
    admins[msg.sender] = true;
  }

  // FUNCTIONS
  function getArticleIds() public view returns(uint[]) {
    return articleIds;
  }

  function post(string title, string body, string authorName) public stopInEmergency {
    address newArticle = new Article(title, body, authorName, nextId);
    articleAddresses[nextId] = address(newArticle);
    emit posted(nextId, msg.sender);
    articleIds.push(nextId);
    nextId++;
  }

  function upVote(uint id) public payable stopInEmergency {
    uint points = msg.value / 10000000000000000;
    address articleAddress = articleAddresses[id];
    Article article = Article(articleAddress);
    article.upVote(points);
    article.author().transfer(msg.value);
  }

  function addAdmin(address newAdmin) public adminOnly {
    admins[newAdmin] = true;
  }

  function setBreaker(bool _stopped) public adminOnly {
    stopped = _stopped;
  }
}
