/* jshint ignore:start */


// Browser environment
if(typeof window !== 'undefined') {
    Web3c = (typeof window.Web3c !== 'undefined') ? window.Web3c : require('web3c');
    BigNumber = (typeof window.BigNumber !== 'undefined') ? window.BigNumber : require('bignumber.js');
}


// Node environment
if(typeof global !== 'undefined') {
    Web3c = (typeof global.Web3c !== 'undefined') ? global.Web3c : require('web3c');
    BigNumber = (typeof global.BigNumber !== 'undefined') ? global.BigNumber : require('bignumber.js');
}

/* jshint ignore:end */
