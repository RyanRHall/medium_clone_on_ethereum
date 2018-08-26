pragma solidity ^0.4.24;

contract Article {
  string  public title;
  string  public body;
  string  public authorName;
  uint public id;
  uint public points;
  address public author;
  address private mediumAddress;

  event updated(uint id);
  event deleted(uint id);

  modifier mediumOnly() {
    require(msg.sender == mediumAddress);
    _;
  }

  modifier authorOnly() {
    require(tx.origin == author);
    _;
  }

  constructor(string _title, string _body, string _authorName, uint _id) public {
    title = _title;
    body = _body;
    authorName = _authorName;
    id = _id;
    points = 0;
    author = tx.origin;
    mediumAddress = msg.sender;
  }

  function patch(string _title, string _body) public authorOnly {
    title = _title;
    body = _body;
    emit updated(id);
  }

  function upVote(uint _points) public mediumOnly {
    emit updated(id);
    points += _points;

  }
  
  function destroy() public authorOnly {
    emit deleted(id);
    selfdestruct(author);
  }
}
