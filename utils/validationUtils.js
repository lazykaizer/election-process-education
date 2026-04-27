'use strict';

/**
 * @fileoverview Validation utility functions.
 * @module utils/validationUtils
 */

/**
 * Escapes HTML characters in a string to prevent XSS.
 * @param {string} str - Input string
 * @returns {string} Escaped string
 */
function escHtml(str) {
  if (typeof str !== 'string') return '';
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

module.exports = { escHtml, validateString };
