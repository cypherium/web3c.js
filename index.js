var Web3c = require('./lib/web3c');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Web3c === 'undefined') {
    window.Web3c = Web3c;
}

module.exports = Web3c;
