// RC4
import { asciiToHex, hexToAscii } from "./utils";
export const encrypt: Encrypter = ({ plaintext, key }) => {
  key = hexToAscii(key);
  plaintext = hexToAscii(plaintext);
  if (!key || key.length === 0) {
    return "";
  }

  const S = [];
  const T = [];
  for (let i = 0; i < 256; i++) {
    S[i] = i;
    T[i] = key.charCodeAt(i % key.length);
  }

  // Key Schedule
  let j = 0;
  let tmp = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + T[i]) % 256;
    tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
  }

  let CT = [];
  let k = 0;
  let i = 0;
  j = 0;

  // Bit stream encryption/decryption:
  for (let n = 0; n < plaintext.length; n++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    // Swap (S[i], S[j]);
    tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
    k = (S[i] + S[j]) % 256;
    CT.push(plaintext.charCodeAt(n) ^ S[k]);
  }

  return asciiToHex(CT.map((c) => String.fromCharCode(c)).join(""));
};

export const decrypt: Decrypter = ({ ciphertext, key }) => {
  const hexPT = encrypt({ plaintext: ciphertext, key });
  return hexToAscii(hexPT);
};

export const generateKey: RandomKeyGenerator = () => {
  return asciiToHex(
    Array.from(
      Array(global.crypto.getRandomValues(new Uint8Array(1))[0] + 1).keys()
    )
      .map((v) => String.fromCharCode(v))
      .join("")
  );
};
