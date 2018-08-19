pragma solidity ^0.4.24;

contract Article {
  string  public title;
  string  public body;
  address public author;

  constructor(string _title, string _body) public {
    title = _title;
    body = _body;
    author = msg.sender;
  }
}
