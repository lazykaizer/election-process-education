import React, { useState } from 'react';
import { Loader2, Activity, Tag, MessageSquare } from 'lucide-react';

export default function AIAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyzer-container">
      <div className="analyzer-header">
        <h3><Activity size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> AI Text Analyzer</h3>
        <p>Paste election-related text to extract key entities and sentiment using Google Cloud Natural Language API.</p>
      </div>

      <div className="analyzer-input-group">
        <textarea 
          placeholder="Paste news, speeches, or ECI announcements here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="analyzer-textarea"
        />
        <button 
          onClick={handleAnalyze} 
          disabled={loading || !text.trim()}
          className="analyzer-btn"
        >
          {loading ? <><Loader2 className="spin" size={18} /> Analyzing...</> : "Analyze Text"}
        </button>
      </div>

      {error && (
        <div className="analyzer-error">
          {error}
        </div>
      )}

      {result && (
        <div className="analyzer-result-box">
          <div className="result-section">
            <h4><Tag size={16} style={{ display: 'inline', marginRight: '6px' }} /> Extracted Entities</h4>
            {result.entities && result.entities.length > 0 ? (
              <div className="entity-tags">
                {result.entities.map((ent, idx) => (
                  <span key={idx} className={`entity-tag ${ent.type.toLowerCase()}`}>
                    {ent.name} <small>({ent.type})</small>
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-data">No significant entities found.</p>
            )}
          </div>
          
          {result.sentiment && (
            <div className="result-section sentiment-section">
              <h4><MessageSquare size={16} style={{ display: 'inline', marginRight: '6px' }} /> Sentiment Analysis</h4>
              <div className="sentiment-meter">
                <div className="sentiment-score">
                  <span className="label">Score:</span> 
                  <strong className={result.sentiment.score > 0 ? 'positive' : result.sentiment.score < 0 ? 'negative' : 'neutral'}>
                    {result.sentiment.score.toFixed(2)}
                  </strong>
                </div>
                <div className="sentiment-magnitude">
                  <span className="label">Magnitude:</span> <strong>{result.sentiment.magnitude.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {result.demo && (
            <div className="demo-badge">⚠️ Vision/NL APIs not configured. Showing demo data.</div>
          )}
        </div>
      )}
    </div>
  );
}
