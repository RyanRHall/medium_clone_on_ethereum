# Decentralized Medium

This repository contains my final project for ConsenSys's 2018 developer academy. The application gives users the ability to consume, create, and support crowd-sourced articles, mimicking the functionality of Medium.

### requirements

0. node 8.9.x
0. truffle 4.1.x

### Installation

0. clone repository & cd into it `git clone https://github.com/RyanRHall/medium_clone_on_ethereum.git && cd medium_clone_on_ethereum`
0. install dependencies `npm install`
0. start geth or ganache on localhost, **port 8545**
0. migrate contracts `truffle migrate`
0. seed data `truffle exec scripts/seed.js`
0. start application server `npm run start`
0. visit localhost:3000 to browse and play :)

\* you will need to login with uPort to enable some functionality

### Tests

0. `truffle test`

## Links

[Avoiding Common Attacks]("./avoiding_common_attacks.md")
[Design Pattern Decisions]("./design_pattern_desicions.md")
[Tests]("./tests.md")
