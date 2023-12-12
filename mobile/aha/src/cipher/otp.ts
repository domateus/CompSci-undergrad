import * as utils from "./utils";

export const encrypt: Encrypter = ({ plaintext, key }) => {
  if (plaintext.length !== key.length) {
    throw new Error("OTP key should have the same length like the message!");
  }

  const result = [];
  for (let i = 0; i < plaintext.length; i += 2) {
    const p = parseInt(plaintext.slice(i, i + 2), 16);
    const k = parseInt(key.slice(i, i + 2), 16);

    const r = ((p + k) % utils.number_ASCII_TABLE_SIZE)
      .toString(16)
      .padStart(2, "0");
    result.push(r);
  }

  return result.join("");
};

export const decrypt: Decrypter = ({ ciphertext, key }) => {
  if (ciphertext.length !== key.length) {
    throw new Error("OTP key should have the same length like the message!");
  }

  const result = [];
  for (let i = 0; i < ciphertext.length; i += 2) {
    const c = parseInt(ciphertext.slice(i, i + 2), 16);
    const k = parseInt(key.slice(i, i + 2), 16);

    const r = utils.hexToAscii(
      ((c - k + utils.number_ASCII_TABLE_SIZE) % utils.number_ASCII_TABLE_SIZE)
        .toString(16)
        .padStart(2, "0")
    );
    result.push(r);
  }

  return result.join("");
};

export const generateKey: KeyGenerator = ({ message }) => {
  return utils.generateRandomString(message.length);
};
