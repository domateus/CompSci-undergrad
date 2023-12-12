import {BigInteger} from 'jsbn';
import {bigIntegerToXBytePaddedHex} from './utils';

type DSASignPayload = {
  m: string;
  g: string;
  k: string;
  p: string;
  x: string;
  q: string;
};
type DSASign = (payload: DSASignPayload) => string[];

type DSAVerifyPayload = {
  m: string;
  g: string;
  p: string;
  q: string;
  y: string;
  r: string;
  s: string;
};

type DSAVerify = (payload: DSAVerifyPayload) => boolean;

export const sign: DSASign = ({m, g, k, p, x, q}) => {
  const m1 = new BigInteger(m, 16);
  const g1 = new BigInteger(g, 16);
  const k1 = new BigInteger(k, 16);
  const p1 = new BigInteger(p, 16);
  const x1 = new BigInteger(x, 16);
  const q1 = new BigInteger(q, 16);
  const r = g1.modPow(k1, p1).mod(q1);
  const s = k1
    .modInverse(q1)
    .multiply(m1.add(x1.multiply(r)))
    .mod(q1);
  return [r, s].map(v => bigIntegerToXBytePaddedHex(v, 256));
};

export const verify: DSAVerify = ({m, g, p, q, y, r, s}) => {
  const m1 = new BigInteger(m, 16);
  const g1 = new BigInteger(g, 16);
  const p1 = new BigInteger(p, 16);
  const q1 = new BigInteger(q, 16);
  const y1 = new BigInteger(y, 16);
  const r1 = new BigInteger(r, 16);
  const s1 = new BigInteger(s, 16);
  if (r1.compareTo(BigInteger.ONE) < 0 || r1.compareTo(q1) >= 0) {
    return false;
  }
  if (s1.compareTo(BigInteger.ONE) < 0 || s1.compareTo(q1) >= 0) {
    return false;
  }
  const w = s1.modInverse(q1);
  const u1 = m1.multiply(w).mod(q1);
  const u2 = r1.multiply(w).mod(q1);
  const v1 = g1.modPow(u1, p1);
  const v2 = y1.modPow(u2, p1);
  const v3 = v1.multiply(v2).mod(p1);
  const v = v3.mod(q1);
  // const v = g1.modPow(u1, p1).multiply(y1.modPow(u2, p1)).mod(p1).mod(q1);
  return v.equals(r1);
};
