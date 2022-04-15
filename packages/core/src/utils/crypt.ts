import CryptoJS, { SHA256, AES } from 'crypto-js';

const _decrypt = (ciphertext, salt) => {
  const bytes = AES.decrypt(ciphertext, salt);
  try {
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (e) {
    throw new Error('you probably have the wrong salt');
  }
};

const _encrypt = (message, salt) => {
  const bytes = AES.encrypt(message, salt);
  return bytes.toString();
};

export const crypt = (salt, text) => {
  return _encrypt(text, SHA256(salt).toString());
};

export const decrypt = (salt, encoded) => {
  return _decrypt(encoded, SHA256(salt).toString());
};

export function hexToUtf8(hex) {
  return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'));
}

export function utf8ToHex(str) {
  return Array.from(str)
    .map((c) =>
      c.charCodeAt(0) < 128
        ? c.charCodeAt(0).toString(16)
        : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
    )
    .join('');
}

export const utf8ArrayToString = (arr) => Buffer.from(arr).toString('base64');
export const stringToUtf8Array = (str) =>
  new Uint8Array(Buffer.from(str, 'base64'));
