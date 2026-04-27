'use strict';

/**
 * @fileoverview AI routes — Chat, Translation, TTS, Vision OCR, NL Analysis, Analytics.
 * All routes gracefully degrade to demo mode when API keys are not configured.
 * @module routes/ai
 */

const express = require('express');
const { LANGUAGE_CODES, translateWithCloudAPI, textToSpeech, extractTextFromImage, analyzeText, exportToBigQuery } = require('../services/googleCloud');
const { buildSystemPrompt } = require('../services/gemini');
const { apiLimiter, chatLimiter } = require('../middleware/rateLimiters');
const { validateString } = require('../middleware/index');
const { ELECTION_DATA } = require('../data/electionData');

const router = express.Router();

const SUPPORTED_LANGUAGES = ['hindi', 'tamil', 'telugu', 'kannada', 'marathi', 'bengali', 'gujarati', 'punjabi', 'malayalam', 'odia'];

/**
 * Provides instant grounded responses for common keywords to bypass API quota/latency.
 */
function getGroundedResponse(msg) {
  const query = msg.toLowerCase();
  if (query.includes('register') || query.includes('form 6')) return "🗳️ **How to Register to Vote:**\n\n1. Visit **voters.eci.gov.in**.\n2. Fill **Form 6** for new registration.\n3. Verification by BLO.\n\nHelpline: **1950**.";
  if (query.includes('evm')) return "📟 **EVM:** Standalone devices for casting votes since 1982. 100% tamper-proof.";
  if (query.includes('vvpat')) return "🧾 **VVPAT:** Prints a slip for 7 seconds to verify your vote.";
  if (query.includes('nota')) return "🔘 **NOTA:** Option to reject all candidates officially.";
  if (query.includes('id') || query.includes('epic')) return "🪪 **Documents:** Voter ID (EPIC), Aadhaar, PAN, Passport, etc.";
  if (query.includes('lok sabha')) return "🏛️ **Lok Sabha:** 543 seats, 5-year term. Next: 2029.";
  return null;
}

/** @route POST /api/chat — Gemini-powered election AI chat */
router.post('/chat', chatLimiter, async (req, res) => {
  const { message, history = [] } = req.body;

  const msgCheck = validateString(message, 'message', 1000);
  if (!msgCheck.valid) return res.status(400).json({ error: msgCheck.error });

  // 1. Check for Grounded (Instant) Response first
  const groundedResponse = getGroundedResponse(message);
  if (groundedResponse) return res.json({ reply: groundedResponse });

  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'history must be an array.' });
  }

  const VALID_ROLES = new Set(['user', 'model']);
  const historyValid = history.every(
    h => h && typeof h.role === 'string' && VALID_ROLES.has(h.role) && typeof h.text === 'string'
  );
  if (!historyValid) {
    return res.status(400).json({ error: 'history items must have role (user|model) and text fields.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      reply: "👋 Namaste! I'm **Naagrik AI**, your Indian elections guide.\n\nI'm running in demo mode. Once configured with Gemini API, I can answer:\n• How do I register to vote?\n• What is NOTA?\n• How does the EVM work?\n• When are the next elections?\n\nContact: Voter Helpline **1950**",
      demo: true,
    });
  }

  try {
    console.log(`[Chat] Using Gemini Flash Lite with key: ${apiKey.substring(0, 8)}...`);
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: message.trim() }] }
          ],
          system_instruction: {
            parts: [{ text: buildSystemPrompt() }]
          },
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.9 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.json().catch(() => ({}));
      console.error('Gemini error:', geminiRes.status, errBody);
      return res.status(502).json({ error: 'AI service temporarily unavailable. Please try again.' });
    }

    const data  = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) return res.status(502).json({ error: 'Empty response from AI. Please try again.' });

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/** @route POST /api/translate — Cloud Translation API */
router.post('/translate', apiLimiter, async (req, res) => {
  const { text, language } = req.body;

  const textCheck = validateString(text, 'text', 1000);
  if (!textCheck.valid) return res.status(400).json({ error: textCheck.error });

  if (!language || !SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    return res.status(400).json({ error: `Unsupported language. Choose from: ${SUPPORTED_LANGUAGES.join(', ')}.` });
  }

  try {
    const result = await translateWithCloudAPI(
      text,
      language,
      process.env.GOOGLE_CLOUD_API_KEY,
      process.env.GEMINI_API_KEY
    );
    res.json({
      original:         text,
      translated:       result.translated,
      language,
      service:          result.service,
      detectedLanguage: result.detectedLanguage,
    });
  } catch (err) {
    console.error('Translation error:', err.message);
    res.status(502).json({ error: 'Translation service unavailable. Please try again.' });
  }
});

/** @route POST /api/text-to-speech — Cloud TTS API */
router.post('/text-to-speech', apiLimiter, async (req, res) => {
  const { text, language = 'en' } = req.body;

  const textCheck = validateString(text, 'text', 500);
  if (!textCheck.valid) return res.status(400).json({ error: textCheck.error });

  const langCode = LANGUAGE_CODES[language.toLowerCase()] || language;
  const apiKey   = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    return res.json({
      audioContent: null,
      service:      'demo',
      message:      'Text-to-Speech API not configured. Set GOOGLE_CLOUD_API_KEY.',
      demo:         true,
    });
  }

  try {
    const result = await textToSpeech(text, langCode, apiKey);
    if (result) {
      res.json({
        audioContent:   result.audioContent,
        service:        result.service,
        language:       langCode,
        characterCount: text.length,
      });
    } else {
      res.status(502).json({ error: 'Text-to-Speech service unavailable.' });
    }
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).json({ error: 'Speech synthesis failed.' });
  }
});

/** @route POST /api/vision/verify-voter-id — Cloud Vision OCR */
router.post('/vision/verify-voter-id', apiLimiter, async (req, res) => {
  const { image } = req.body;

  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: 'image (base64) is required.' });
  }

  const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
  if (base64Data.length > 5_000_000) {
    return res.status(400).json({ error: 'Image too large. Max 5MB.' });
  }

  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    return res.json({
      extracted: {
        epicNumber: 'ABC1234567',
        name:       'DEMO USER',
        address:    '123 Demo Street, City',
        fatherName: 'DEMO FATHER',
      },
      confidence: 0.95,
      service:    'demo',
      demo:       true,
      message:    'Vision API not configured. Showing demo data.',
    });
  }

  try {
    const result = await extractTextFromImage(base64Data, apiKey);

    if (result && result.text) {
      const epicMatch = result.text.match(/[A-Z]{3}\d{7}/);
      const lines     = result.text.split('\n').filter(l => l.trim());

      const extracted = {
        epicNumber: epicMatch ? epicMatch[0] : null,
        rawText:    result.text.substring(0, 500),
        lineCount:  lines.length,
      };

      res.json({
        extracted,
        isValidVoterID: !!epicMatch && lines.length > 3,
        confidence:     result.confidence,
        service:        result.service,
      });
    } else {
      res.status(422).json({ error: 'Could not extract text from image.' });
    }
  } catch (err) {
    console.error('Vision API error:', err.message);
    res.status(500).json({ error: 'Image processing failed.' });
  }
});

/** @route POST /api/analyze — Cloud Natural Language API */
router.post('/analyze', apiLimiter, async (req, res) => {
  const { text } = req.body;

  const textCheck = validateString(text, 'text', 2000);
  if (!textCheck.valid) return res.status(400).json({ error: textCheck.error });

  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    return res.json({
      entities: [
        { name: 'Election Commission', type: 'ORGANIZATION', salience: 0.85 },
        { name: 'India', type: 'LOCATION', salience: 0.72 },
      ],
      service: 'demo',
      demo: true,
    });
  }

  try {
    const result = await analyzeText(text, apiKey);
    if (result) {
      res.json(result);
    } else {
      res.status(502).json({ error: 'NL API unavailable.' });
    }
  } catch (err) {
    console.error('NL API error:', err.message);
    res.status(500).json({ error: 'Text analysis failed.' });
  }
});

/** @route POST /api/analytics/export — BigQuery export */
router.post('/analytics/export', apiLimiter, async (req, res) => {
  const { eventType, eventData, sessionId } = req.body;
  const VALID_EVENTS = ['quiz_complete', 'chat_message', 'page_view', 'translation', 'tts_request', 'voter_id_scan'];

  if (!eventType || !VALID_EVENTS.includes(eventType)) {
    return res.status(400).json({ error: `Invalid eventType. Valid: ${VALID_EVENTS.join(', ')}` });
  }
  if (!eventData || typeof eventData !== 'object') {
    return res.status(400).json({ error: 'eventData object is required.' });
  }

  try {
    const result = await exportToBigQuery(eventType, { ...eventData, sessionId });
    res.json(result);
  } catch (err) {
    console.error('BigQuery export error:', err.message);
    res.status(500).json({ error: 'Analytics export failed.' });
  }
});

module.exports = router;
