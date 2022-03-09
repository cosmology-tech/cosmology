export const crypt = (salt, text) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
};

export const decrypt = (salt, encoded) => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join('');
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
