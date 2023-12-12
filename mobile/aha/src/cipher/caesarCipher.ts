// Caesar Cipher using UTF-16.

import { asciiToHex, hexToAscii } from "./utils";

// Encryption
export const encrypt: Encrypter = ({ plaintext, key }) => {
  const result = hexToAscii(plaintext)
    .split("")
    .map((c) =>
      asciiToHex(String.fromCharCode(c.charCodeAt(0) + parseInt(key, 16)))
    )
    .join("");
  return result;
};

// Decryption
export const decrypt: Decrypter = ({ ciphertext, key }) => {
  return hexToAscii(ciphertext)
    .split("")
    .map((c) => String.fromCharCode(c.charCodeAt(0) - parseInt(key, 16)))
    .join("");
};
