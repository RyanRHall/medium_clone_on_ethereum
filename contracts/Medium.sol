pragma solidity ^0.4.24;

import "./Article.sol";

contract Medium {
  // CONTRACT VARIABLES
  // circuit breaker
  bool public stopped = false;
  // article addresses
  mapping (uint => uint) public articleIdIndex;
  address[] public articleAddressesByPoints;
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
  // require article owner
  modifier authorOnly(uint id) {
    Article article = Article(articleAddressesByPoints[id]);
    require(article.author() == msg.sender);
    _;
  }

  // CONSTRUCTOR
  constructor() public {
    admins[msg.sender] = true;
  }

  // FUNCTIONS
  function getNArticleAddresses(uint n) public view returns(address[]) {
    uint size = n > articleAddressesByPoints.length ? articleAddressesByPoints.length : n;
    address[] memory articleIds = new address[](size);
    for (uint i=0; i<size; i++) {
      articleIds[i] = articleAddressesByPoints[i];
    }
    return articleIds;
  }

  function getArticleAddresses() public view returns(address[]) {
    return articleAddressesByPoints;
  }

  function post(string title, string body, string authorName) public stopInEmergency {
    emit posted(nextId, msg.sender);
    // create new article
    address newArticle = new Article(title, body, authorName, nextId);
    // add article to end of list by points (it should have 0 points)
    articleAddressesByPoints.push(newArticle);
    // add id and index to mapping for O(1) lookup
    articleIdIndex[nextId] = articleAddressesByPoints.length - 1;
    // increment nextId for next post
    nextId++;
  }

  function upVote(uint id) public payable stopInEmergency {
    // calculate article points based on price
    uint points = msg.value / 10000000000000000;
    Article article = Article(articleAddressesByPoints[id]);
    article.upVote(points);
    // rearrange articleAddressesByPoints
    uint idx = articleIdIndex[id];
    Article leftArticle;
    Article rightArticle;
    while(idx > 0) {
      leftArticle = Article(articleAddressesByPoints[idx - 1]);
      rightArticle = Article(articleAddressesByPoints[idx]);
      if(rightArticle.points() > leftArticle.points()) {
        (articleAddressesByPoints[idx], articleAddressesByPoints[idx - 1]) = (articleAddressesByPoints[idx - 1], articleAddressesByPoints[idx]);
        idx--;
      } else {
        break;
      }
    }
    // pay author
    article.author().transfer(msg.value);
  }
  
  function deleteArticle(uint id) public authorOnly(id) {
    // delete contract
    Article article = Article(articleAddressesByPoints[id]);
    article.destroy();
    // remove contract from id list
    delete articleAddressesByPoints[articleIdIndex[id]];
    for (uint i = articleIdIndex[id] + 1; i<articleAddressesByPoints.length; i++) {
      // shift ids down in array
      articleAddressesByPoints[i-1] = articleAddressesByPoints[i];
    }
    // shorten articleAddressesByPoints
    articleAddressesByPoints.length--;
    // remove id from mapping
    delete articleIdIndex[id];
  }

  function addAdmin(address newAdmin) public adminOnly {
    admins[newAdmin] = true;
  }

  function setBreaker(bool _stopped) public adminOnly {
    stopped = _stopped;
  }
}
