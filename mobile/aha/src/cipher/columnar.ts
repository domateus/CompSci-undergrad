// Columnar Cipher

import { asciiToHex, hexToAscii } from "./utils";

// Generate the key matrix from the key string for Playfair Cipher
export const genColumnarKey: ColumnarKeyGenerator = ({ key }) => {
  // Cleaning up key (numbers only, no repetitions)
  key = key.toUpperCase().replace(/[^0-9]/g, "");
  // Removing duplicated numbers from key
  return key
    .split("")
    .filter((item, pos, self) => self.indexOf(item) === pos)
    .map((c) => parseInt(c));
};

// Encryption
export const encrypt: Encrypter = ({ plaintext, key }) => {
  const order: number[] = genColumnarKey({ key: hexToAscii(key) });

  // Cleaning up plaintext
  plaintext = hexToAscii(plaintext)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  // Padding plaintext with Xs if it is not a multiple of the key length
  if (plaintext.length % order.length != 0) {
    plaintext += "X".repeat(order.length - (plaintext.length % order.length));
  }
  // Calculating the number of cols to pair with key
  const numCols: number = order.length;
  // Calculating the number of rows to split the plaintext into
  const numRows: number = plaintext.length / numCols;

  // Split the plaintext into numRows of the size of numCols
  const columns: string[][] = [];
  for (let i: number = 0; i < numRows; i++) {
    columns.push(plaintext.slice(i * numCols, (i + 1) * numCols).split(""));
  }

  // Rearrange columns into rows according to key
  let ciphertext = [];

  for (let i: number = 0; i < numCols; i++) {
    const j = order.indexOf(i);
    for (let k: number = 0; k < numRows; k++) {
      ciphertext.push(columns[k][j]);
    }
  }

  return asciiToHex(ciphertext.join(""));
};

// Decryption
export const decrypt: Decrypter = ({ ciphertext, key }) => {
  if (!ciphertext || ciphertext.length === 0) {
    return "";
  }

  const parsedText = hexToAscii(ciphertext);
  const order: number[] = genColumnarKey({ key: hexToAscii(key) });
  // Calculating the number of rows to pair with key
  const numRows: number = order.length;
  // Calculating the number of cols to split the ciphertext into
  const numCols: number = parsedText.length / numRows;

  // Splitting the ciphertext into numRows of the size of numCols
  const rows: string[] = [];
  for (let i: number = 0; i < numRows; i++) {
    rows.push(parsedText.slice(i * numCols, (i + 1) * numCols));
  }
  // Prepare plaintext array
  const plaintext: string[] = [];
  for (let i: number = 0; i < numCols; i++) {
    plaintext.push("");
  }

  // Rearrange rows into columns according to order
  for (let i of order) {
    for (let j: number = 0; j < rows[i].length; j++) {
      plaintext[j] += rows[i][j];
    }
  }

  return plaintext.join("");
};

export const generateKey: RandomKeyGenerator = () => {
  const key = Array.from(Array(9).keys());

  // Shuffle the key
  for (let i = key.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [key[i], key[j]] = [key[j], key[i]];
  }
  return asciiToHex(key.join(""));
};
