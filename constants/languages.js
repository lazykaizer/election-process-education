'use strict';

/**
 * @fileoverview Language constants and mappings for Indian languages.
 * @module constants/languages
 */

/**
 * Supported Indian languages for translation and chat.
 * @type {string[]}
 */
const SUPPORTED_LANGUAGES = [
  'hindi',
  'tamil',
  'telugu',
  'kannada',
  'marathi',
  'bengali',
  'gujarati',
  'punjabi',
  'malayalam',
  'odia'
];

/**
 * Mapping of language names to Google Cloud language codes.
 * @type {Object<string, string>}
 */
const LANGUAGE_CODES = {
  hindi:     'hi-IN',
  tamil:     'ta-IN',
  telugu:    'te-IN',
  kannada:   'kn-IN',
  marathi:   'mr-IN',
  bengali:   'bn-IN',
  gujarati:  'gu-IN',
  punjabi:   'pa-IN',
  malayalam: 'ml-IN',
  odia:      'or-IN',
  english:   'en-US',
};

module.exports = { SUPPORTED_LANGUAGES, LANGUAGE_CODES };
