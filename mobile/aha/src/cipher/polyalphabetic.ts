// Polyalphabetic Cipher using Vigenère Cipher (UTF-16).

import { asciiToHex, hexToAscii } from "./utils";

// Encryption
export const encrypt: Encrypter = ({ plaintext, key }) => {
  const parsedKey = hexToAscii(key);

  return asciiToHex(
    hexToAscii(plaintext)
      .split("")
      .map((c, i) =>
        String.fromCharCode(
          c.charCodeAt(0) + parsedKey[i % parsedKey.length].charCodeAt(0)
        )
      )
      .join("")
  );
};

// Decryption
export const decrypt: Decrypter = ({ ciphertext, key }) => {
  const parsedKey = hexToAscii(key);

  return hexToAscii(ciphertext)
    .split("")
    .map((c, i) =>
      String.fromCharCode(
        c.charCodeAt(0) - parsedKey[i % parsedKey.length].charCodeAt(0)
      )
    )
    .join("");
};

export const generateKey: RandomKeyGenerator = () => {
  return Array.from(Array(127).keys())
    .sort(() => Math.random() - 0.5)
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("");
};
