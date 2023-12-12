/* eslint-disable no-bitwise */
import * as aes from '../cipher/aes';
import * as cc from '../cipher/caesarCipher';
import * as col from '../cipher/columnar';
import * as des from '../cipher/des';
import * as hc from '../cipher/hillCipher';
import * as ma from '../cipher/monoalphabetic';
import * as otp from '../cipher/otp';
import * as pf from '../cipher/playfair';
import * as pa from '../cipher/polyalphabetic';
import * as rf from '../cipher/railFence';
import * as rc4 from '../cipher/rc4';
import * as rsa from '../cipher/rsa';
import {asciiToHex} from '../cipher/utils';
// import * as ecc from "@cipher/ecc";

export function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (
      Number(c) ^
      (global.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16),
  );
}


export function contactValidKey({
  contact,
  algorithm,
}: Omit<GenerateKeyPayload, 'message'>) {
  if (algorithm === 'OTP') return null;
  else if (algorithm === 'RSA') {
    // for RSA we reuse the public key from the session
    return {
      value: contact!.publicKey,
      version: 1,
      timestamp: Date.now(),
      type: algorithm,
    };
  } else if (algorithm === 'AES') {
    // for AES we use Diffie-Hellman to generate a shared secret
    return {
      value: '',
      version: 1,
      timestamp: Date.now(),
      type: algorithm,
    };
  } else return (contact?.keys || []).find(key => key.type === algorithm);
}

export const isKeyValid = (key: AlgorithmKey | null | undefined) => {
  const hour = 1000 * 60 * 60;
  if (!key || key?.timestamp < Date.now() - hour) {
    return false;
  }
  return true;
};

export function getCiphertext({
  algorithm,
  key,
  plaintext,
}: Required<EncryptMessagePayload>): string {
  switch (algorithm) {
    case 'Caesar cipher':
      return cc.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'Monoalphabetic':
      return ma.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'Polyalphabetic':
      return pa.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'Hill cipher':
      return hc.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'Playfair':
      return pf.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'OTP':
      return otp.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'Rail fence':
      return rf.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'Columnar':
      return col.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'DES':
      return des.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'AES':
      return aes.ecbEncryption({key, plaintext: asciiToHex(plaintext)});
    case 'RC4':
      return rc4.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'RSA':
      return rsa.encrypt({key, plaintext: asciiToHex(plaintext)});
    case 'ECC':
      return plaintext;
    default:
      return plaintext;
  }
}

export function getPlaintext({
  algorithm,
  message,
  key,
}: Required<DecryptMessagePayload>): string {
  switch (algorithm) {
    case 'Caesar cipher':
      return cc.decrypt({key, ciphertext: message});
    case 'Monoalphabetic':
      return ma.decrypt({key, ciphertext: message});
    case 'Polyalphabetic':
      return pa.decrypt({key, ciphertext: message});
    case 'Hill cipher':
      return hc.decrypt({key, ciphertext: message});
    case 'Playfair':
      return pf.decrypt({key, ciphertext: message});
    case 'OTP':
      return otp.decrypt({key, ciphertext: message});
    case 'Rail fence':
      return rf.decrypt({key, ciphertext: message});
    case 'Columnar':
      return col.decrypt({key, ciphertext: message});
    case 'DES':
      return des.decrypt({key, ciphertext: message});
    case 'AES':
      return aes.ecbDecryption({key, ciphertext: message});
    case 'RC4':
      return rc4.decrypt({key, ciphertext: message});
    case 'RSA':
      return rsa.decrypt({key, ciphertext: message});
    case 'ECC':
      return message;
    default:
      return message;
  }
}

export function generateKey({algorithm, message}: GenerateKeyPayload): string {
  switch (algorithm) {
    case 'Caesar cipher':
      return (Math.floor(Math.random() * 26 + 1) % 26)
        .toString(16)
        .padStart(2, '0');
    case 'Monoalphabetic':
      return ma.generateKey();
    case 'Polyalphabetic':
      return pa.generateKey();
    case 'Hill cipher':
      return hc.generateKey();
    case 'Playfair':
      const pfKey = window.prompt('Enter a key for Playfair cipher');
      if (!pfKey) return pf.generateKey({message: 'crypto'});
      return pf.generateKey({message: pfKey});
    case 'OTP':
      return otp.generateKey({message});
    case 'Rail fence':
      return rf.generateKey();
    case 'Columnar':
      return col.generateKey();
    case 'DES':
      return des.generateKey();
    case 'RC4':
      return rc4.generateKey();
    case 'RSA':
      return rsa.generateKeys();
    case 'ECC':
      return '';
    default:
      throw new Error('Algorithm not found');
  }
}
