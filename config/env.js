'use strict';

/**
 * @fileoverview Environment validation and configuration.
 * @module config/env
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

module.exports = { validateEnvironment };
