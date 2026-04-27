/**
 * @fileoverview Naagrik AI — Express backend server
 * @description AI-powered Indian election education platform.
 *   Provides election data, Gemini-powered chat, quiz engine,
 *   multilingual support, and comprehensive Google Cloud service integrations:
 *   - Gemini 2.0 Flash for bilingual election Q&A
 *   - Cloud Translation API for 10 Indian languages
 *   - Cloud Text-to-Speech API for accessibility
 *   - Cloud Vision API for Voter ID verification (OCR)
 *   - Cloud Natural Language API for text analysis
 *   - BigQuery for analytics data export
 *   - Google Analytics (GA4) for frontend tracking
 *   - Google Cloud Run for serverless hosting
 *   - Google Cloud Build for CI/CD
 *   - Google Fonts for premium typography
 * @module server
 * @version 2.0.0
 */

'use strict';

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const compress = require('compression');
const path     = require('path');

const { validateEnvironment, requestLogger } = require('./middleware/index');
const configRouter   = require('./routes/config');
const electionRouter = require('./routes/election');
const aiRouter       = require('./routes/ai');
const { ELECTION_DATA } = require('./data/electionData');

validateEnvironment();

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Security & Middleware ─────────────────────────────────────────────────────

app.use(compress());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'",
                   'https://www.gstatic.com',
                   'https://apis.google.com',
                   'https://www.googletagmanager.com',
                   'https://www.google-analytics.com'],
      styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'",
                   'https://*.googleapis.com',
                   'https://www.gstatic.com',
                   'https://www.google-analytics.com'],
      imgSrc:     ["'self'", 'data:', 'https:'],
    },
  },
}));

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// ── API Routes ────────────────────────────────────────────────────────────────

app.use('/api', configRouter);
app.use('/api', electionRouter);
app.use('/api', aiRouter);

// ── Static Files & SPA Fallback ───────────────────────────────────────────────

app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
}));

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ── Global Error Handler ──────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

// ── Start Server ──────────────────────────────────────────────────────────────

const server = app.listen(PORT, () => {
  console.log(`🇮🇳 Naagrik AI on http://localhost:${PORT}`);
  console.log(`Gemini: ${process.env.GEMINI_API_KEY ? 'configured ✓' : 'demo mode'}`);
  console.log(`Cloud APIs: ${process.env.GOOGLE_CLOUD_API_KEY ? 'configured ✓' : 'demo mode'}`);
});

module.exports = { app, server, ELECTION_DATA };
