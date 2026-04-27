import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PDF_BASE_URL = "https://github.com/lazykaizer/election-process-education/releases/download/v1.0";

/**
 * Component to display a PDF resource card with an audio preview.
 * @param {Object} props - Component props
 * @param {Object} props.card - The card data containing title, icon, etc.
 * @param {number} props.index - Index for animation delay
 * @param {string} props.lang - Current language ('en' or 'hi')
 * @param {Object} props.translations - Translation dictionary
 * @param {Function} props.speakFn - Function to handle text-to-speech
 */
function PdfCard({ card, index, lang, translations, speakFn }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const pdfPath = `${PDF_BASE_URL}/${card.file}`;
  const t = translations[lang];
  const title = lang === 'hi' ? card.titleHi : card.title;
  const subtitle = lang === 'hi' ? card.subtitleHi : card.subtitle;

  const handleSpeak = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSpeaking) {
      if (window.currentSpeaker) window.currentSpeaker.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      window.currentSpeaker = await speakFn(`${title}. ${subtitle}`, lang, () => setIsSpeaking(false));
    }
  };

  return (
    <a
      href={pdfPath}
      target="_blank"
      rel="noopener noreferrer"
      className="pdf-card"
      style={{ animationDelay: `${(index + 1) * 0.08}s` }}
      title={`Open Guide: ${title}`}
    >
      <div className="pdf-card-icon" role="img" aria-label="document icon">{card.icon}</div>
      <span className="pdf-card-tag" style={{ background: `${card.tagColor}18`, color: card.tagColor }}>{card.tag}</span>
      <h3 className="pdf-card-title">{title}</h3>
      <p className="pdf-card-subtitle">{subtitle}</p>
      <div className="pdf-card-footer">
        <span className="pdf-card-link" onClick={() => {
          if (window.gtag) {
            window.gtag('event', 'pdf_opened', {
              'event_category': 'resource',
              'event_label': card.title
            });
          }
        }}>{t.openGuide} <span className="pdf-card-arrow">→</span></span>
        <button className={`tts-btn ${isSpeaking ? 'active' : ''}`} onClick={handleSpeak} aria-label="Listen to title">
          {isSpeaking ? '⏹️' : '🔊'}
        </button>
      </div>
    </a>
  );
}

PdfCard.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    titleHi: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    subtitleHi: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    tagColor: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  lang: PropTypes.string.isRequired,
  translations: PropTypes.object.isRequired,
  speakFn: PropTypes.func.isRequired,
};

export default PdfCard;
