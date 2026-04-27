'use strict';

/**
 * @fileoverview In-memory cache service with TTL support.
 * Used to reduce redundant API calls and improve response times.
 * @module services/cache
 */

const cache = new Map();

/**
 * Gets a cached value if it exists and has not expired.
 * @param {string} key - Cache key
 * @returns {*|null} Cached value or null if expired/missing
 */
function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Sets a value in the cache with a time-to-live.
 * @param {string} key   - Cache key
 * @param {*}      value - Value to cache
 * @param {number} ttl   - Time-to-live in milliseconds (default 30s)
 */
function set(key, value, ttl = 30000) {
  cache.set(key, { value, expiry: Date.now() + ttl });
}

/**
 * Clears all entries from the cache.
 */
function clear() {
  cache.clear();
}

/**
 * Returns the current number of entries in the cache.
 * @returns {number}
 */
function size() {
  return cache.size;
}

module.exports = { get, set, clear, size };
