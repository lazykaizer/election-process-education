'use strict';

/**
 * @fileoverview Express middleware — request logging and security.
 * @module middleware/index
 */

/**
 * Express middleware that logs each incoming request.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  // Add Request ID for traceability
  const requestId = req.get('x-request-id') || Math.random().toString(36).substring(2, 11);
  res.set('x-request-id', requestId);
  req.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[${requestId}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
}

/**
 * Validation middleware to enforce max length on chat input.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateChatInput(req, res, next) {
  if (req.path === '/chat' && req.method === 'POST') {
    const { message } = req.body;
    if (message && message.length > 500) {
      return res.status(400).json({ error: 'Message exceeds maximum length of 500 characters.' });
    }
  }
  next();
}

module.exports = { requestLogger, validateChatInput };
