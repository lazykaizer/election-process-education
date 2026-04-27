'use strict';

/**
 * @fileoverview Voice configuration for Google Cloud Text-to-Speech.
 * @module constants/voices
 */

/**
 * Mapping of language codes to specific Google Cloud TTS voices.
 * @type {Object<string, {languageCode: string, name: string}>}
 */
const TTS_VOICES = {
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
  ta: { languageCode: 'ta-IN', name: 'ta-IN-Neural2-A' },
  te: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
  kn: { languageCode: 'kn-IN', name: 'kn-IN-Standard-A' },
  mr: { languageCode: 'mr-IN', name: 'mr-IN-Standard-A' },
  bn: { languageCode: 'bn-IN', name: 'bn-IN-Standard-A' },
  gu: { languageCode: 'gu-IN', name: 'gu-IN-Standard-A' },
  pa: { languageCode: 'pa-IN', name: 'pa-IN-Standard-A' },
  ml: { languageCode: 'ml-IN', name: 'ml-IN-Standard-A' },
  en: { languageCode: 'en-IN', name: 'en-IN-Neural2-A' },
};

module.exports = { TTS_VOICES };
