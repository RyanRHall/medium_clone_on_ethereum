pragma solidity ^0.4.24;

contract Article {
  string  public title;
  string  public body;
  uint public id;
  address public author;

  constructor(string _title, string _body, uint _id) public {
    title = _title;
    body = _body;
    id = _id;
    author = msg.sender;
  }
}
