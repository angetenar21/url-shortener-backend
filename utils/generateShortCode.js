/**
 * generateShortCode.js
 *
 * Create a cryptographically-secure short code for use in a URL shortener.
 *
 * The function generates `length` random bytes using Node's `crypto.randomBytes`.
 * Each byte (0..255) is mapped into the allowed character set by taking
 * `byte % chars.length` and picking the character at that index. The result
 * is a random string of the requested length containing A-Z, a-z, and 0-9.
 *
 * Note: This function does NOT guarantee uniqueness — callers should check
 * the datastore for collisions and retry if necessary.
 */

const crypto = require('crypto');

function generateShortCode(length = 6) {
  // Allowed characters: 26 uppercase + 26 lowercase + 10 digits = 62 chars
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';

  // Generate `length` cryptographically-strong random bytes.
  // Using `crypto.randomBytes` gives us secure randomness suitable for tokens.
  const bytes = crypto.randomBytes(length);

  // Map each random byte to one character from `chars`.
  // We use modulo to reduce the byte range (0..255) into the range of
  // valid character indices (0..chars.length-1).
  for (let i = 0; i < length; i++) {
    shortCode += chars[bytes[i] % chars.length];
  }

  return shortCode;
}

module.exports = generateShortCode;