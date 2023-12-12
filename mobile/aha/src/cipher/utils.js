"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var jsbn_1 = require("jsbn");
var node_forge_1 = require("node-forge");
exports.LIST_PRIMES = [
    7n,
    11n,
    13n,
    17n,
    19n,
    23n,
    29n,
    31n,
    37n,
    41n,
    43n,
    47n,
    53n,
    59n,
    61n,
    67n,
    71n,
    73n,
    79n,
    83n,
    89n,
    97n,
    101n,
    103n,
    107n,
    109n,
    113n,
    127n,
    131n,
    137n,
    139n,
    149n,
    151n,
    157n,
    163n,
    167n,
    173n,
    179n,
    181n,
    191n,
    193n,
    197n,
    199n,
    211n,
    223n,
    227n,
    229n,
    233n,
    239n,
    241n,
    251n,
    257n,
    263n,
    269n,
    271n,
    277n,
    281n,
    283n,
    293n,
    307n,
    311n,
    313n,
    317n,
    331n,
    337n,
    347n,
    349n,
    353n,
    359n,
    367n,
    373n,
    379n,
    383n,
    389n,
    397n,
];
exports.LIST_PRIMES_SIZE = exports.LIST_PRIMES.length;
exports.ASCII_TABLE_SIZE = 127n;
exports.number_ASCII_TABLE_SIZE = Number(exports.ASCII_TABLE_SIZE);
exports.ASCII_ALPHABET_INDEX = 65;
function getAsciiCodes(s) {
    return s.split("").map(function (c) { return BigInt(c.charCodeAt(0)); });
}
exports.getAsciiCodes = getAsciiCodes;
exports.zip = function (a, b) { return a.map(function (k, i) { return [k, b[i]]; }); };
function generateRandomString(length) {
    var getRandomBigInts = function () {
        return __spread(window.crypto.getRandomValues(new Uint8Array(length))).map(function (n) {
            return (n % exports.number_ASCII_TABLE_SIZE).toString(16).padStart(2, "0");
        });
    };
    var result = getRandomBigInts().join("");
    return result;
}
exports.generateRandomString = generateRandomString;
function generatePrime(bytes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        node_forge_1["default"].prime.generateProbablePrime(bytes * 8, function (e, p) {
                            if (e) {
                                reject(e);
                            }
                            else {
                                var v = new jsbn_1.BigInteger(p.toString(16), 16);
                                resolve(v);
                            }
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.generatePrime = generatePrime;
function gcd(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}
exports.gcd = gcd;
function extendedEuclidean(a, b) {
    if (b === 0n) {
        return [1n, 0n, a];
    }
    var _a = __read(extendedEuclidean(b, a % b), 3), x = _a[0], y = _a[1], gcd = _a[2];
    return [y, x - (a / b) * y, gcd];
}
exports.extendedEuclidean = extendedEuclidean;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
exports.getRandomInt = getRandomInt;
function getRandomPrime(cap) {
    if (cap === void 0) { cap = 1; }
    var arrayIndex = getRandomInt(0, exports.LIST_PRIMES.length - cap);
    var randomPrime = exports.LIST_PRIMES[arrayIndex];
    return randomPrime;
}
exports.getRandomPrime = getRandomPrime;
function bigintToBigInteger(bigint) {
    return new jsbn_1.BigInteger(bigint.toString().replace("n", ""), 10);
}
exports.bigintToBigInteger = bigintToBigInteger;
function stringToNumber(plaintext) {
    return BigInt(plaintext
        .split("")
        .map(function (c) { return c.charCodeAt(0); })
        .join(""));
}
exports.stringToNumber = stringToNumber;
function asciiToHex(str, x) {
    if (x === void 0) { x = 1; }
    var arr1 = [];
    var charSize = 2 * x;
    for (var n = 0, l = str.length; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16).padStart(charSize, "0");
        arr1.push(hex);
    }
    return arr1.join("");
}
exports.asciiToHex = asciiToHex;
function hexToBigInteger(hex) {
    return new jsbn_1.BigInteger(hex, 16);
}
exports.hexToBigInteger = hexToBigInteger;
function hexToAscii(hex, x) {
    if (x === void 0) { x = 1; }
    var str = "";
    var charSize = 2 * x;
    for (var n = 0; n < hex.length; n += charSize) {
        str += String.fromCharCode(parseInt(hex.substr(n, charSize), 16));
    }
    return str;
}
exports.hexToAscii = hexToAscii;
function hexToXByteBigIntegerArray(hex, x) {
    var values = [];
    var bigintBytesSize = 2 * x;
    for (var i = 0; i < hex.length; i += bigintBytesSize) {
        values.push(hexToBigInteger(hex.slice(i, i + bigintBytesSize)));
    }
    return values;
}
exports.hexToXByteBigIntegerArray = hexToXByteBigIntegerArray;
function bigIntegerToHex(bigint) {
    return bigint.toString(16);
}
exports.bigIntegerToHex = bigIntegerToHex;
function bigIntegerToXBytePaddedHex(bigint, x) {
    return bigint.toString(16).padStart(2 * x, "0");
}
exports.bigIntegerToXBytePaddedHex = bigIntegerToXBytePaddedHex;
function bigIntToXBytePaddedHex(bigint, x) {
    return bigint.toString(16).padStart(2 * x, "0");
}
exports.bigIntToXBytePaddedHex = bigIntToXBytePaddedHex;
function modPow(value, exponent, modulus) {
    var result = jsbn_1.BigInteger.ONE;
    while (exponent > jsbn_1.BigInteger.ZERO) {
        if (exponent.mod(new jsbn_1.BigInteger("2")) === jsbn_1.BigInteger.ONE) {
            result = result.multiply(value).mod(modulus);
        }
        exponent = exponent.shiftRight(1);
        value = value.pow(2).mod(modulus);
    }
    return result;
}
exports.modPow = modPow;
function multiplyHexStrings(a, b) {
    var x = new jsbn_1.BigInteger(a, 16);
    var y = new jsbn_1.BigInteger(b, 16);
    var c = x.multiply(y);
    return c.toString(16);
}
exports.multiplyHexStrings = multiplyHexStrings;
