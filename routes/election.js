'use strict';

/**
 * @fileoverview Election data routes — steps, quiz, dates, parliament, states, leaderboard.
 * Serves structured election data from the data module.
 * @module routes/election
 */

const express = require('express');
const { ELECTION_DATA } = require('../constants/electionData');
const cache = require('../services/cache');
const { apiLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

/**
 * @route GET /api/election
 * @desc Retrieves a summary of all election data (facts, types, terms, resources).
 */
router.get('/election', apiLimiter, (req, res) => {
  const cached = cache.get('election');
  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }

  const data = {
    keyFacts:      ELECTION_DATA.keyFacts,
    electionTypes: ELECTION_DATA.electionTypes,
    keyTerms:      ELECTION_DATA.keyTerms,
    resources:     ELECTION_DATA.resources,
  };
  cache.set('election', data, 60000);
  res.set('X-Cache', 'MISS');
  res.json(data);
});

/**
 * @route GET /api/steps
 * @desc Retrieves step-by-step voting process guides.
 */
router.get('/steps', apiLimiter, (req, res) => {
  res.json({ steps: ELECTION_DATA.votingSteps });
});

/**
 * @route GET /api/quiz
 * @desc Retrieves educational quiz questions.
 */
router.get('/quiz', apiLimiter, (req, res) => {
  res.json({ questions: ELECTION_DATA.quizQuestions, total: ELECTION_DATA.quizQuestions.length });
});

/**
 * @route POST /api/quiz/submit
 * @desc Evaluates quiz answers and returns score/feedback.
 */
router.post('/quiz/submit', apiLimiter, (req, res) => {
  const { answers, sessionId } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers array is required.' });
  }

  const questions = ELECTION_DATA.quizQuestions;
  let score = 0;
  const results = answers.map((a, i) => {
    const q = questions[i];
    if (!q) return { questionIndex: i, error: 'Question not found' };
    const correct = a === q.answer;
    if (correct) score++;
    return {
      questionIndex: i,
      correct,
      userAnswer: a,
      correctAnswer: q.answer,
      explanation: q.explanation,
    };
  });

  res.json({
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    results,
    sessionId: sessionId || 'anonymous',
  });
});

/**
 * @route GET /api/parliament
 * @desc Retrieves information about Lok Sabha and Rajya Sabha.
 */
router.get('/parliament', apiLimiter, (req, res) => {
  res.json({
    lokSabha:  ELECTION_DATA.parliament.lokSabha,
    rajyaSabha: ELECTION_DATA.parliament.rajyaSabha,
  });
});

/**
 * @route GET /api/president
 * @desc Retrieves information about the President and Vice President.
 */
router.get('/president', apiLimiter, (req, res) => {
  res.json({
    president:     ELECTION_DATA.president,
    vicePresident: ELECTION_DATA.vicePresident,
  });
});

/**
 * @route GET /api/states
 * @desc Retrieves list of states sorted by Lok Sabha seat counts.
 */
router.get('/states', apiLimiter, (req, res) => {
  res.json({ states: ELECTION_DATA.topStatesBySeats });
});

/**
 * @route GET /api/dates
 * @desc Retrieves upcoming election dates and schedule.
 */
router.get('/dates', apiLimiter, (req, res) => {
  res.json({ dates: ELECTION_DATA.upcomingDates });
});

/**
 * @route GET /api/announcements
 * @desc Retrieves latest official announcements from ECI.
 */
router.get('/announcements', apiLimiter, (req, res) => {
  res.json({ announcements: ELECTION_DATA.announcements });
});

/**
 * @route GET /api/leaderboard
 * @desc Retrieves the top scores from the educational quiz.
 */
const leaderboard = [];
router.get('/leaderboard', apiLimiter, (req, res) => {
  const top10 = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);
  res.json({ leaderboard: top10 });
});

/**
 * @route POST /api/leaderboard
 * @desc Submits a new score to the leaderboard.
 */
router.post('/leaderboard', apiLimiter, (req, res) => {
  const { name, score, total, sessionId } = req.body;
  if (typeof score !== 'number' || typeof total !== 'number') {
    return res.status(400).json({ error: 'score and total are required numbers.' });
  }
  const entry = {
    name: (name || 'Anonymous').substring(0, 50),
    score,
    total,
    percentage: Math.round((score / total) * 100),
    sessionId: sessionId || 'anonymous',
    timestamp: new Date().toISOString(),
  };
  leaderboard.push(entry);
  res.json({ success: true, entry, rank: leaderboard.filter(e => e.score >= score).length });
});

module.exports = router;
