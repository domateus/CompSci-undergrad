// Hill Cipher using pre-determined Key Matrices.
import * as utils from "./utils";
const { multiply } = require("mathjs");

// Pre-determined Key Matrices and their Inverse Matrices
export const KEYS = {
  // From: Stallings (2015, p.32)
  KEY1: [
    [17, 17, 5],
    [21, 18, 21],
    [2, 2, 19],
  ],
  INV1: [
    [4, 9, 15],
    [15, 17, 6],
    [24, 0, 17],
  ],
  // From: https://en.wikipedia.org/wiki/Hill_cipher
  KEY2: [
    [6, 24, 1],
    [13, 16, 10],
    [20, 17, 15],
  ],
  INV2: [
    [8, 5, 10],
    [21, 8, 21],
    [21, 12, 8],
  ],
  // From: https://www.cybrary.it/blog/0p3n/learn-hill-cipher-3x3-matrix-multiplicative-inverse-example/
  KEY3: [
    [3, 10, 20],
    [20, 9, 17],
    [9, 4, 17],
  ],
  INV3: [
    [11, 22, 14],
    [7, 9, 21],
    [17, 0, 3],
  ],
};

// Encryption
export const encrypt: Encrypter = ({ plaintext, key }) => {
  let text = utils
    .hexToAscii(plaintext)
    .toUpperCase()
    .split("")
    .filter((c) => c.match(/[A-Z]/))
    .join("");

  if (!text || text === "") {
    return "";
  }

  if (text.length % 3 !== 0) {
    text += "X".repeat(3 - (text.length % 3));
  }

  const textMatrix = text
    .match(/.{3}/g)!
    .map((c) =>
      c.split("").map((c) => c.charCodeAt(0) - utils.ASCII_ALPHABET_INDEX)
    );

  let keyMatrix: number[][] = [];

  if (utils.hexToAscii(key) === "KEY1") {
    keyMatrix = KEYS.KEY1;
  } else if (utils.hexToAscii(key) === "KEY2") {
    keyMatrix = KEYS.KEY2;
  } else if (utils.hexToAscii(key) === "KEY3") {
    keyMatrix = KEYS.KEY3;
  } else {
    throw new Error("INVALID KEY! Expected values: 'KEY1', 'KEY2' or 'KEY3'.");
  }

  const productMatrix = multiply(textMatrix, keyMatrix);
  const moduloMatrix = productMatrix.map((row: any[]) =>
    row.map((c) => (c % 26) + utils.ASCII_ALPHABET_INDEX)
  );

  return utils.asciiToHex(
    moduloMatrix
      .map((row: any[]) => row.map((c) => String.fromCharCode(c)).join(""))
      .join("")
  );
};

// Decryption
export const decrypt: Decrypter = ({ ciphertext, key }) => {
  let text = utils.hexToAscii(ciphertext);

  if (!text || text === "") {
    return "";
  }

  if (text.length % 3 !== 0) {
    text += "Z".repeat(3 - (text.length % 3));
  }

  const textMatrix = text
    .match(/.{3}/g)!
    .map((row) =>
      row.split("").map((c) => c.charCodeAt(0) - utils.ASCII_ALPHABET_INDEX)
    );

  let invKey: number[][] = [];

  if (utils.hexToAscii(key) === "KEY1") {
    invKey = KEYS.INV1;
  } else if (utils.hexToAscii(key) === "KEY2") {
    invKey = KEYS.INV2;
  } else if (utils.hexToAscii(key) === "KEY3") {
    invKey = KEYS.INV3;
  } else {
    throw new Error("INVALID KEY! Expected values: 'KEY1', 'KEY2' or 'KEY3'.");
  }

  const productMatrix = multiply(textMatrix, invKey);
  const moduloMatrix = productMatrix.map((row: any[]) =>
    row.map((c) => (c % 26) + utils.ASCII_ALPHABET_INDEX)
  );

  return moduloMatrix
    .map((row: any[]) => row.map((c) => String.fromCharCode(c)).join(""))
    .join("");
};

export const generateKey: RandomKeyGenerator = () => {
  const key = (Math.floor(Math.random() * 3) + 1) % 4;
  return utils.asciiToHex(`KEY${key}`);
};
