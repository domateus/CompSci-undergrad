// Monoalphabetic Cipher using UTF-16.
// with random UTF-16 key generator

import { asciiToHex, hexToAscii } from "./utils";

// Encryption
export const encrypt: Encrypter = ({ plaintext, key }) => {
  const parsedKey = hexToAscii(key);
  return asciiToHex(
    hexToAscii(plaintext)
      .split("")
      .map((c) => {
        return String.fromCharCode(parsedKey[c.charCodeAt(0)].charCodeAt(0));
      })
      .join("")
  );
};

// Decryption
export const decrypt: Decrypter = ({ ciphertext, key }) => {
  const parsedKey = hexToAscii(key);
  return hexToAscii(ciphertext)
    .split("")
    .map((c) =>
      String.fromCharCode(
        // convert the key index as UTF-16 to char
        parsedKey.indexOf(c)
      )
    ) // lookup the index of the char in the key
    .join("");
};

// Random Key Generator for Monoalphabetic Cipher to use in the front-end
export const generateKey: RandomKeyGenerator = () => {
  return Array.from(Array(127).keys())
    .sort(() => Math.random() - 0.5)
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("");
};
