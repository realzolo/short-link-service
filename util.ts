/**
 * murmurhash algorithm
 * Generate a 32-bit hash from the given string.
 * @param str The string to hash.
 */
function hash(str: string): number {
    let h = 0x811c9dc5;
    let i = 0;
    let len = str.length;
    while (len >= 4) {
        let k = str.charCodeAt(i) & 0xff |
            (str.charCodeAt(++i) & 0xff) << 8 |
            (str.charCodeAt(++i) & 0xff) << 16 |
            (str.charCodeAt(++i) & 0xff) << 24;
        k = ((k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16));
        k ^= k >>> 24;
        k = ((k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16));
        h = ((h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k);
        len -= 4;
        ++i;
    }
    switch (len) {
        case 3:
            h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            h ^= str.charCodeAt(i) & 0xff;
            h = ((h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16));
    }
    h ^= h >>> 13;
    h = ((h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16));
    h ^= h >>> 15;
    return h >>> 0;
}

/**
 * Converts a numeric key into an alphabetic string form.
 * @param key The numeric key.
 */
const convert = (key: number) => {
    let res = "";
    while (key > 0) {
        res = getChar(key % 62) + res;
        key = Math.floor(key / 62);
    }
    return res;
}

/**
 * Converts a number to a 62-bit value.
 * @param x The number to convert.
 */
const getChar = (x: number) => {
    if (x < 10) {
        return x.toString();
    } else if (x < 36) {
        return String.fromCharCode("a".charCodeAt(0) + x - 10);
    } else if (x < 62) {
        return String.fromCharCode("A".charCodeAt(0) + x - 36);
    } else {
        return "";
    }
}

export {
    hash,
    convert
}