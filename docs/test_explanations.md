### Medium Tests

There are 6 tests in `mediumTest.js`, which test the core functionality of the Medium Contract. The Medium contract is responsible for controlling access to articles, operating the circuit breakers, and maintaining the list of most-popular articles.

Here, we test basic CRUD of articles - creating, reading, updating, and destroying. We also confirm that events are emitted properly and that the circuit breaker - when tripped - prevents all but reading functionality.

The most arduous part of this contract, the maintenance of the 'most popular' list, is carefully checked when articles are up-voted or deleted.

### Article Tests

The tests for the article contract are significantly simpler. The tests confirm that read and write methods are permitted for the correct actors. Some write methods should only be triggered through Medium, as it would be unfair to call them directly on the article (like up-vote).
