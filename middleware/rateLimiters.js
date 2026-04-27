'use strict';

/**
 * @fileoverview Rate limiting middleware using express-rate-limit.
 * Separate limiters for different API categories.
 * @module middleware/rateLimiters
 */

const rateLimit = require('express-rate-limit');

/** General API rate limiter: 100 requests per minute */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a minute.' },
});

/** Chat-specific rate limiter: 20 requests per minute */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many chat requests. Please wait a moment.' },
});

module.exports = { apiLimiter, chatLimiter };
