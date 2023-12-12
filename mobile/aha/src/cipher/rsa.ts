import { BigInteger } from "jsbn";
import * as utils from "./utils";

function generateE(totient: bigint) {
  let e = utils.getRandomPrime() ?? 1;
  while (utils.gcd(e, totient) !== 1n) {
    e += 2n;
  }
  return e;
}

function computeD(e: bigint, totient: bigint) {
  let d = utils.extendedEuclidean(e, totient)[0];
  while (d < 1n) {
    d += totient;
  }
  return d;
}

export const generateKeys: RandomKeyGenerator = () => {
  const prime1 = utils.getRandomPrime();
  let prime2 = utils.getRandomPrime();

  //Prime numbers should not be equal,so this loop makes a lookup for a not equal prime number
  while (prime1 === prime2) {
    prime2 = utils.getRandomPrime();
  }
  //calculating n
  const n = prime1 * prime2;

  //calculating totient(n)
  const totient: bigint = (prime1 - 1n) * (prime2 - 1n);

  //calculating e
  const e = generateE(totient);

  //calculating d
  const d = computeD(e, totient);

  //create public key
  const publicKey = [e, n];

  //create private key
  const privateKey = [d, n];
  const result = publicKey
    .map((x) =>
      utils.bigIntegerToXBytePaddedHex(new BigInteger(x.toString(16), 16), 4)
    )
    .concat(
      privateKey.map((x) =>
        utils.bigIntegerToXBytePaddedHex(new BigInteger(x.toString(16), 16), 4)
      )
    )
    .join("");
  return result;
};

export const parseKeys = (key: string) => ({
  publicKey: key.slice(0, 16),
  privateKey: key.slice(16, 32),
});

export const encrypt: Encrypter = ({ plaintext, key }) => {
  //get the parts of public key for encryption
  const [e, n] = utils.hexToXByteBigIntegerArray(key, 4);
  return utils
    .hexToXByteBigIntegerArray(plaintext, 1)
    .map((base) => {
      return utils.bigIntegerToXBytePaddedHex(base.modPow(e, n), 4);
    })
    .join("");
};

export const decrypt: Decrypter = ({ ciphertext, key }) => {
  //get the parts of private key for decryption
  const [d, n] = utils.hexToXByteBigIntegerArray(key, 4);

  return utils
    .hexToXByteBigIntegerArray(ciphertext, 4)
    .map((base) => utils.hexToAscii(utils.bigIntegerToHex(base.modPow(d, n))))
    .join("");
};
