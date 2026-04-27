import React, { useState } from 'react';
import { Loader2, Languages, ArrowRight } from 'lucide-react';

const TARGET_LANGUAGES = {
  hi: 'Hindi',
  bn: 'Bengali',
  te: 'Telugu',
  mr: 'Marathi',
  ta: 'Tamil',
  ur: 'Urdu',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
  pa: 'Punjabi'
};

export default function TranslatorTool() {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('hi');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter text to translate.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: targetLang })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to translate');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyzer-container translator-tool">
      <div className="analyzer-header">
        <h3><Languages size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Instant Translate</h3>
        <p>Translate election information into 10 regional Indian languages via Cloud Translation API.</p>
      </div>

      <div className="analyzer-input-group">
        <textarea 
          placeholder="Enter text to translate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="analyzer-textarea"
        />
        
        <div className="translator-controls">
          <select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)}
            className="translator-select"
          >
            {Object.entries(TARGET_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>

          <button 
            onClick={handleTranslate} 
            disabled={loading || !text.trim()}
            className="analyzer-btn translator-btn"
          >
            {loading ? <><Loader2 className="spin" size={18} /> Translating...</> : <>Translate <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>

      {error && (
        <div className="analyzer-error">
          {error}
        </div>
      )}

      {result && (
        <div className="analyzer-result-box translator-result">
          <div className="result-section">
            <h4 style={{ color: 'var(--green)' }}>Translated ({TARGET_LANGUAGES[result.language] || result.language})</h4>
            <p className="translated-text">{result.translated}</p>
          </div>
          
          {result.service === 'demo' && (
            <div className="demo-badge">⚠️ Using demo response. Translation API key not set.</div>
          )}
        </div>
      )}
    </div>
  );
}
