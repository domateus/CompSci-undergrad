import { BigInteger } from "jsbn";
import forge from "node-forge";

export const LIST_PRIMES = [
  7n,
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
  41n,
  43n,
  47n,
  53n,
  59n,
  61n,
  67n,
  71n,
  73n,
  79n,
  83n,
  89n,
  97n,
  101n,
  103n,
  107n,
  109n,
  113n,
  127n,
  131n,
  137n,
  139n,
  149n,
  151n,
  157n,
  163n,
  167n,
  173n,
  179n,
  181n,
  191n,
  193n,
  197n,
  199n,
  211n,
  223n,
  227n,
  229n,
  233n,
  239n,
  241n,
  251n,
  257n,
  263n,
  269n,
  271n,
  277n,
  281n,
  283n,
  293n,
  307n,
  311n,
  313n,
  317n,
  331n,
  337n,
  347n,
  349n,
  353n,
  359n,
  367n,
  373n,
  379n,
  383n,
  389n,
  397n,
];

export const LIST_PRIMES_SIZE = LIST_PRIMES.length;
export const ASCII_TABLE_SIZE = 127n;
export const number_ASCII_TABLE_SIZE = Number(ASCII_TABLE_SIZE);
export const ASCII_ALPHABET_INDEX = 65;

export function getAsciiCodes(s: string): bigint[] {
  return s.split("").map((c) => BigInt(c.charCodeAt(0)));
}

export const zip = <T, U = T>(a: T[], b: U[]) => a.map((k, i) => [k, b[i]]);

export function generateRandomString(length: number): string {
  const getRandomBigInts = (): string[] =>
    [...global.crypto.getRandomValues(new Uint8Array(length))].map((n) =>
      (n % number_ASCII_TABLE_SIZE).toString(16).padStart(2, "0")
    );
  const result = getRandomBigInts().join("");
  return result;
}

export async function generatePrime(bytes: number): Promise<BigInteger> {
  return await new Promise((resolve, reject) => {
    (forge as any).prime.generateProbablePrime(
      bytes * 8,
      function (e: any, p: bigint) {
        if (e) {
          reject(e);
        } else {
          const v = new BigInteger(p.toString(16), 16);

          resolve(v);
        }
      }
    );
  });
}

export function gcd(a: bigint, b: bigint): bigint {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

export function extendedEuclidean(a: bigint, b: bigint): bigint[] {
  if (b === 0n) {
    return [1n, 0n, a];
  }
  const [x, y, gcd] = extendedEuclidean(b, a % b);
  return [y, x - (a / b) * y, gcd];
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function getRandomPrime(cap = 1) {
  const arrayIndex = getRandomInt(0, LIST_PRIMES.length - cap);
  const randomPrime = LIST_PRIMES[arrayIndex];
  return randomPrime;
}

export function bigintToBigInteger(bigint: bigint): BigInteger {
  return new BigInteger(bigint.toString().replace("n", ""), 10);
}

export function stringToNumber(plaintext: string) {
  return BigInt(
    plaintext
      .split("")
      .map((c) => c.charCodeAt(0))
      .join("")
  );
}

export function asciiToHex(str: string, x = 1) {
  let arr1 = [];
  const charSize = 2 * x;
  for (let n = 0, l = str.length; n < l; n++) {
    let hex = Number(str.charCodeAt(n)).toString(16).padStart(charSize, "0");
    arr1.push(hex);
  }
  return arr1.join("");
}

export function hexToBigInteger(hex: string) {
  return new BigInteger(hex, 16);
}

export function hexToAscii(hex: string, x = 1) {
  let str = "";
  const charSize = 2 * x;
  for (let n = 0; n < hex.length; n += charSize) {
    str += String.fromCharCode(parseInt(hex.substr(n, charSize), 16));
  }
  return str;
}

export function hexToXByteBigIntegerArray(hex: string, x: number) {
  const values = [];
  const bigintBytesSize = 2 * x;
  for (let i = 0; i < hex.length; i += bigintBytesSize) {
    values.push(hexToBigInteger(hex.slice(i, i + bigintBytesSize)));
  }
  return values;
}

export function bigIntegerToHex(bigint: BigInteger) {
  return bigint.toString(16);
}

export function bigIntegerToXBytePaddedHex(bigint: BigInteger, x: number) {
  return bigint.toString(16).padStart(2 * x, "0");
}

export function bigIntToXBytePaddedHex(bigint: bigint, x: number) {
  return bigint.toString(16).padStart(2 * x, "0");
}

export function modPow(
  value: BigInteger,
  exponent: BigInteger,
  modulus: BigInteger
) {
  let result = BigInteger.ONE;
  while (exponent > BigInteger.ZERO) {
    if (exponent.mod(new BigInteger("2")) === BigInteger.ONE) {
      result = result.multiply(value).mod(modulus);
    }
    exponent = exponent.shiftRight(1);
    value = value.pow(2).mod(modulus);
  }
  return result;
}

export function multiplyHexStrings(a: string, b: string) {
  var x = new BigInteger(a, 16);
  var y = new BigInteger(b, 16);
  var c = x.multiply(y);
  return c.toString(16);
}
