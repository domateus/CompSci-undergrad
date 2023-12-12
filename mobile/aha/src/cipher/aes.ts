import { hexToAscii } from "./utils";

const SBOX = [
  [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76,
  ],
  [
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf,
    0x9c, 0xa4, 0x72, 0xc0,
  ],
  [
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1,
    0x71, 0xd8, 0x31, 0x15,
  ],
  [
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75,
  ],
  [
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3,
    0x29, 0xe3, 0x2f, 0x84,
  ],
  [
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39,
    0x4a, 0x4c, 0x58, 0xcf,
  ],
  [
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8,
  ],
  [
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21,
    0x10, 0xff, 0xf3, 0xd2,
  ],
  [
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d,
    0x64, 0x5d, 0x19, 0x73,
  ],
  [
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb,
  ],
  [
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62,
    0x91, 0x95, 0xe4, 0x79,
  ],
  [
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea,
    0x65, 0x7a, 0xae, 0x08,
  ],
  [
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a,
  ],
  [
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9,
    0x86, 0xc1, 0x1d, 0x9e,
  ],
  [
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9,
    0xce, 0x55, 0x28, 0xdf,
  ],
  [
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16,
  ],
];
const SBOX_INVERSE = [
  [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
    0x81, 0xf3, 0xd7, 0xfb,
  ],
  [
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44,
    0xc4, 0xde, 0xe9, 0xcb,
  ],
  [
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b,
    0x42, 0xfa, 0xc3, 0x4e,
  ],
  [
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
    0x6d, 0x8b, 0xd1, 0x25,
  ],
  [
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc,
    0x5d, 0x65, 0xb6, 0x92,
  ],
  [
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57,
    0xa7, 0x8d, 0x9d, 0x84,
  ],
  [
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
    0xb8, 0xb3, 0x45, 0x06,
  ],
  [
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03,
    0x01, 0x13, 0x8a, 0x6b,
  ],
  [
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce,
    0xf0, 0xb4, 0xe6, 0x73,
  ],
  [
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
    0x1c, 0x75, 0xdf, 0x6e,
  ],
  [
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e,
    0xaa, 0x18, 0xbe, 0x1b,
  ],
  [
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe,
    0x78, 0xcd, 0x5a, 0xf4,
  ],
  [
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
    0x27, 0x80, 0xec, 0x5f,
  ],
  [
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f,
    0x93, 0xc9, 0x9c, 0xef,
  ],
  [
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c,
    0x83, 0x53, 0x99, 0x61,
  ],
  [
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
    0x55, 0x21, 0x0c, 0x7d,
  ],
];

const ROUND_CONSTANT = [
  0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
];
const SHIFT_ROWS = [0, 1, 2, 3];
const SIZE_OF_AES_KEY_AND_STATE = 16;
const WORD_BYTELENGTH = 4;
const HEXBYTES = 2;
const ROUND_KEY_WORDS = 4;
const NUMBER_OF_AES_ROUNDS = 10;

export const zip = <T, U = T>(a: T[], b: U[]) => a.map((k, i) => [k, b[i]]);

function keyIntoByteArray(key: string) {
  const words: string[] = [];
  for (let i = 0; i < WORD_BYTELENGTH; i++) {
    const word = key.slice(i * 8, i * 8 + 8).toString();
    words.push(word);
  }
  return words;
}

function transpondString(str: string) {
  if (str.length !== 32) {
    alert("Byte length is not 16 Byte!");
  }
  const array: string[] = [];
  for (let i = 0; i < str.length / 4 / 2; i++) {
    const temp =
      str[i * 2] +
      str[i * 2 + 1] +
      str[i * 2 + 8] +
      str[i * 2 + 9] +
      str[i * 2 + 16] +
      str[i * 2 + 17] +
      str[i * 2 + 24] +
      str[i * 2 + 25];
    array.push(temp);
  }
  return array;
}

function transpondStringArray(arr: string[]) {
  const w0 = arr[0];
  const w1 = arr[1];
  const w2 = arr[2];
  const w3 = arr[3];

  let str: string = "";
  for (let i = 0; i < 4; i++) {
    str += w0.slice(i * 2, i * 2 + 2);
    str += w1.slice(i * 2, i * 2 + 2);
    str += w2.slice(i * 2, i * 2 + 2);
    str += w3.slice(i * 2, i * 2 + 2);
  }
  return str;
}

function wordIntoByteArray(word: string) {
  const byteArray: number[] = [];
  for (let i = 0; i < word.length / HEXBYTES; i++) {
    const byte = word.slice(i * HEXBYTES, i * HEXBYTES + HEXBYTES);
    byteArray.push(parseInt(byte, 16));
  }
  return byteArray;
}

function substitute(word: string, inverse: boolean) {
  const byteArray: number[] = [];
  for (let i = 0; i < word.length / HEXBYTES; i++) {
    const byte = word.slice(i * HEXBYTES, i * HEXBYTES + HEXBYTES);
    byteArray.push(substituteByte(byte!, inverse));
  }
  return byteArray;
}

function byteArrayIntoHex(word: number[]) {
  let hexString = "";
  for (let i = 0; i < word.length; i++) {
    let s = word[i].toString(16);
    if (s.length === 1) {
      s = 0 + s;
    }
    hexString += s;
  }
  return hexString;
}

function leftShiftString(str: string, leftShifts: number): string {
  let newStr = "";
  leftShifts = leftShifts % str.length;
  newStr = str.slice(leftShifts) + str.slice(0, leftShifts);
  return newStr;
}
function rightShiftString(str: string, rightShifts: number): string {
  let newStr = "";
  rightShifts = rightShifts % str.length;
  newStr =
    str.slice(str.length - rightShifts) +
    str.slice(0, str.length - rightShifts);
  return newStr;
}

function substituteByte(byte: string, inverse: boolean) {
  if (byte.length !== HEXBYTES) {
    alert("Byte length is not 1 Byte!");
  }
  const x = parseInt(byte[0], 16);
  const y = parseInt(byte[1], 16);
  return inverse ? SBOX_INVERSE[x][y] : SBOX[x][y];
}

function addRoundConstant(word: number[], round: number) {
  const roundConstant = ROUND_CONSTANT[round];
  const xorByte = word[0];
  return roundConstant ^ xorByte;
}

function gFunction(word: string, round: number) {
  if (
    word.length !==
    (SIZE_OF_AES_KEY_AND_STATE / WORD_BYTELENGTH) * HEXBYTES
  ) {
    alert("Word length is not 4 Bytes!");
  }
  const numberLeftShifts = 1;
  const shiftedWord = leftShiftString(word, HEXBYTES * numberLeftShifts);
  let substitutedWord = substitute(shiftedWord, false);
  substitutedWord[0] = addRoundConstant(substitutedWord, round);
  return substitutedWord;
}

export function keyExpansion(key: string) {
  if (key.length !== SIZE_OF_AES_KEY_AND_STATE * 2) {
    alert("Key length is not 16 Bytes!");
  }

  const words: string[] = keyIntoByteArray(key);

  let round = 0;
  for (let i = 4; i < 44; i++) {
    const xorValue1 = wordIntoByteArray(words[i - 4]);
    let xorValue2;
    if (i % 4 === 0) {
      xorValue2 = gFunction(words[i - 1], round);
      round++;
    } else {
      xorValue2 = wordIntoByteArray(words[i - 1]);
    }

    const xorResult = zip(xorValue1, xorValue2).map(([x, y]) => x ^ y);
    words.push(byteArrayIntoHex(xorResult));
  }
  return words.join("");
}

function addRoundKey(key: string, plaintext: string) {
  if (key.length !== ROUND_KEY_WORDS * WORD_BYTELENGTH * HEXBYTES) {
    alert("Key length is not 16 Bytes!");
  }
  const xorArray = zip(key.split(""), plaintext.split(""));
  const result = xorArray.map(([y, z]) =>
    (parseInt(y, 16) ^ parseInt(z, 16)).toString(16)
  );
  return result.join("");
}

function shiftRows(state: string[], inverse: boolean) {
  const words: string[] = [];

  for (let i = 0; i < SHIFT_ROWS.length; i++) {
    const word = state[i];
    let shiftedWord: string = "";
    //if it is no inverse shift rows
    if (!inverse) {
      shiftedWord = leftShiftString(word, i * HEXBYTES);
    }
    //if it is inverse shift rows
    else if (inverse) {
      shiftedWord = rightShiftString(word, i * HEXBYTES);
    }
    words.push(shiftedWord);
  }
  return transpondString(words.join("")).join("");
}

function gmult(a: number, b: number) {
  let p = 0,
    i = 0,
    hbs = 0;
  for (i = 0; i < 8; i++) {
    if (b & 1) {
      p ^= a;
    }
    hbs = a & 0x80;
    a <<= 1;
    if (hbs) a ^= 0x1b; // 0000 0001 0001 1011
    b >>= 1;
  }
  return p % 256;
}

export function mix_columns(state: string, inverse: boolean) {
  const newState: string[][] = [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ];
  const matrixState: number[][] = [];
  let transposedState = transpondString(state);

  for (let i = 0; i < 4; i++) {
    const word = transposedState[i].match(/.{2}/g) ?? [];
    const newWord = word.map((v) => parseInt(v, 16));
    matrixState.push(newWord);
  }

  for (let i = 0; i < 4; i++) {
    const s0 = matrixState[0][i];
    const s1 = matrixState[1][i];
    const s2 = matrixState[2][i];
    const s3 = matrixState[3][i];

    if (!inverse) {
      newState[0][i] = (gmult(2, s0) ^ gmult(3, s1) ^ s2 ^ s3).toString(16);
      newState[1][i] = (s0 ^ gmult(2, s1) ^ gmult(3, s2) ^ s3).toString(16);
      newState[2][i] = (s0 ^ s1 ^ gmult(2, s2) ^ gmult(3, s3)).toString(16);
      newState[3][i] = (gmult(3, s0) ^ s1 ^ s2 ^ gmult(2, s3)).toString(16);
    } else {
      newState[0][i] = (
        gmult(0x0e, s0) ^
        gmult(0x0b, s1) ^
        gmult(0x0d, s2) ^
        gmult(0x09, s3)
      ).toString(16);
      newState[1][i] = (
        gmult(0x09, s0) ^
        gmult(0x0e, s1) ^
        gmult(0x0b, s2) ^
        gmult(0x0d, s3)
      ).toString(16);
      newState[2][i] = (
        gmult(0x0d, s0) ^
        gmult(0x09, s1) ^
        gmult(0x0e, s2) ^
        gmult(0x0b, s3)
      ).toString(16);
      newState[3][i] = (
        gmult(0x0b, s0) ^
        gmult(0x0d, s1) ^
        gmult(0x09, s2) ^
        gmult(0x0e, s3)
      ).toString(16);
    }
  }
  //adding missing leading zeros
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (newState[i][j].length === 1) {
        newState[i][j] = "0" + newState[i][j];
      }
    }
  }
  return transpondString(newState.map((a) => a.join("")).join("")).join("");
}

function reverseExpandedKey(key: string) {
  const reverseKey = key.match(/.{32}/g) ?? [];
  return reverseKey.reverse().join("");
}

function encrypt(plaintext: string, key: string) {
  if (key.length !== SIZE_OF_AES_KEY_AND_STATE * HEXBYTES) {
    alert("Key length is not 16 Bytes!");
  }
  if (plaintext.length !== SIZE_OF_AES_KEY_AND_STATE * HEXBYTES) {
    alert("Plaintext length is not 16 Bytes!");
  }

  //expand key
  const expandedKey = keyExpansion(key);

  //add the first round key
  const firstRoundKey = expandedKey.slice(
    0,
    ROUND_KEY_WORDS * WORD_BYTELENGTH * HEXBYTES
  );
  let tempState = addRoundKey(firstRoundKey, plaintext);

  for (let i = 0; i < NUMBER_OF_AES_ROUNDS; i++) {
    //substitute bytes
    const substitutedState = byteArrayIntoHex(substitute(tempState, false));
    //shift rows
    let shiftedState = shiftRows(transpondString(substitutedState), false);
    //last round, there will be no mixed columns
    if (i < NUMBER_OF_AES_ROUNDS - 1) {
      //mix columns
      shiftedState = mix_columns(shiftedState, false);
    }
    //add round key
    const roundKey = expandedKey.slice(
      firstRoundKey.length * (i + 1),
      firstRoundKey.length * (i + 1) + firstRoundKey.length
    );
    const addedRoundKey = addRoundKey(roundKey, shiftedState);
    tempState = addedRoundKey;
  }
  return tempState;
}

function decrypt(ciphertext: string, key: string) {
  if (key.length !== SIZE_OF_AES_KEY_AND_STATE * HEXBYTES) {
    alert("Key length is not 16 Bytes!");
  }
  if (ciphertext.length !== SIZE_OF_AES_KEY_AND_STATE * HEXBYTES) {
    alert("Plaintext length is not 16 Bytes!");
  }

  //expand key and revert it
  const expandedKey = reverseExpandedKey(keyExpansion(key));
  reverseExpandedKey(reverseExpandedKey(expandedKey));

  //add first round key
  let roundKey = expandedKey.slice(
    0,
    ROUND_KEY_WORDS * WORD_BYTELENGTH * HEXBYTES
  );
  let tempState = addRoundKey(roundKey, ciphertext);

  for (let i = 0; i < NUMBER_OF_AES_ROUNDS; i++) {
    //shift rows
    const shiftedState = shiftRows(transpondString(tempState), true);

    //substitute state
    const substitutedState = substitute(shiftedState, true);
    let substitutedStateStr = substitutedState.map((c) => c.toString(16));
    for (let i = 0; i < substitutedStateStr.length; i++) {
      if (substitutedStateStr[i].length === 1) {
        substitutedStateStr[i] = "0" + substitutedStateStr[i];
      }
    }

    //add round key
    roundKey = expandedKey.slice(
      roundKey.length * (i + 1),
      roundKey.length * (i + 1) + roundKey.length
    );
    tempState = addRoundKey(roundKey, substitutedStateStr.join(""));

    //last round, there will be no mixed columns
    if (i < NUMBER_OF_AES_ROUNDS - 1) {
      //mix columns
      tempState = transpondStringArray(
        transpondString(mix_columns(tempState, true))
      );
    }
  }
  return tempState;
}

function processInputText(hexString: string) {
  const remindingChars = hexString.length % 32;

  const plaintexts: string[] = [];
  const completewords = hexString.match(/.{32}/g);

  //fill complete words that need no padding
  if (!(completewords === null)) {
    for (let i = 0; i < completewords!.length; i++) {
      plaintexts.push(completewords![i]);
    }
  }
  //add plaintext that needs padding
  let paddingWord = hexString.slice(hexString.length - remindingChars);
  plaintexts.push(paddingWord.padEnd(32, "0"));
  return plaintexts;
}

export const ecbEncryption: Encrypter = ({ plaintext, key }) => {
  if (key.length !== 32) {
    throw new Error("Key length is not 16 Bytes!");
  }
  const input = processInputText(plaintext);
  const ciphertexts: string[] = [];

  for (let i = 0; i < input.length; i++) {
    ciphertexts.push(encrypt(input[i], key));
  }
  return ciphertexts.join("");
};

export const ecbDecryption: Decrypter = ({ ciphertext, key }) => {
  if (key.length !== 32) {
    throw new Error("Key length is not 16 Bytes!");
  }
  if (ciphertext.length % 32 !== 0) {
    alert("Ciphertext block length are not 16 Bytes!");
  }

  const ciphertexts = ciphertext.match(/.{32}/g) ?? [];
  const decryptedCiphers: string[] = [];

  for (let i = 0; i < ciphertexts!.length; i++) {
    decryptedCiphers.push(decrypt(ciphertexts![i], key));
  }
  return hexToAscii(decryptedCiphers!.join(""));
};
