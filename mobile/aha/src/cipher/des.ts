// Data Encryption Standard (DES)

import { asciiToHex, hexToAscii } from "./utils";

function stringToArrayOfBits(str: string) {
  const arrayOfBytes = [];

  for (let c of str) {
    let byte = c.charCodeAt(0).toString(2);
    if (byte.length < 8) {
      byte = "0".repeat(8 - byte.length) + byte;
    }
    arrayOfBytes.push(byte);
  }

  const arrayOfBits = arrayOfBytes.join("").split("");
  return arrayOfBits.map((bit) => parseInt(bit));
}

function genDESKeys(key: string) {
  const PC1 = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35,
    27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46,
    38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
  ];

  const LCS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

  const PC2 = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27,
    20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32,
  ];

  const keyBits = stringToArrayOfBits(key);

  // Permuted Choice 1
  const keyBits_PC1 = PC1.map((i) => keyBits[i - 1]);

  // Left Circular Shift Schedule
  const keyBits_PC1_LCS = [];
  let lastKey = keyBits_PC1;
  for (let shift of LCS) {
    lastKey = lastKey
      .slice(shift, lastKey.length)
      .concat(lastKey.slice(0, shift));
    keyBits_PC1_LCS.push(lastKey);
  }

  // Permuted Choice 2
  const keyBits_PC1_LCS_PC2 = keyBits_PC1_LCS.map((key) =>
    PC2.map((i) => key[i - 1])
  );

  return keyBits_PC1_LCS_PC2;
}

function initialPermutation(bits: number[]) {
  const IP = [
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46,
    38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9,
    1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47,
    39, 31, 23, 15, 7,
  ];

  return IP.map((i) => bits[i - 1]);
}

function sBox(bits: number[]) {
  const S1 = [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
  ];

  const S2 = [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
  ];

  const S3 = [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
  ];

  const S4 = [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
  ];

  const S5 = [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
  ];

  const S6 = [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
  ];

  const S7 = [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
  ];

  const S8 = [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
  ];

  const S = [S1, S2, S3, S4, S5, S6, S7, S8];

  const bitsArray = [];
  for (let i = 0; i < bits.length; i += 6) {
    bitsArray.push(bits.slice(i, i + 6));
  }

  const bitsArrayS = bitsArray.map((bits, i) => {
    const row = parseInt(bits[0] + "" + bits[5], 2);
    const col = parseInt(bits.slice(1, 5).join(""), 2);
    const s = S[i][row][col];
    return s.toString(2).padStart(4, "0").split("");
  });

  return bitsArrayS.flat().map((bit) => parseInt(bit));
}

function desRound(block: number[], key: number[]) {
  const E = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15,
    16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28,
    29, 28, 29, 30, 31, 32, 1,
  ];

  const P = [
    16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14,
    32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25,
  ];

  const block_Left = block.slice(0, 32);
  const block_Right = block.slice(32, 64);

  // Expansion Permutation
  const block_E = E.map((i) => block_Right[i - 1]);

  // XOR with key
  const block_E_XORkey = block_E.map((bit, i) => bit ^ key[i]);

  // S-Box
  const block_E_XORkey_S = sBox(block_E_XORkey);

  // Permutation
  const block_E_XORkey_S_P = P.map((i) => block_E_XORkey_S[i - 1]);

  // XOR with left block
  const block_E_XORkey_S_P_XOR_block_Left = block_E_XORkey_S_P.map(
    (bit, i) => bit ^ block_Left[i]
  );

  return block_Right.concat(block_E_XORkey_S_P_XOR_block_Left);
}

function inversePermutation(block: number[]) {
  const IP_1 = [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14,
    54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60,
    28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41,
    9, 49, 17, 57, 25,
  ];

  return IP_1.map((i) => block[i - 1]);
}

function bitsToString(bits: number[]) {
  let str = "";
  for (let i = 0; i < bits.length; i += 8) {
    const charCode = bits.slice(i, i + 8).join("");
    str += String.fromCharCode(parseInt(charCode, 2));
  }
  return str;
}

export const encrypt: Encrypter = ({ plaintext, key }) => {
  const parsedKey = hexToAscii(key);
  let parsedText = hexToAscii(plaintext);
  if (parsedKey.length !== 8) {
    return "ERROR: Key must be 8 characters long!";
  }

  const keys = genDESKeys(parsedKey);

  // Pad plaintext to 64 bits multiples
  if (parsedText.length % 8 !== 0) {
    parsedText = parsedText + " ".repeat(8 - (parsedText.length % 8));
  }

  const plaintextBits = stringToArrayOfBits(parsedText);

  // Split plaintext into 64-bit blocks
  const plaintextBlockArray = [];
  for (let i = 0; i < plaintextBits.length; i += 64) {
    plaintextBlockArray.push(plaintextBits.slice(i, i + 64));
  }

  // Encrypt each block
  const ciphertextArray = plaintextBlockArray.map((block) => {
    // Initial Permutation
    const block_IP = initialPermutation(block);
    let block_IP_rounds = block_IP;
    for (let i = 0; i < 16; i++) {
      block_IP_rounds = desRound(block_IP_rounds, keys[i]);
    }
    // 32-bit swap
    const block_IP_rounds_swap = block_IP_rounds
      .slice(32, 64)
      .concat(block_IP_rounds.slice(0, 32));
    // Inverse Initial Permutation
    const block_IP_rounds_swap_IP = inversePermutation(block_IP_rounds_swap);

    return block_IP_rounds_swap_IP;
  });

  return asciiToHex(
    ciphertextArray.map((block) => bitsToString(block)).join("")
  );
};

export const decrypt: Decrypter = ({ ciphertext, key }) => {
  const parsedKey = hexToAscii(key);
  let parsedText = hexToAscii(ciphertext);
  if (!ciphertext || ciphertext.length === 0) {
    return "";
  }

  const keys = genDESKeys(parsedKey);

  // Pad plaintext to 64 bits multiples
  if (parsedText.length % 8 !== 0) {
    parsedText = parsedText + " ".repeat(8 - (parsedText.length % 8));
  }

  const ciphertextBits = stringToArrayOfBits(parsedText);

  // Split plaintext into 64-bit blocks
  const ciphertextBlockArray = [];

  for (let i = 0; i < ciphertextBits.length; i += 64) {
    ciphertextBlockArray.push(ciphertextBits.slice(i, i + 64));
  }

  // Decrypt each block
  const plaintextArray = ciphertextBlockArray.map((block) => {
    // Initial Permutation
    const block_IP = initialPermutation(block);
    let block_IP_rounds = block_IP;
    for (let i = 0; i < 16; i++) {
      block_IP_rounds = desRound(block_IP_rounds, keys[15 - i]);
    }
    // 32-bit swap ???
    const block_IP_rounds_swap = block_IP_rounds
      .slice(32, 64)
      .concat(block_IP_rounds.slice(0, 32));
    // Inverse Initial Permutation
    const block_IP_rounds_swap_IP = inversePermutation(block_IP_rounds_swap);

    return block_IP_rounds_swap_IP;
  });

  return plaintextArray.map((block) => bitsToString(block)).join("");
};

export const generateKey: RandomKeyGenerator = () => {
  const key = [];
  for (let i = 0; i < 8; i++) {
    const value = Math.floor(Math.random() * 255)
      .toString(16)
      .padStart(2, "0");
    key.push(value);
  }
  return key.join("");
};
