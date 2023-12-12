import {
  bigIntegerToXBytePaddedHex,
  generatePrime,
  hexToXByteBigIntegerArray,
} from './utils';

const bytes = 16;

export const psk: AsyncRandomKeyGenerator = async () => {
  const p1 = generatePrime(bytes);
  const p2 = generatePrime(bytes);
  let [p, q] = await Promise.all([p1, p2]);
  if (p < q) {
    let temp = p;
    p = q;
    q = temp;
  }
  return [p, q].map(v => bigIntegerToXBytePaddedHex(v, bytes));
};

export const secretKey = () => {
  return Array.from(global.crypto.getRandomValues(new Uint32Array(4)))
    .map(v => v.toString(16))
    .join('');
};

export const dh: DHModPow = ({b, e, p}) => {
  const base = hexToXByteBigIntegerArray(b, bytes)[0];
  const exponent = hexToXByteBigIntegerArray(e, bytes)[0];
  const modulus = hexToXByteBigIntegerArray(p, bytes)[0];
  return bigIntegerToXBytePaddedHex(base.modPow(exponent, modulus), bytes);
};
