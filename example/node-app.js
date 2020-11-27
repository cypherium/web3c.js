#!/usr/bin/env node

var Web3c = require('../index.js');
var web3c = new Web3c();

web3c.setProvider(new web3c.providers.HttpProvider('http://localhost:8545'));

var coinbase = web3c.cph.coinbase;
console.log(coinbase);

var balance = web3c.cph.getBalance(coinbase);
console.log(balance.toString(10));
