import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Floating AI Chatbot component for election guidance.
 * @param {Object} props - Component props
 * @param {string} props.lang - Current language ('en' or 'hi')
 * @param {Object} props.translations - Translation dictionary
 * @param {Function} props.getChatResponse - Function to fetch AI responses
 */
function FloatingChat({ lang, translations, getChatResponse }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const scrollRef = useRef(null);
  const tooltipTimer = useRef(null);
  const tooltipAutoHide = useRef(null);
  const t = translations[lang];

  const SUGGESTIONS = lang === 'hi' ? [
    "मैं वोट देने के लिए पंजीकरण कैसे करूँ?",
    "नोटा (NOTA) क्या है?",
    "EVM कैसे काम करता है?",
    "मेरा पोलिंग बूथ खोजें"
  ] : [
    "How do I register to vote?",
    "What is NOTA?",
    "How does EVM work?",
    "Find my polling booth"
  ];

  useEffect(() => {
    tooltipTimer.current = setTimeout(() => {
      setShowTooltip(true);
      tooltipAutoHide.current = setTimeout(() => {
        setShowTooltip(false);
      }, 6000);
    }, 4000);

    return () => {
      clearTimeout(tooltipTimer.current);
      clearTimeout(tooltipAutoHide.current);
    };
  }, []);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, open]);

  const toggleChat = () => {
    setOpen(prev => !prev);
    setShowTooltip(false);
    clearTimeout(tooltipAutoHide.current);
  };

  /**
   * Sanitizes input and sends message to backend.
   * @param {string} text - User input text
   */
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (trimmed.length > 500) {
      alert("Message too long! Please keep it under 500 characters.");
      return;
    }

    const sanitized = trimmed
      .replace(/<[^>]*>?/gm, '') 
      .replace(/[<>]/g, '');      

    const userMsg = { role: 'user', text: sanitized };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const aiText = await getChatResponse(sanitized, messages);

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
  };

  const handleChipClick = (text) => {
    sendMessage(text);
  };

  const showSuggestions = messages.length === 0 && !isTyping;

  return (
    <>
      {showTooltip && !open && (
        <div className="chat-tooltip">
          <span>👋 {lang === 'hi' ? 'अपना चुनाव प्रश्न यहाँ पूछें!' : 'Ask your election question here!'}</span>
          <button className="chat-tooltip-close" onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}>✕</button>
        </div>
      )}

      <button className="fab-chat-btn" onClick={toggleChat} aria-label="Open AI chat">
        <div className="fab-pulse-ring"></div>
        <img src="./favicon.svg" alt="" className="fab-icon-img" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }} />
        <span className="fab-icon-fallback" style={{ display: 'none' }}>🤖</span>
      </button>

      <div className={`chat-panel ${open ? 'chat-panel-open' : 'chat-panel-closed'}`}>
        <div className="chat-panel-header">
          <div className="chat-panel-header-left">
            <div className="chat-panel-favicon-wrap">
              <span className="chat-panel-flag-icon" role="img" aria-label="India Flag">🇮🇳</span>
            </div>
            <div>
              <div className="chat-panel-name">{t.chatTitle}</div>
              <div className="chat-panel-subtitle">{t.chatSubtitle}</div>
            </div>
          </div>
          <button className="chat-panel-close" onClick={toggleChat} aria-label="Close chat">✕</button>
        </div>

        <div className="chat-panel-body">
          {showSuggestions && (
            <div className="chat-panel-suggestions">
              <p className="chat-panel-suggestions-title">{t.whatKnow}</p>
              <div className="chat-panel-chips-grid">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="chat-panel-chip" onClick={() => handleChipClick(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat-panel-msg chat-panel-msg-${m.role}`}>
              {m.role === 'ai' && (
                <img src="./favicon.svg" alt="" className="chat-panel-msg-icon" onError={(e) => { e.target.style.display = 'none'; }} />
              )}
              <div className={`chat-panel-bubble chat-panel-bubble-${m.role}`}>
                {m.text.split('\n').map((line, j) => (
                  <React.Fragment key={j}>{line}<br /></React.Fragment>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-panel-msg chat-panel-msg-ai">
              <img src="./favicon.svg" alt="" className="chat-panel-msg-icon" onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="chat-panel-typing">
                <div className="chat-panel-dot"></div>
                <div className="chat-panel-dot"></div>
                <div className="chat-panel-dot"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="chat-panel-input-area">
          <div className="chat-panel-input-wrap">
            <input
              className="chat-panel-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder={t.chatPlaceholder}
              aria-describedby="chat-input-desc"
            />
            <div id="chat-input-desc" className="sr-only">Type your question here to get instant election guidance.</div>
            <button
              className="chat-panel-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              aria-label="Send message"
            >→</button>
          </div>
        </div>
      </div>
    </>
  );
}

FloatingChat.propTypes = {
  lang: PropTypes.string.isRequired,
  translations: PropTypes.object.isRequired,
  getChatResponse: PropTypes.func.isRequired,
};

export default FloatingChat;
