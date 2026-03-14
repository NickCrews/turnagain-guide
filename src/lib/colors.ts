/**
 * Converts a given string into a color represented in HSL format.
 * The color is generated based on the hash of the input string.
 *
 * @param str - The input string to be converted to a color.
 * @param saturation - The saturation percentage of the resulting color (default is 100).
 * @param lightness - The lightness percentage of the resulting color (default is 25).
 * @returns The HSL color string derived from the input string.
 */
export function hashStringToColor(str: string, saturation: number = 100, lightness: number = 25) {
  const hash = hashString(str);
  return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
}

/*
  cyrb53 (c) 2018 bryc (github.com/bryc)
  License: Public domain (or MIT if needed). Attribution appreciated.
  A fast and simple 53-bit string hash function with decent collision resistance.
  Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
*/
export function hashString(str: string, seed: number = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};