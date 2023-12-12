class Int64 {
  public high: number;
  public low: number;
  public add(x: Int64): Int64 {
    let lsw, msw;

    lsw = (x.low & 0xffff) + (this.low & 0xffff);
    msw = (x.low >>> 16) + (this.low >>> 16) + (lsw >>> 16);
    const low = ((msw & 0xffff) << 16) | (lsw & 0xffff);

    lsw = (x.high & 0xffff) + (this.high & 0xffff) + (msw >>> 16);
    msw = (x.high >>> 16) + (this.high >>> 16) + (lsw >>> 16);
    const high = ((msw & 0xffff) << 16) | (lsw & 0xffff);

    return new Int64(high, low);
  }

  public xor(x: Int64): Int64 {
    return new Int64(this.high ^ x.high, this.low ^ x.low);
  }

  public mxor(...xs: Int64[]): Int64 {
    return xs.reduce((a, b) => a.xor(b), this);
  }

  public madd(...xs: Int64[]): Int64 {
    return xs.reduce((a, b) => a.add(b), this);
  }

  public and(x: Int64): Int64 {
    return new Int64(this.high & x.high, this.low & x.low);
  }

  public or(x: Int64): Int64 {
    return new Int64(this.high | x.high, this.low | x.low);
  }

  public not(): Int64 {
    return new Int64(~this.high, ~this.low);
  }

  public rotr(n: number): Int64 {
    let tmp;
    if (n < 32) {
      tmp = 32 - n;
      return new Int64(
        (this.high >>> n) | (this.low << tmp),
        (this.low >>> n) | (this.high << tmp),
      );
    } else {
      tmp = 64 - n;
      return new Int64(
        (this.low >>> n) | (this.high << tmp),
        (this.high >>> n) | (this.low << tmp),
      );
    }
  }

  public rotl(n: number): Int64 {
    let tmp;
    if (n > 32) {
      tmp = 64 - n;
      return new Int64(
        (this.low << n) | (this.high >>> tmp),
        (this.high << n) | (this.low >>> tmp),
      );
    } else if (0 !== n) {
      tmp = 32 - n;
      return new Int64(
        (this.high << n) | (this.low >>> tmp),
        (this.low << n) | (this.high >>> tmp),
      );
    } else {
      return this;
    }
  }

  public shr(n: number): Int64 {
    return new Int64(
      this.high >>> n,
      (this.low >>> n) | (this.high << (32 - n)),
    );
  }

  public static fromHex(hex: string): Int64 {
    if (hex.length > 16) {
      throw new Error('hex string too long');
    }
    const high = parseInt(hex.slice(0, 8), 16);
    const low = parseInt(hex.slice(8, 16), 16);
    return new Int64(high, low);
  }

  public static fromBits(bits: string): Int64 {
    if (bits.length > 64) {
      throw new Error('bits string too long');
    }
    const high = parseInt(bits.slice(0, 32), 2);
    const low = parseInt(bits.slice(32, 64), 2);
    return new Int64(high, low);
  }

  public maj(x: Int64, y: Int64): Int64 {
    return new Int64(
      (this.high & x.high) ^ (this.high & y.high) ^ (x.high & y.high),
      (this.low & x.low) ^ (this.low & y.low) ^ (x.low & y.low),
    );
  }

  public Sigma0(): Int64 {
    const rotr28 = this.rotr(28);
    const rotr34 = this.rotr(34);
    const rotr39 = this.rotr(39);
    return new Int64(
      rotr28.high ^ rotr34.high ^ rotr39.high,
      rotr28.low ^ rotr34.low ^ rotr39.low,
    );
  }

  public Sigma1(): Int64 {
    const rotr14 = this.rotr(14);
    const rotr18 = this.rotr(18);
    const rotr41 = this.rotr(41);
    return new Int64(
      rotr14.high ^ rotr18.high ^ rotr41.high,
      rotr14.low ^ rotr18.low ^ rotr41.low,
    );
  }

  public sigma0(): Int64 {
    const rotr1 = this.rotr(1);
    const rotr8 = this.rotr(8);
    const shr7 = this.shr(7);
    return new Int64(
      rotr1.high ^ rotr8.high ^ shr7.high,
      rotr1.low ^ rotr8.low ^ shr7.low,
    );
  }

  public sigma1(): Int64 {
    const rotr19 = this.rotr(19);
    const rotr61 = this.rotr(61);
    const shr6 = this.shr(6);
    return new Int64(
      rotr19.high ^ rotr61.high ^ shr6.high,
      rotr19.low ^ rotr61.low ^ shr6.low,
    );
  }

  public ch(x: Int64, y: Int64): Int64 {
    return new Int64(
      (this.high & x.high) ^ (~this.high & y.high),
      (this.low & x.low) ^ (~this.low & y.low),
    );
  }

  public static fromBytes(bytes: number[]): Int64 {
    if (bytes.length > 8) {
      throw new Error('too many bytes');
    }
    let high = 0;
    let low = 0;
    for (let i = 0; i < bytes.length; i++) {
      if (i < 4) {
        high = (high << 8) | bytes[i];
      } else {
        low = (low << 8) | bytes[i];
      }
    }
    return new Int64(high, low);
  }

  public toBytes(): number[] {
    const bytes = [];
    for (let i = 0; i < 8; i++) {
      if (i < 4) {
        bytes.push((this.high >>> ((3 - i) * 8)) & 0xff);
      } else {
        bytes.push((this.low >>> ((7 - i) * 8)) & 0xff);
      }
    }
    return bytes;
  }

  public toString(): string {
    return `${this.high}${this.low}`;
  }

  public toHex(): string {
    return `${this.high.toString(16).padStart(8, '0')}${this.low
      .toString(16)
      .padStart(8, '0')}`;
  }

  constructor(high: number, low: number) {
    this.high = high;
    this.low = low;
  }
}

const hexToBits = (hex: string) => {
  let bits = '';
  for (let i = 0; i < hex.length; i += 2) {
    bits += parseInt(hex.slice(i, i + 2), 16)
      .toString(2)
      .padStart(8, '0');
  }
  return bits;
};

const padding = (l: number) => {
  // number is big enough for our use case
  // but it does not support the size that sha512 does
  // message can have 1 petabyte so yeah...
  const mod = 896 - (l % 1024);
  if (mod < 1) return 1024 + mod;
  return mod;
};

const padMessage = (message: string) => {
  // message.length must be congruent to 896 mod 1024 bits
  const bitMessage = hexToBits(message);
  const toPad = padding(bitMessage.length);
  const pad = '1' + '0'.repeat(toPad - 1);
  const length = bitMessage.length.toString(2).padStart(128, '0');
  return bitMessage + pad + length;
};

const messageToBlocks = (message: string) => {
  const blocks = [];
  for (let i = 0; i < message.length; i += 1024) {
    blocks.push(message.slice(i, i + 1024));
  }
  return blocks;
};

// will receive a 1 byte hex encoded string and return a 1 byte hex encoded string
export const sha512 = (message: string) => {
  const H = [
    Int64.fromHex('6a09e667f3bcc908'),
    Int64.fromHex('bb67ae8584caa73b'),
    Int64.fromHex('3c6ef372fe94f82b'),
    Int64.fromHex('a54ff53a5f1d36f1'),
    Int64.fromHex('510e527fade682d1'),
    Int64.fromHex('9b05688c2b3e6c1f'),
    Int64.fromHex('1f83d9abfb41bd6b'),
    Int64.fromHex('5be0cd19137e2179'),
  ];

  const K = [
    Int64.fromHex('428a2f98d728ae22'),
    Int64.fromHex('7137449123ef65cd'),
    Int64.fromHex('b5c0fbcfec4d3b2f'),
    Int64.fromHex('e9b5dba58189dbbc'),
    Int64.fromHex('3956c25bf348b538'),
    Int64.fromHex('59f111f1b605d019'),
    Int64.fromHex('923f82a4af194f9b'),
    Int64.fromHex('ab1c5ed5da6d8118'),
    Int64.fromHex('d807aa98a3030242'),
    Int64.fromHex('12835b0145706fbe'),
    Int64.fromHex('243185be4ee4b28c'),
    Int64.fromHex('550c7dc3d5ffb4e2'),
    Int64.fromHex('72be5d74f27b896f'),
    Int64.fromHex('80deb1fe3b1696b1'),
    Int64.fromHex('9bdc06a725c71235'),
    Int64.fromHex('c19bf174cf692694'),
    Int64.fromHex('e49b69c19ef14ad2'),
    Int64.fromHex('efbe4786384f25e3'),
    Int64.fromHex('0fc19dc68b8cd5b5'),
    Int64.fromHex('240ca1cc77ac9c65'),
    Int64.fromHex('2de92c6f592b0275'),
    Int64.fromHex('4a7484aa6ea6e483'),
    Int64.fromHex('5cb0a9dcbd41fbd4'),
    Int64.fromHex('76f988da831153b5'),
    Int64.fromHex('983e5152ee66dfab'),
    Int64.fromHex('a831c66d2db43210'),
    Int64.fromHex('b00327c898fb213f'),
    Int64.fromHex('bf597fc7beef0ee4'),
    Int64.fromHex('c6e00bf33da88fc2'),
    Int64.fromHex('d5a79147930aa725'),
    Int64.fromHex('06ca6351e003826f'),
    Int64.fromHex('142929670a0e6e70'),
    Int64.fromHex('27b70a8546d22ffc'),
    Int64.fromHex('2e1b21385c26c926'),
    Int64.fromHex('4d2c6dfc5ac42aed'),
    Int64.fromHex('53380d139d95b3df'),
    Int64.fromHex('650a73548baf63de'),
    Int64.fromHex('766a0abb3c77b2a8'),
    Int64.fromHex('81c2c92e47edaee6'),
    Int64.fromHex('92722c851482353b'),
    Int64.fromHex('a2bfe8a14cf10364'),
    Int64.fromHex('a81a664bbc423001'),
    Int64.fromHex('c24b8b70d0f89791'),
    Int64.fromHex('c76c51a30654be30'),
    Int64.fromHex('d192e819d6ef5218'),
    Int64.fromHex('d69906245565a910'),
    Int64.fromHex('f40e35855771202a'),
    Int64.fromHex('106aa07032bbd1b8'),
    Int64.fromHex('19a4c116b8d2d0c8'),
    Int64.fromHex('1e376c085141ab53'),
    Int64.fromHex('2748774cdf8eeb99'),
    Int64.fromHex('34b0bcb5e19b48a8'),
    Int64.fromHex('391c0cb3c5c95a63'),
    Int64.fromHex('4ed8aa4ae3418acb'),
    Int64.fromHex('5b9cca4f7763e373'),
    Int64.fromHex('682e6ff3d6b2b8a3'),
    Int64.fromHex('748f82ee5defb2fc'),
    Int64.fromHex('78a5636f43172f60'),
    Int64.fromHex('84c87814a1f0ab72'),
    Int64.fromHex('8cc702081a6439ec'),
    Int64.fromHex('90befffa23631e28'),
    Int64.fromHex('a4506cebde82bde9'),
    Int64.fromHex('bef9a3f7b2c67915'),
    Int64.fromHex('c67178f2e372532b'),
    Int64.fromHex('ca273eceea26619c'),
    Int64.fromHex('d186b8c721c0c207'),
    Int64.fromHex('eada7dd6cde0eb1e'),
    Int64.fromHex('f57d4f7fee6ed178'),
    Int64.fromHex('06f067aa72176fba'),
    Int64.fromHex('0a637dc5a2c898a6'),
    Int64.fromHex('113f9804bef90dae'),
    Int64.fromHex('1b710b35131c471b'),
    Int64.fromHex('28db77f523047d84'),
    Int64.fromHex('32caab7b40c72493'),
    Int64.fromHex('3c9ebe0a15c9bebc'),
    Int64.fromHex('431d67c49c100d4c'),
    Int64.fromHex('4cc5d4becb3e42b6'),
    Int64.fromHex('597f299cfc657e2a'),
    Int64.fromHex('5fcb6fab3ad6faec'),
    Int64.fromHex('6c44198c4a475817'),
  ];
  const padded = padMessage(message);
  const blocks = messageToBlocks(padded);
  for (let i = 0; i < blocks.length; i++) {
    const M: Int64[] = [];
    for (let j = 0; j < 1024; j += 64) {
      M.push(Int64.fromBits(blocks[i].slice(j, j + 64)));
    }
    const W: Int64[] = [];
    for (let t = 0; t < 80; t++) {
      if (t < 16) {
        W.push(M[t]);
      } else {
        W[t] = W[t - 2].sigma1().madd(W[t - 7], W[t - 15].sigma0(), W[t - 16]);
      }
    }
    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    let f = H[5];
    let g = H[6];
    let h = H[7];
    for (let t = 0; t < 80; t++) {
      const T1 = h.add(e.Sigma1()).add(e.ch(f, g)).add(K[t]).add(W[t]);
      const T2 = a.Sigma0().add(a.maj(b, c));
      h = g;
      g = f;
      f = e;
      e = d.add(T1);
      d = c;
      c = b;
      b = a;
      a = T1.add(T2);
    }
    H[0] = H[0].add(a);
    H[1] = H[1].add(b);
    H[2] = H[2].add(c);
    H[3] = H[3].add(d);
    H[4] = H[4].add(e);
    H[5] = H[5].add(f);
    H[6] = H[6].add(g);
    H[7] = H[7].add(h);
  }

  const retVal = [
    H[0].high,
    H[0].low,
    H[1].high,
    H[1].low,
    H[2].high,
    H[2].low,
    H[3].high,
    H[3].low,
    H[4].high,
    H[4].low,
    H[5].high,
    H[5].low,
    H[6].high,
    H[6].low,
    H[7].high,
    H[7].low,
  ];

  const hex_tab = '0123456789abcdef';
  let str = '';
  for (let i = 0; i < 64; i += 1) {
    const srcByte = retVal[i >>> 2] >>> (8 * (3 + -1 * (i % 4)));
    str +=
      hex_tab.charAt((srcByte >>> 4) & 0xf) + hex_tab.charAt(srcByte & 0xf);
  }

  return str;
};
