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
/** @file config.js
 * @authors:
 *   Marek Kotewicz <marek@cphdev.com>
 * @date 2015
 */

/**
 * Utils
 * 
 * @module utils
 */

/**
 * Utility functions
 * 
 * @class [utils] config
 * @constructor
 */


/// required to define CPH_BIGNUMBER_ROUNDING_MODE
var BigNumber = require('bignumber.js');

var CPH_UNITS = [
    'wei',
    'kwei',
    'Mwei',
    'Gwei',
    'szabo',
    'finney',
    'femtocpher',
    'picocpher',
    'nanocpher',
    'microcpher',
    'millicpher',
    'nano',
    'micro',
    'milli',
    'cpher',
    'grand',
    'Mcpher',
    'Gcpher',
    'Tcpher',
    'Pcpher',
    'Ecpher',
    'Zcpher',
    'Ycpher',
    'Ncpher',
    'Dcpher',
    'Vcpher',
    'Ucpher'
];

module.exports = {
    CPH_PADDING: 32,
    CPH_SIGNATURE_LENGTH: 4,
    CPH_UNITS: CPH_UNITS,
    CPH_BIGNUMBER_ROUNDING_MODE: { ROUNDING_MODE: BigNumber.ROUND_DOWN },
    CPH_POLLING_TIMEOUT: 1000/2,
    defaultBlock: 'latest',
    defaultAccount: undefined
};

