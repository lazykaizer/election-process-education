'use strict';

/**
 * @fileoverview Express middleware — environment validation, request logging, security.
 * @module middleware/index
 */

/**
 * Validates required environment variables at startup.
 * Logs warnings for missing optional vars, but does not crash —
 * services degrade gracefully to demo mode.
 */
function validateEnvironment() {
  const recommended = ['GEMINI_API_KEY', 'GOOGLE_CLOUD_API_KEY'];
  const missing = recommended.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.warn(`⚠️  Missing env vars: ${missing.join(', ')} — running in demo mode`);
  } else {
    console.log('✅ All recommended environment variables are configured.');
  }
}

/**
 * Express middleware that logs each incoming request.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
}

/**
 * Escapes HTML characters in a string to prevent XSS.
 * @param {string} str - Input string
 * @returns {string} Escaped string
 */
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validates that a value is a non-empty string within max length.
 * @param {*} value    - Value to validate
 * @param {string} name - Field name for error messages
 * @param {number} maxLength - Maximum allowed length
 * @returns {{ valid: boolean, error?: string }}
 */
function validateString(value, name, maxLength = 1000) {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${name} is required and must be a string.` };
  }
  if (value.trim().length === 0) {
    return { valid: false, error: `${name} cannot be empty.` };
  }
  if (value.length > maxLength) {
    return { valid: false, error: `${name} too long. Max ${maxLength} characters.` };
  }
  return { valid: true };
}

module.exports = { validateEnvironment, requestLogger, escHtml, validateString };
