'use strict';

/**
 * @fileoverview AI helper functions for chat grounding, history validation, and API calls.
 * @module utils/aiHelpers
 */

const { ELECTION_DATA } = require('../constants/electionData');

/**
 * Builds a comprehensive system prompt for Gemini AI.
 * Contains all election facts, steps, terms and guidelines.
 * @returns {string} Complete system prompt string
 */
function buildSystemPrompt() {
  const steps = ELECTION_DATA.votingSteps
    .map(s => `  Step ${s.step}: ${s.title} — ${s.description}`)
    .join('\n');

  const types = ELECTION_DATA.electionTypes
    .map(t => `  • ${t.name}: ${t.desc} (Next: ${t.nextDue})`)
    .join('\n');

  const terms = ELECTION_DATA.keyTerms
    .map(t => `  - ${t.term}: ${t.full} — ${t.desc}`)
    .join('\n');

  const topStates = ELECTION_DATA.topStatesBySeats
    .map(s => `  ${s.state}: ${s.seats}`)
    .join(' | ');

  return `You are Naagrik AI, an expert assistant on Indian elections and the democratic process.

MISSION: Help Indian citizens understand how elections work, how to vote, how to register, and their rights.

KEY FACTS:
- Governed by: Election Commission of India (ECI) at eci.gov.in
- Eligible voters: ${ELECTION_DATA.keyFacts[0].value}
- Lok Sabha seats: ${ELECTION_DATA.keyFacts[1].value}
- Polling stations: ${ELECTION_DATA.keyFacts[2].value}
- Voting age: 18 years (since 61st Constitutional Amendment, 1989)
- Voter Helpline: 1950

ELECTION TYPES:
${types}

HOW TO VOTE (Step by Step):
${steps}

VOTER REGISTRATION:
- Apply online at voters.eci.gov.in or Voter Helpline App
- Fill Form 6 (new registration), Form 6A (NRI), Form 8 (corrections)
- Documents: age proof + address proof + photo
- Track status on NVSP portal

KEY TERMS:
${terms}

PARLIAMENT:
- Lok Sabha: ${ELECTION_DATA.parliament.lokSabha.seats} seats, ${ELECTION_DATA.parliament.lokSabha.term} term, direct vote, ${ELECTION_DATA.parliament.lokSabha.ageRequirement}+ age, Speaker: ${ELECTION_DATA.parliament.lokSabha.speaker}
  • ${ELECTION_DATA.parliament.lokSabha.reservedSeats} reserved seats, current: ${ELECTION_DATA.parliament.lokSabha.current}
- Rajya Sabha: ${ELECTION_DATA.parliament.rajyaSabha.seats} seats (${ELECTION_DATA.parliament.rajyaSabha.composition}), ${ELECTION_DATA.parliament.rajyaSabha.term}

PRESIDENT & VICE PRESIDENT:
- President: ${ELECTION_DATA.president.current} (${ELECTION_DATA.president.number}, since ${ELECTION_DATA.president.since})
  • Elected by ${ELECTION_DATA.president.electorate}
  • Uses ${ELECTION_DATA.president.votingSystem}
  • Eligibility: ${ELECTION_DATA.president.eligibility}
- Vice President: ${ELECTION_DATA.vicePresident.current} (${ELECTION_DATA.vicePresident.number})
  • ${ELECTION_DATA.vicePresident.role}

TOP STATES BY LOK SABHA SEATS:
${topStates}

IMPORTANT RESOURCES:
${ELECTION_DATA.resources.map(r => `- ${r.name}: ${r.url}`).join('\n')}

YOUR BEHAVIOUR:
- Be helpful, accurate, and encouraging about democratic participation
- Use simple language accessible to first-time voters
- Answer in the same language as the question (Hindi or English)
- When asked in Hindi, respond in Hindi
- Do NOT fabricate election results, candidate names, or specific vote counts
- Always encourage citizens to verify on official ECI sources
- Be politically neutral — never favour any party or candidate`;
}

/**
 * Provides instant grounded responses for common keywords to bypass API quota/latency.
 * @param {string} msg - User message
 * @returns {string|null} Grounded response or null if no keyword match
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

/**
 * Validates the chat history array format.
 * @param {Array} history - Chat history array
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
function validateChatHistory(history) {
  if (!Array.isArray(history)) {
    return { valid: false, error: 'history must be an array.' };
  }
  const VALID_ROLES = new Set(['user', 'ai']); // Standardized to 'ai'
  const historyValid = history.every(
    h => h && typeof h.role === 'string' && VALID_ROLES.has(h.role) && typeof h.text === 'string'
  );
  if (!historyValid) {
    return { valid: false, error: 'history items must have role (user|ai) and text fields.' };
  }
  return { valid: true };
}

/**
 * Calls the Gemini API via REST.
 * @param {string} apiKey - Gemini API Key
 * @param {string} message - User message
 * @param {Array} history - Validated chat history
 * @returns {Promise<string>} AI reply
 */
async function callGeminiAPI(apiKey, message, history) {
  console.log(`[Chat] Using Gemini Flash Lite with key: ${apiKey.substring(0, 8)}...`);
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        contents: [
          ...history.map(h => ({ role: h.role === 'ai' ? 'model' : h.role, parts: [{ text: h.text }] })),
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
    throw new Error('AI service temporarily unavailable.');
  }

  const data = await geminiRes.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error('Empty response from AI.');
  
  return reply;
}

module.exports = { buildSystemPrompt, getGroundedResponse, validateChatHistory, callGeminiAPI };
