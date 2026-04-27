import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(function() {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock window.gtag to prevent analytics errors in tests
window.gtag = vi.fn();

// Mock global fetch for API calls in tests
global.fetch = vi.fn((url, options) => {
  if (url === '/api/chat') {
    return Promise.resolve({
      json: () => Promise.resolve({ reply: 'NOTA = None of the Above' })
    });
  }
  return Promise.resolve({
    json: () => Promise.resolve({})
  });
});
