const request = require('supertest');
const { app, server } = require('../server');

afterAll((done) => {
  server.close(done);
});

describe('Naagrik AI - API Integration Tests', () => {
  // ── Config & Health ──
  describe('GET /api/health', () => {
    it('should return 200 OK with health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /api/config', () => {
    it('should return 200 OK with config features', async () => {
      const res = await request(app).get('/api/config');
      expect(res.statusCode).toBe(200);
      expect(res.body.appName).toBe('Naagrik AI');
      expect(res.body.features).toHaveProperty('geminiChat');
      expect(res.body.features).toHaveProperty('cloudTranslation');
      expect(res.body.supportedLanguages).toContain('hindi');
    });
  });

  describe('GET /api/services', () => {
    it('should return list of integrated Google services', async () => {
      const res = await request(app).get('/api/services');
      expect(res.statusCode).toBe(200);
      expect(res.body.services.length).toBeGreaterThan(0);
      expect(res.body.total).toBe(res.body.services.length);
      const serviceNames = res.body.services.map(s => s.name);
      expect(serviceNames).toContain('Gemini 2.0 Flash');
      expect(serviceNames).toContain('Cloud Translation API');
      expect(serviceNames).toContain('Cloud Vision API');
      expect(serviceNames).toContain('BigQuery');
    });
  });

  // ── Election Data Routes ──
  describe('GET /api/election', () => {
    it('should return cached election data summary', async () => {
      const res = await request(app).get('/api/election');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('keyFacts');
      expect(res.body).toHaveProperty('electionTypes');
      expect(res.body.keyFacts.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/steps', () => {
    it('should return voting steps', async () => {
      const res = await request(app).get('/api/steps');
      expect(res.statusCode).toBe(200);
      expect(res.body.steps).toBeDefined();
      expect(res.body.steps.length).toBe(7); // We defined 7 steps
    });
  });

  describe('GET /api/quiz', () => {
    it('should return quiz questions', async () => {
      const res = await request(app).get('/api/quiz');
      expect(res.statusCode).toBe(200);
      expect(res.body.questions.length).toBeGreaterThan(0);
      expect(res.body.total).toBe(res.body.questions.length);
    });
  });

  describe('POST /api/quiz/submit', () => {
    it('should grade the quiz correctly', async () => {
      const res = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: [1, 1, 1, 2, 2], sessionId: 'test-session' }); // Partial answers
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('score');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('percentage');
      expect(res.body.results.length).toBe(5);
    });

    it('should return 400 for missing answers array', async () => {
      const res = await request(app).post('/api/quiz/submit').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/answers array is required/);
    });
  });

  describe('GET /api/parliament', () => {
    it('should return lokSabha and rajyaSabha info', async () => {
      const res = await request(app).get('/api/parliament');
      expect(res.statusCode).toBe(200);
      expect(res.body.lokSabha.seats).toBe(543);
      expect(res.body.rajyaSabha.seats).toBe(245);
    });
  });

  describe('GET /api/president', () => {
    it('should return president info', async () => {
      const res = await request(app).get('/api/president');
      expect(res.statusCode).toBe(200);
      expect(res.body.president.current).toBe('Droupadi Murmu');
      expect(res.body.vicePresident.current).toBe('Jagdeep Dhankhar');
    });
  });

  describe('GET /api/states', () => {
    it('should return states data', async () => {
      const res = await request(app).get('/api/states');
      expect(res.statusCode).toBe(200);
      expect(res.body.states.length).toBeGreaterThan(0);
      expect(res.body.states[0].state).toBe('Uttar Pradesh');
    });
  });

  describe('GET /api/dates', () => {
    it('should return upcoming dates', async () => {
      const res = await request(app).get('/api/dates');
      expect(res.statusCode).toBe(200);
      expect(res.body.dates.length).toBeGreaterThan(0);
    });
  });

  // ── AI Integration Routes ──
  // Note: These will return 200 with "demo" flags if keys are not set,
  // or act correctly if keys are set. We test the API contract here.
  
  describe('POST /api/chat', () => {
    it('should return a response for a chat message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is NOTA?' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('reply');
    });

    it('should return 400 for empty message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid history', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hi', history: [{ role: 'alien', text: 'Hi' }] });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/translate', () => {
    it('should return translated text', async () => {
      const res = await request(app)
        .post('/api/translate')
        .send({ text: 'Hello', language: 'hindi' });
      expect(res.statusCode).toBe(200);
      expect(res.body.original).toBe('Hello');
      expect(res.body).toHaveProperty('translated');
      expect(res.body.language).toBe('hindi');
    });

    it('should return 400 for unsupported language', async () => {
      const res = await request(app)
        .post('/api/translate')
        .send({ text: 'Hello', language: 'martian' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/text-to-speech', () => {
    it('should return audio content (or demo flag)', async () => {
      const res = await request(app)
        .post('/api/text-to-speech')
        .send({ text: 'Test audio' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('service');
    });
  });

  describe('POST /api/vision/verify-voter-id', () => {
    it('should reject non-base64 image', async () => {
      const res = await request(app)
        .post('/api/vision/verify-voter-id')
        .send({ image: null });
      expect(res.statusCode).toBe(400);
    });

    it('should return extraction data for valid image string', async () => {
      const res = await request(app)
        .post('/api/vision/verify-voter-id')
        .send({ image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('extracted');
      expect(res.body).toHaveProperty('confidence');
    });
  });

  describe('POST /api/analyze', () => {
    it('should analyze text and return entities', async () => {
      const res = await request(app)
        .post('/api/analyze')
        .send({ text: 'The Election Commission of India is in New Delhi.' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('entities');
    });
  });

  describe('POST /api/analytics/export', () => {
    it('should accept valid analytics event', async () => {
      const res = await request(app)
        .post('/api/analytics/export')
        .send({ eventType: 'page_view', eventData: { path: '/' } });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject invalid event type', async () => {
      const res = await request(app)
        .post('/api/analytics/export')
        .send({ eventType: 'hack_attempt', eventData: {} });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Additional Security & Health Tests', () => {
    it('GET /api/health should return status 200', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('should return 429 after 50 requests (test mode limit)', async () => {
      // In test mode, limit is 50. 
      // We send 50 requests sequentially to avoid open handles and ensure they all count.
      for (let i = 0; i < 50; i++) {
        await request(app).get('/api/health');
      }
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(429);
    });
  });
});
