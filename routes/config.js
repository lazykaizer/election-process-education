'use strict';

/**
 * @fileoverview Config and health check routes.
 * @module routes/config
 */

const express = require('express');
const router = express.Router();

/** @route GET /api/health — Health check */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '2.0.0',
  });
});

/** @route GET /api/config — Public configuration (no secrets) */
router.get('/config', (req, res) => {
  res.json({
    appName: 'Naagrik AI',
    version: '2.0.0',
    features: {
      geminiChat:       !!process.env.GEMINI_API_KEY,
      cloudTranslation: !!process.env.GOOGLE_CLOUD_API_KEY,
      cloudTTS:         !!process.env.GOOGLE_CLOUD_API_KEY,
      cloudVision:      !!process.env.GOOGLE_CLOUD_API_KEY,
      cloudNLP:         !!process.env.GOOGLE_CLOUD_API_KEY,
      bigQuery:         !!process.env.GOOGLE_CLOUD_PROJECT_ID,
    },
    supportedLanguages: ['hindi', 'tamil', 'telugu', 'kannada', 'marathi', 'bengali', 'gujarati', 'punjabi', 'malayalam', 'odia'],
  });
});

/** @route GET /api/services — List integrated Google services */
router.get('/services', (req, res) => {
  res.json({
    services: [
      { name: 'Gemini 2.0 Flash', category: 'AI', status: process.env.GEMINI_API_KEY ? 'active' : 'demo', usage: 'Bilingual election Q&A with full ECI knowledge context' },
      { name: 'Cloud Translation API', category: 'AI/ML', status: process.env.GOOGLE_CLOUD_API_KEY ? 'active' : 'demo', usage: 'Translation to 10 Indian languages' },
      { name: 'Cloud Text-to-Speech API', category: 'AI/ML', status: process.env.GOOGLE_CLOUD_API_KEY ? 'active' : 'demo', usage: 'Audio output in 9 Indian languages for accessibility' },
      { name: 'Cloud Vision API', category: 'AI/ML', status: process.env.GOOGLE_CLOUD_API_KEY ? 'active' : 'demo', usage: 'OCR for Voter ID verification (EPIC extraction)' },
      { name: 'Cloud Natural Language API', category: 'AI/ML', status: process.env.GOOGLE_CLOUD_API_KEY ? 'active' : 'demo', usage: 'Entity extraction + sentiment analysis on election text' },
      { name: 'BigQuery', category: 'Data', status: process.env.GOOGLE_CLOUD_PROJECT_ID ? 'active' : 'demo', usage: 'Analytics event data warehousing' },
      { name: 'Google Cloud Run', category: 'Infrastructure', status: 'active', usage: 'Serverless containerised Node.js hosting' },
      { name: 'Google Cloud Build', category: 'CI/CD', status: 'active', usage: 'Automated build and deploy pipeline' },
      { name: 'Google Fonts', category: 'Design', status: 'active', usage: 'Playfair Display + DM Sans typography' },
      { name: 'Google Analytics (GA4)', category: 'Analytics', status: 'active', usage: 'Page views, chat messages, quiz completions tracking' },
    ],
    total: 10,
  });
});

module.exports = router;
