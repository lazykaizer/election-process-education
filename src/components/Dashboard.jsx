import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Quiz from './Quiz';
import PdfCard from './PdfCard';

/**
 * Dashboard component for browsing election resources.
 * @param {Object} props - Component props
 * @param {Function} props.onHome - Callback to return to landing page
 * @param {string} props.lang - Current language ('en' or 'hi')
 * @param {Function} props.setLang - Callback to change language
 * @param {Array} props.pdfCards - Array of PDF resource objects
 * @param {Object} props.translations - Translation dictionary
 * @param {Function} props.speakFn - Function to handle TTS
 * @param {React.Component} props.FloatingChat - Floating chat component
 * @param {Function} props.getChatResponse - Function to handle chat API
 */
function Dashboard({ 
  onHome, 
  lang, 
  setLang, 
  pdfCards, 
  translations, 
  speakFn, 
  FloatingChat, 
  getChatResponse 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const pdfGridRef = useRef(null);
  const t = translations[lang];

  /**
   * Filters PDF cards based on search query.
   * @returns {Array} Filtered PDF cards
   */
  const getFilteredCards = () => {
    if (!searchQuery.trim()) return pdfCards;
    const q = searchQuery.toLowerCase();
    return pdfCards.filter(card => {
      const title = lang === 'hi' ? card.titleHi : card.title;
      const subtitle = lang === 'hi' ? card.subtitleHi : card.subtitle;
      return title.toLowerCase().includes(q) || subtitle.toLowerCase().includes(q);
    });
  };

  const filteredCards = getFilteredCards();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (window.gtag && val.length > 3) {
      window.gtag('event', 'search', {
        'search_term': val
      });
    }
  };

  return (
    <div className="dashboard-wrap">
      <main className="db-main">
        <header className="db-header">
          <div className="db-header-title">
            <span role="img" aria-label="ballot box">🗳️</span> Naagrik AI
          </div>
          <div className="db-header-actions">
            <div className="lang-switcher">
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिन्दी</button>
            </div>
            <button className="db-action-btn" onClick={onHome}>
              {t.home}
            </button>
          </div>
        </header>

        <div className="pdf-section" ref={pdfGridRef}>
          <div className="pdf-section-header">
            <h1 className="pdf-section-title">{t.title} <span role="img" aria-label="ballot box">🗳️</span></h1>
            <p className="pdf-section-subtitle">{t.subtitle}</p>
            <div className="pdf-search-wrap">
              <span className="pdf-search-icon">🔍</span>
              <input
                className="pdf-search"
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search election guides"
              />
              {searchQuery && (
                <button className="pdf-search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          <div className="pdf-grid">
            {filteredCards.map((card, i) => (
              <PdfCard 
                key={i} 
                card={card} 
                index={i} 
                lang={lang} 
                translations={translations} 
                speakFn={speakFn} 
              />
            ))}
          </div>

          {!searchQuery && (
            <>
              <div className="section-divider">
                <span>Quiz Zone</span>
              </div>
              <Quiz lang={lang} />
            </>
          )}

          {searchQuery && filteredCards.length === 0 && (
            <div className="pdf-no-match">
              {lang === 'hi' ? `कोई गाइड नहीं मिली '${searchQuery}'` : `No guides found for '${searchQuery}'`}
            </div>
          )}

          <div className="pdf-coming-soon">
            <span className="pdf-coming-soon-emoji" role="img" aria-label="hourglass">⏳</span>
            <h3>{t.comingSoon}</h3>
            <p>{t.comingSoonDesc}</p>
            <span className="pdf-coming-soon-tag">{t.updated}</span>
          </div>
        </div>
      </main>

      <FloatingChat 
        lang={lang} 
        translations={translations} 
        getChatResponse={getChatResponse} 
      />
    </div>
  );
}

Dashboard.propTypes = {
  onHome: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  setLang: PropTypes.func.isRequired,
  pdfCards: PropTypes.array.isRequired,
  translations: PropTypes.object.isRequired,
  speakFn: PropTypes.func.isRequired,
  FloatingChat: PropTypes.elementType.isRequired,
  getChatResponse: PropTypes.func.isRequired,
};

export default Dashboard;
