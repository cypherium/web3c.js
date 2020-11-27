/*
    This file is part of web3c.js.

    web3c.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3c.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3c.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file cph.js
 * @author Marek Kotewicz <marek@cphdev.com>
 * @author Fabian Vogelsteller <fabian@cphdev.com>
 * @date 2015
 */

"use strict";

var formatters = require('../formatters');
var utils = require('../../utils/utils');
var Method = require('../method');
var Property = require('../property');
var c = require('../../utils/config');
var Contract = require('../contract');
var watches = require('./watches');
var Filter = require('../filter');
var IsSyncing = require('../syncing');
var namereg = require('../namereg');
var Iban = require('../iban');
var transfer = require('../transfer');

var blockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "cph_getTxBlockByHash" : "cph_getTxBlockByNumber";
};

var transactionFromBlockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'cph_getTransactionByBlockHashAndIndex' : 'cph_getTransactionByBlockNumberAndIndex';
};

var uncleCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'cph_getUncleByBlockHashAndIndex' : 'cph_getUncleByBlockNumberAndIndex';
};

var getBlockTransactionCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'cph_getBlockTransactionCountByHash' : 'cph_getBlockTransactionCountByNumber';
};

var uncleCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'cph_getUncleCountByBlockHash' : 'cph_getUncleCountByBlockNumber';
};

function Cph(web3c) {
    this._requestManager = web3c._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function(p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });


    this.iban = Iban;
    this.sendIBANTransaction = transfer.bind(null, this);
}

Object.defineProperty(Cph.prototype, 'defaultBlock', {
    get: function () {
        return c.defaultBlock;
    },
    set: function (val) {
        c.defaultBlock = val;
        return val;
    }
});

Object.defineProperty(Cph.prototype, 'defaultAccount', {
    get: function () {
        return c.defaultAccount;
    },
    set: function (val) {
        c.defaultAccount = val;
        return val;
    }
});

var methods = function () {
    var committeeMembers =new Method({
        name: 'committeeMembers',
        call: 'cph_committeeMembers',
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter]
    });
    var getBalance = new Method({
        name: 'getBalance',
        call: 'cph_getBalance',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: formatters.outputBigNumberFormatter
    });

    var getStorageAt = new Method({
        name: 'getStorageAt',
        call: 'cph_getStorageAt',
        params: 3,
        inputFormatter: [null, utils.toHex, formatters.inputDefaultBlockNumberFormatter]
    });

    var getCode = new Method({
        name: 'getCode',
        call: 'cph_getCode',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter]
    });

    var getBlock = new Method({
        name: 'getTxBlock',
        call: blockCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, function (val) { return !!val; }],
        outputFormatter: formatters.outputBlockFormatter
    });
    var getKeyBlockByNumber=new Method({
        name: 'getKeyBlockByNumber',
        call: 'cph_getKeyBlockByNumber',
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: formatters.outputKeyBlockFormatter,
    });
    var getTxBlockByNumber=new Method({
        name: 'getTxBlockByNumber',
        call: 'cph_getTxBlockByNumber',
        params: 3,
        inputFormatter: [formatters.inputBlockNumberFormatter,null,null],
        outputFormatter: formatters.outputBlockFormatter,
    });
    var getUncle = new Method({
        name: 'getUncle',
        call: uncleCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
        outputFormatter: formatters.outputBlockFormatter,

    });

    var getCompilers = new Method({
        name: 'getCompilers',
        call: 'cph_getCompilers',
        params: 0
    });

    var getBlockTransactionCount = new Method({
        name: 'getBlockTransactionCount',
        call: getBlockTransactionCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var getBlockUncleCount = new Method({
        name: 'getBlockUncleCount',
        call: uncleCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var getTransaction = new Method({
        name: 'getTransaction',
        call: 'cph_getTransactionByHash',
        params: 1,
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionFromBlock = new Method({
        name: 'getTransactionFromBlock',
        call: transactionFromBlockCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionReceipt = new Method({
        name: 'getTransactionReceipt',
        call: 'cph_getTransactionReceipt',
        params: 1,
        outputFormatter: formatters.outputTransactionReceiptFormatter
    });

    var getTransactionCount = new Method({
        name: 'getTransactionCount',
        call: 'cph_getTransactionCount',
        params: 2,
        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var sendRawTransaction = new Method({
        name: 'sendRawTransaction',
        call: 'cph_sendRawTransaction',
        params: 1,
        inputFormatter: [null]
    });

    var sendTransaction = new Method({
        name: 'sendTransaction',
        call: 'cph_sendTransaction',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });
    var batchTransaction = new Method({
        name: 'batchTransaction',
        call: 'cph_batchTransaction',
        params: 2,
        inputFormatter: [formatters.inputTransactionFormatter,utils.toDecimal]
    });
    var autoTransaction = new Method({
        name: 'autoTransaction',
        call: 'cph_autoTransaction',
        params: 2,
        inputFormatter: [utils.toDecimal, utils.toDecimal]
    });

    var signTransaction = new Method({
        name: 'signTransaction',
        call: 'cph_signTransaction',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    var sign = new Method({
        name: 'sign',
        call: 'cph_sign',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, null]
    });

    var call = new Method({
        name: 'call',
        call: 'cph_call',
        params: 2,
        inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter]
    });

    var estimateGas = new Method({
        name: 'estimateGas',
        call: 'cph_estimateGas',
        params: 1,
        inputFormatter: [formatters.inputCallFormatter],
        outputFormatter: utils.toDecimal
    });

    var compileSolidity = new Method({
        name: 'compile.solidity',
        call: 'cph_compileSolidity',
        params: 1
    });

    var compileLLL = new Method({
        name: 'compile.lll',
        call: 'cph_compileLLL',
        params: 1
    });

    var compileSerpent = new Method({
        name: 'compile.serpent',
        call: 'cph_compileSerpent',
        params: 1
    });

    var submitWork = new Method({
        name: 'submitWork',
        call: 'cph_submitWork',
        params: 3
    });

    var getWork = new Method({
        name: 'getWork',
        call: 'cph_getWork',
        params: 0
    });

    return [
        committeeMembers,
        getBalance,
        getStorageAt,
        getCode,
        getBlock,
        getKeyBlockByNumber,
        getTxBlockByNumber,
        getUncle,
        getCompilers,
        getBlockTransactionCount,
        getBlockUncleCount,
        getTransaction,
        getTransactionFromBlock,
        getTransactionReceipt,
        getTransactionCount,
        call,
        estimateGas,
        sendRawTransaction,
        signTransaction,
        sendTransaction,
        batchTransaction,
        autoTransaction,
        sign,
        compileSolidity,
        compileLLL,
        compileSerpent,
        submitWork,
        getWork
    ];
};


var properties = function () {
    return [
        new Property({
            name: 'coinbase',
            getter: 'cph_coinbase'
        }),
        new Property({
            name: 'mining',
            getter: 'cph_mining'
        }),
        new Property({
            name: 'hashrate',
            getter: 'cph_hashrate',
            outputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'syncing',
            getter: 'cph_syncing',
            outputFormatter: formatters.outputSyncingFormatter
        }),
        new Property({
            name: 'gasPrice',
            getter: 'cph_gasPrice',
            outputFormatter: formatters.outputBigNumberFormatter
        }),
        new Property({
            name: 'accounts',
            getter: 'cph_accounts'
        }),
        new Property({
            name: 'txBlockNumber',
            getter: 'cph_txBlockNumber',
            outputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'keyBlockNumber',
            getter: 'cph_keyBlockNumber',
            outputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'protocolVersion',
            getter: 'cph_protocolVersion'
        })
    ];
};

Cph.prototype.contract = function (abi) {
    var factory = new Contract(this, abi);
    return factory;
};

Cph.prototype.filter = function (options, callback, filterCreationErrorCallback) {
    return new Filter(options, 'cph', this._requestManager, watches.cph(), formatters.outputLogFormatter, callback, filterCreationErrorCallback);
};

Cph.prototype.namereg = function () {
    return this.contract(namereg.global.abi).at(namereg.global.address);
};

Cph.prototype.icapNamereg = function () {
    return this.contract(namereg.icap.abi).at(namereg.icap.address);
};

Cph.prototype.isSyncing = function (callback) {
    return new IsSyncing(this._requestManager, callback);
};

module.exports = Cph;
