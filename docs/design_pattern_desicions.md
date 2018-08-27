# Design Patterns

The Medium and Article Contracts incorporate many of the essential design patterns into their structure.

#### Fail Early, Fail Loud

Almost every function on both contracts contains a modifier that checks for appropriate accessibility before continuing.

```solidity
// Article.sol
modifier mediumOnly() { require(msg.sender == mediumAddress); _; }
modifier authorOnly() { require(tx.origin == author); _; }
//...
function patch(string _title, string _body) public authorOnly {
  title = _title;
  body = _body;
  emit updated(id);
}

function upVote(uint _points) public mediumOnly {
  emit updated(id);
  points += _points;
}
```

#### Mortality

Making contracts destructible is an essential part of building clean, trim applications. It is good to remove unnecessary information from the blockchain.

```solidity
// Article.sol
function destroy() public authorOnly mediumOnly {
  emit deleted(id);
  selfdestruct(author);
}
```

#### Circuit Breaker

The circuit breaker design is essential to handling dysfunctional contracts. Since most operations originate through the Medium contract, it made sense to introduce a circuit breaker so that CUD operations could be paused without prohibiting read access to the application.

```solidity
// Medium.sol
bool public stopped = false;
//...
modifier stopInEmergency { require(!stopped); _; }
modifier onlyInEmergency { require(stopped); _; }
//...
function post(string title, string body, string authorName) public stopInEmergency {
  //...
}
```
