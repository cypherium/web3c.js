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
 * @file web3c.js
 * @authors:
 *   Jeffrey Wilcke <jeff@cphdev.com>
 *   Marek Kotewicz <marek@cphdev.com>
 *   Marian Oancea <marian@cphdev.com>
 *   Fabian Vogelsteller <fabian@cphdev.com>
 *   Gav Wood <g@cphdev.com>
 * @date 2014
 */

var RequestManager = require('./web3c/requestmanager');
var Iban = require('./web3c/iban');
var Cph = require('./web3c/methods/cph');
var DB = require('./web3c/methods/db');
var Shh = require('./web3c/methods/shh');
var Net = require('./web3c/methods/net');
var Personal = require('./web3c/methods/personal');
var Swarm = require('./web3c/methods/swarm');
var Settings = require('./web3c/settings');
var version = require('./version.json');
var utils = require('./utils/utils');
var sha3 = require('./utils/sha3');
var extend = require('./web3c/extend');
var Batch = require('./web3c/batch');
var Property = require('./web3c/property');
var HttpProvider = require('./web3c/httpprovider');
var IpcProvider = require('./web3c/ipcprovider');
var BigNumber = require('bignumber.js');



function Web3c (provider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this.cph = new Cph(this);
    this.db = new DB(this);
    this.shh = new Shh(this);
    this.net = new Net(this);
    this.personal = new Personal(this);
    this.bzz = new Swarm(this);
    this.settings = new Settings();
    this.version = {
        api: version.version
    };
    this.providers = {
        HttpProvider: HttpProvider,
        IpcProvider: IpcProvider
    };
    this._extend = extend(this);
    this._extend({
        properties: properties()
    });
}

// expose providers on the class
Web3c.providers = {
    HttpProvider: HttpProvider,
    IpcProvider: IpcProvider
};

Web3c.prototype.setProvider = function (provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
};

Web3c.prototype.reset = function (keepIsSyncing) {
    this._requestManager.reset(keepIsSyncing);
    this.settings = new Settings();
};

Web3c.prototype.BigNumber = BigNumber;
Web3c.prototype.toHex = utils.toHex;
Web3c.prototype.toAscii = utils.toAscii;
Web3c.prototype.toUtf8 = utils.toUtf8;
Web3c.prototype.fromAscii = utils.fromAscii;
Web3c.prototype.fromUtf8 = utils.fromUtf8;
Web3c.prototype.toDecimal = utils.toDecimal;
Web3c.prototype.fromDecimal = utils.fromDecimal;
Web3c.prototype.toBigNumber = utils.toBigNumber;
Web3c.prototype.toWei = utils.toWei;
Web3c.prototype.fromWei = utils.fromWei;
Web3c.prototype.isAddress = utils.isAddress;
Web3c.prototype.isChecksumAddress = utils.isChecksumAddress;
Web3c.prototype.toChecksumAddress = utils.toChecksumAddress;
Web3c.prototype.isIBAN = utils.isIBAN;
Web3c.prototype.padLeft = utils.padLeft;
Web3c.prototype.padRight = utils.padRight;


Web3c.prototype.sha3 = function(string, options) {
    return '0x' + sha3(string, options);
};

/**
 * Transforms direct icap to address
 */
Web3c.prototype.fromICAP = function (icap) {
    var iban = new Iban(icap);
    return iban.address();
};

var properties = function () {
    return [
        new Property({
            name: 'version.node',
            getter: 'web3_clientVersion'
        }),
        new Property({
            name: 'version.network',
            getter: 'net_version',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.cypherium',
            getter: 'cph_protocolVersion',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.whisper',
            getter: 'shh_version',
            inputFormatter: utils.toDecimal
        })
    ];
};

Web3c.prototype.isConnected = function(){
    return (this.currentProvider && this.currentProvider.isConnected());
};

Web3c.prototype.createBatch = function () {
    return new Batch(this);
};

module.exports = Web3c;

