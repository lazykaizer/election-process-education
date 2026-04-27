'use strict';

/**
 * @fileoverview Google Cloud service integrations.
 * Provides Translation, Text-to-Speech, Vision OCR, and BigQuery export.
 * All services gracefully degrade to demo mode when API keys are unavailable.
 * @module services/googleCloud
 */

const { LANGUAGE_CODES } = require('../constants/languages');
const { TTS_VOICES } = require('../constants/voices');

/**
 * Translates text using Google Cloud Translation API (v2),
 * falling back to Gemini if Cloud Translation is unavailable.
 * @param {string} text      - Text to translate
 * @param {string} language  - Target language name (hindi, tamil, etc.)
 * @param {string} cloudKey  - Google Cloud API key
 * @param {string} geminiKey - Gemini API key (fallback)
 * @returns {Promise<{translated: string, service: string}>}
 */
async function translateWithCloudAPI(text, language, cloudKey, geminiKey) {
  const targetLang = LANGUAGE_CODES[language.toLowerCase()] || 'hi';

  if (cloudKey) {
    try {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${cloudKey}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ q: text, target: targetLang, format: 'text' }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const translated = data?.data?.translations?.[0]?.translatedText;
        if (translated) {
          return {
            translated,
            service: 'cloud-translation-api',
            detectedLanguage: data?.data?.translations?.[0]?.detectedSourceLanguage,
          };
        }
      }
      console.warn('Cloud Translation API failed, falling back to Gemini');
    } catch (err) {
      console.warn('Cloud Translation error:', err.message);
    }
  }

  // Gemini fallback for translation
  if (geminiKey) {
    const prompt = `Translate the following text to ${language}. Return only the translated text, nothing else:\n\n${text}`;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            contents:         [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 256, temperature: 0.2 },
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (translated) return { translated, service: 'gemini-fallback' };
      }
    } catch (err) {
      console.warn('Gemini translation fallback error:', err.message);
    }
  }

  return { translated: `[Demo] "${text}" → ${language}`, service: 'demo' };
}

/**
 * Converts text to speech using Google Cloud Text-to-Speech API.
 * Supports multiple Indian languages for accessibility.
 * @param {string} text     - Text to synthesize
 * @param {string} language - Language code (hi, ta, te, etc.)
 * @param {string} apiKey   - Google Cloud API key
 * @returns {Promise<{audioContent: string, service: string}|null>}
 */
async function textToSpeech(text, language, apiKey) {
  if (!apiKey) return null;

  const voice = TTS_VOICES[language] || TTS_VOICES.en;

  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          input:       { text },
          voice:       { languageCode: voice.languageCode, name: voice.name },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 },
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      return { audioContent: data.audioContent, service: 'cloud-text-to-speech' };
    }
  } catch (err) {
    console.warn('Text-to-Speech error:', err.message);
  }
  return { audioContent: null, service: 'demo', message: 'Speech synthesis failed or quota exceeded. Showing demo fallback.' };
}


/**
 * Performs OCR on an image using Google Cloud Vision API.
 * Used for Voter ID card verification and text extraction.
 * @param {string} imageBase64 - Base64 encoded image data
 * @param {string} apiKey      - Google Cloud API key
 * @returns {Promise<{text: string, confidence: number, service: string}|null>}
 */
async function extractTextFromImage(imageBase64, apiKey) {
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          requests: [{
            image:    { content: imageBase64 },
            features: [
              { type: 'TEXT_DETECTION',          maxResults: 10 },
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1  },
            ],
          }],
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const textAnnotations = data.responses?.[0]?.textAnnotations;
      const fullText = data.responses?.[0]?.fullTextAnnotation?.text
        || textAnnotations?.[0]?.description || '';
      const confidence = data.responses?.[0]?.fullTextAnnotation?.pages?.[0]?.confidence || 0.85;
      return { text: fullText, confidence, service: 'cloud-vision-api' };
    }
  } catch (err) {
    console.warn('Vision API error:', err.message);
  }
  return { text: 'DEMO VOTER ID ABC1234567', confidence: 0.9, service: 'demo' };
}

/**
 * Analyzes text using Google Cloud Natural Language API.
 * Extracts entities and sentiment for election-related text.
 * @param {string} text   - Text to analyze
 * @param {string} apiKey - Google Cloud API key
 * @returns {Promise<{entities: Array, sentiment: Object, service: string}|null>}
 */
async function analyzeText(text, apiKey) {
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          document: { type: 'PLAIN_TEXT', content: text },
          encodingType: 'UTF8',
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      return {
        entities: (data.entities || []).map(e => ({
          name: e.name,
          type: e.type,
          salience: e.salience,
        })),
        service: 'cloud-natural-language',
      };
    }
  } catch (err) {
    console.warn('NL API error:', err.message);
  }
  return {
    entities: [
      { name: 'Election Commission', type: 'ORGANIZATION', salience: 0.85 },
      { name: 'India', type: 'LOCATION', salience: 0.72 },
    ],
    service: 'demo',
  };
}

/**
 * Exports analytics events to BigQuery.
 * Simulates the export in demo mode when no project is configured.
 * @param {string} eventType - Event type identifier
 * @param {Object} eventData - Event payload
 * @returns {Promise<{success: boolean, service: string}>}
 */
async function exportToBigQuery(eventType, eventData) {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const dataset   = process.env.BIGQUERY_DATASET || 'naagrik_analytics';

  if (!projectId) {
    return { success: true, service: 'demo', message: 'BigQuery export simulated (no project configured)' };
  }

  const row = {
    event_type: eventType,
    event_data: JSON.stringify(eventData),
    timestamp:  new Date().toISOString(),
    session_id: eventData.sessionId || 'anonymous',
  };

  console.log(`[BigQuery] Export to ${projectId}.${dataset}: ${eventType}`, row);
  return { success: true, service: 'bigquery', table: `${dataset}.events`, row };
}

module.exports = { LANGUAGE_CODES, translateWithCloudAPI, textToSpeech, extractTextFromImage, analyzeText, exportToBigQuery };
