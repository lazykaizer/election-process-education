import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Quiz from './components/Quiz';
import AIAnalyzer from './components/AIAnalyzer';
import TranslatorTool from './components/TranslatorTool';

// Lazy load Landing component
const Landing = lazy(() => import('./Landing'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '20px' }}>
          <h2>Oops! Something went wrong.</h2>
          <pre style={{ color: 'red', margin: '20px 0' }}>{this.state.error?.toString()}</pre>
          <p>Please refresh the page to continue.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#FF6B00', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Refresh Now</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Translations ──
const TRANSLATIONS = {
  en: {
    title: 'Election Resource Library',
    subtitle: 'Click any guide to open it — step-by-step visual guides on every election topic',
    search: 'Search guides... try "voter ID" or "EVM"',
    home: '🏠 Home',
    openGuide: 'Open Guide',
    comingSoon: 'More Guides Coming Soon',
    comingSoonDesc: "We're adding guides on: Presidential Elections, State vs Central Elections, Counting Day Process, Election Disputes & Courts, and more. Stay tuned!",
    updated: 'Updated regularly — April 2026',
    chatTitle: 'Naagrik AI Assistant',
    chatSubtitle: 'Official Election Education Guide',
    chatPlaceholder: 'Ask about elections...',
    whatKnow: 'What would you like to know?',
    listen: 'Listen',
    stop: 'Stop',
    verifyTitle: 'Verify Voter ID (AI)',
    verifySubtitle: 'Upload a picture of your Voter ID. Our AI will verify its authenticity using Google Cloud Vision OCR.',
    uploadEpic: 'Upload Voter ID Image',
    extracting: 'Analyzing Image...',
    verifySuccess: 'Valid Voter ID Detected',
    verifyFail: 'Could Not Verify Voter ID',
    ocrDetails: 'Extracted Details'
  },
  hi: {
    title: 'चुनाव संसाधन पुस्तकालय',
    subtitle: 'किसी भी गाइड को खोलने के लिए क्लिक करें — हर चुनाव विषय पर चरण-दर-चरण दृश्य मार्गदर्शिकाएँ',
    search: 'गाइड खोजें... "मतदाता पहचान पत्र" या "EVM" आजमाएं',
    home: '🏠 होम',
    openGuide: 'गाइड खोलें',
    comingSoon: 'अधिक गाइड जल्द ही आ रहे हैं',
    comingSoonDesc: 'हम इन पर गाइड जोड़ रहे हैं: राष्ट्रपति चुनाव, राज्य बनाम केंद्रीय चुनाव, मतगणना दिवस प्रक्रिया, चुनाव विवाद और अदालतें। बने रहें!',
    updated: 'नियमित रूप से अपडेट — अप्रैल 2026',
    chatTitle: 'नागरिक AI सहायक',
    chatSubtitle: 'आधिकारिक चुनाव शिक्षा गाइड',
    chatPlaceholder: 'चुनाव के बारे में पूछें...',
    whatKnow: 'आप क्या जानना चाहेंगे?',
    listen: 'सुनें',
    stop: 'रोकें',
    verifyTitle: 'वोटर आईडी सत्यापित करें (AI)',
    verifySubtitle: 'अपने वोटर आईडी की तस्वीर अपलोड करें। हमारा AI Google Cloud Vision OCR का उपयोग करके इसकी प्रामाणिकता की जांच करेगा।',
    uploadEpic: 'वोटर आईडी छवि अपलोड करें',
    extracting: 'छवि का विश्लेषण हो रहा है...',
    verifySuccess: 'वैध वोटर आईडी का पता चला',
    verifyFail: 'वोटर आईडी सत्यापित नहीं हो सका',
    ocrDetails: 'निकाला गया विवरण'
  }
};

const PDF_BASE_URL = "https://github.com/lazykaizer/election-process-education/releases/download/v1.0";

// ── PDF Card Data ──
const PDF_CARDS = [
  {
    icon: '🗳️',
    title: 'Voter Registration — Form 6',
    titleHi: 'मतदाता पंजीकरण — फॉर्म 6',
    subtitle: 'How to add your name to India\'s Electoral Roll',
    subtitleHi: 'भारत की मतदाता सूची में अपना नाम कैसे जोड़ें',
    tag: 'Beginner',
    tagColor: '#006B3C',
    file: 'FAQ_01_Voter_Registration_Form6.pdf'
  },
  {
    icon: '📅',
    title: 'How to Vote on Election Day',
    titleHi: 'चुनाव के दिन वोट कैसे डालें',
    subtitle: 'From leaving home to pressing the EVM button',
    subtitleHi: 'घर से निकलने से लेकर EVM बटन दबाने तक',
    tag: 'Essential',
    tagColor: '#FF6B00',
    file: 'FAQ_02_How_to_Vote_on_Election_Day.pdf'
  },
  {
    icon: '📍',
    title: 'Find Your Polling Booth',
    titleHi: 'अपना पोलिंग बूथ खोजें',
    subtitle: '3 easy methods — Website, App, and SMS',
    subtitleHi: '3 आसान तरीके — वेबसाइट, ऐप और एसएमएस',
    tag: 'Quick Guide',
    tagColor: '#2563EB',
    file: 'FAQ_03_Find_Your_Polling_Booth.pdf'
  },
  {
    icon: '📲',
    title: 'Download Digital Voter ID (e-EPIC)',
    titleHi: 'डिजिटल वोटर आईडी (e-EPIC) डाउनलोड करें',
    subtitle: 'Get your Voter ID card as a PDF on your phone',
    subtitleHi: 'अपने फोन पर पीडीएफ के रूप में अपना वोटर आईडी कार्ड प्राप्त करें',
    tag: 'Beginner',
    tagColor: '#006B3C',
    file: 'FAQ_04_Download_eEPIC_Digital_VoterID.pdf'
  },
  {
    icon: '✏️',
    title: 'Update Voter ID Details — Form 8',
    titleHi: 'वोटर आईडी विवरण अपडेट करें — फॉर्म 8',
    subtitle: 'Correct name, address, photo or link mobile number',
    subtitleHi: 'नाम, पता, फोटो सुधारें या मोबाइल नंबर लिंक करें',
    tag: 'How-To',
    tagColor: '#7C3AED',
    file: 'FAQ_05_Update_Voter_ID_Form8.pdf'
  },
  {
    icon: '✋',
    title: 'What is NOTA?',
    titleHi: 'नोटा (NOTA) क्या है?',
    subtitle: 'None of the Above — how it works and what it changes',
    subtitleHi: 'इनमें से कोई नहीं — यह कैसे काम करता है और क्या बदलता है',
    tag: 'Concept',
    tagColor: '#DC2626',
    file: 'FAQ_06_What_is_NOTA.pdf'
  },
  {
    icon: '⚖️',
    title: 'Model Code of Conduct (MCC)',
    titleHi: 'आदर्श चुनाव आचार संहिता (MCC)',
    subtitle: 'Rules that govern parties, candidates and government',
    subtitleHi: 'नियम जो पार्टियों, उम्मीदवारों और सरकार को नियंत्रित करते हैं',
    tag: 'Intermediate',
    tagColor: '#D97706',
    file: 'FAQ_07_Model_Code_of_Conduct.pdf'
  },
  {
    icon: '🖥️',
    title: 'How Does an EVM Work?',
    titleHi: 'EVM कैसे काम करता है?',
    subtitle: 'Electronic Voting Machine + VVPAT explained',
    subtitleHi: 'इलेक्ट्रॉनिक वोटिंग मशीन + VVPAT समझाया गया',
    tag: 'Intermediate',
    tagColor: '#D97706',
    file: 'FAQ_08_How_EVM_Works.pdf'
  },
  {
    icon: '🏛️',
    title: 'Lok Sabha vs Rajya Sabha',
    titleHi: 'लोकसभा बनाम राज्यसभा',
    subtitle: 'India\'s two Parliament houses — key differences',
    subtitleHi: 'भारत के दो संसद सदन — प्रमुख अंतर',
    tag: 'Concept',
    tagColor: '#DC2626',
    file: 'FAQ_09_Lok_Sabha_vs_Rajya_Sabha.pdf'
  },
  {
    icon: '📋',
    title: 'How to File Nomination as a Candidate',
    titleHi: 'उम्मीदवार के रूप में नामांकन कैसे भरें',
    subtitle: 'Step-by-step guide to contesting an election',
    subtitleHi: 'चुनाव लड़ने के लिए चरण-दर-चरण मार्गदर्शिका',
    tag: 'Advanced',
    tagColor: '#991B1B',
    file: 'FAQ_10_How_to_File_Nomination.pdf'
  },
  {
    icon: '🏢',
    title: 'Election Commission of India (ECI)',
    titleHi: 'भारतीय चुनाव आयोग (ECI)',
    subtitle: 'Independent body running all Indian elections',
    subtitleHi: 'सभी भारतीय चुनावों को चलाने वाला स्वतंत्र निकाय',
    tag: 'Concept',
    tagColor: '#DC2626',
    file: 'FAQ_11_Election_Commission_of_India.pdf'
  },
  {
    icon: '✈️',
    title: 'NRI Voter Registration — Form 6A',
    titleHi: 'NRI मतदाता पंजीकरण — फॉर्म 6A',
    subtitle: 'How overseas Indians can register and vote',
    subtitleHi: 'प्रवासी भारतीय कैसे पंजीकरण और मतदान कर सकते हैं',
    tag: 'Special',
    tagColor: '#0D9488',
    file: 'FAQ_12_NRI_Voter_Registration.pdf'
  }
];

// Backend Chat API
async function getChatResponse(input, history) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, history })
    });
    const data = await res.json();
    return data.reply || "Sorry, I couldn't understand that.";
  } catch (err) {
    console.error('Chat API error:', err);
    return "Network error. Please try again.";
  }
}

// ── TTS Logic ──
let currentAudio = null;
async function speak(text, lang = 'en-IN', onEnd) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  window.speechSynthesis?.cancel();

  try {
    const res = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language: lang })
    });
    const data = await res.json();
    if (data.audioContent) {
      currentAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      currentAudio.onended = () => { currentAudio = null; if(onEnd) onEnd(); };
      await currentAudio.play();
      return { stop: () => { if(currentAudio) { currentAudio.pause(); currentAudio = null; } } };
    }
  } catch (err) {
    console.error('TTS API error:', err);
  }

  // Fallback to browser TTS
  if (!window.speechSynthesis) return { stop: () => {} };
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.9;
  utterance.onend = () => { if(onEnd) onEnd(); };
  window.speechSynthesis.speak(utterance);
  return { stop: () => window.speechSynthesis.cancel() };
}

// ── PDF Card Component ──
function PdfCard({ card, index, lang }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const pdfPath = `${PDF_BASE_URL}/${card.file}`;
  const t = TRANSLATIONS[lang];
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
      window.currentSpeaker = await speak(`${title}. ${subtitle}`, lang, () => setIsSpeaking(false));
    }
  };

  return (
    <a
      href={pdfPath}
      target="_blank"
      rel="noopener noreferrer"
      className="pdf-card"
      style={{ animationDelay: `${(index + 1) * 0.08}s` }}
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

// ── Floating Chatbot Component ──
function FloatingChat({ lang }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const scrollRef = useRef(null);
  const tooltipTimer = useRef(null);
  const tooltipAutoHide = useRef(null);
  const t = TRANSLATIONS[lang];

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
    // Show tooltip after 4 seconds
    tooltipTimer.current = setTimeout(() => {
      setShowTooltip(true);
      // Auto-hide after 6 seconds
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

  function toggleChat() {
    setOpen(prev => !prev);
    setShowTooltip(false);
    clearTimeout(tooltipAutoHide.current);
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // --- Input Validation & Security ---
    if (trimmed.length > 300) {
      alert("Message too long! Please keep it under 300 characters.");
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
    setMessages(prev => [...prev, { role: 'model', text: aiText }]);
  }

  function handleChipClick(text) {
    sendMessage(text);
  }

  const showSuggestions = messages.length === 0 && !isTyping;

  return (
    <>
      {/* Tooltip */}
      {showTooltip && !open && (
        <div className="chat-tooltip">
          <span>👋 {lang === 'hi' ? 'अपना चुनाव प्रश्न यहाँ पूछें!' : 'Ask your election question here!'}</span>
          <button className="chat-tooltip-close" onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}>✕</button>
        </div>
      )}

      {/* Floating Button */}
      <button className="fab-chat-btn" onClick={toggleChat} aria-label="Open AI chat">
        <div className="fab-pulse-ring"></div>
        <img
          src="./favicon.svg"
          alt=""
          className="fab-icon-img"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }}
        />
        <span className="fab-icon-fallback" style={{ display: 'none' }}>🤖</span>
      </button>

      {/* Chat Panel */}
      <div className={`chat-panel ${open ? 'chat-panel-open' : 'chat-panel-closed'}`}>
        {/* Header - Saffron */}
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


        {/* Messages Area */}
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

        {/* Input Area */}
        <div className="chat-panel-input-area">
          <div className="chat-panel-input-wrap">
            <input
              className="chat-panel-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder={t.chatPlaceholder}
            />
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

// ── Voter ID Verify Component ──
function VoterIDVerify({ lang }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5_000_000) {
      setError("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Img = event.target.result;
      setLoading(true);
      setError(null);
      setResult(null);
      
      try {
        const res = await fetch('/api/vision/verify-voter-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Img })
        });
        const data = await res.json();
        
        if (res.ok) {
          setResult(data);
        } else {
          setError(data.error || 'Verification failed.');
        }
      } catch (err) {
        console.error('OCR Error:', err);
        setError('Network error during verification.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="voter-verify-section">
      <div className="section-divider">
        <span>AI Vision Verification</span>
      </div>
      <h2 className="voter-verify-title">{t.verifyTitle} <span role="img" aria-label="camera">📷</span></h2>
      <p className="voter-verify-subtitle">{t.verifySubtitle}</p>
      
      <div className="voter-verify-card">
        <div className="voter-verify-upload" onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
          {loading ? (
            <div className="voter-verify-loading">
              <Loader2 className="spinner" size={24} /> {t.extracting}
            </div>
          ) : (
            <div className="voter-verify-placeholder">
              <span className="upload-icon">⬆️</span>
              <span>{t.uploadEpic}</span>
            </div>
          )}
        </div>

        {error && <div className="voter-verify-error">{error}</div>}

        {result && (
          <div className={`voter-verify-result ${result.isValidVoterID ? 'valid' : 'invalid'}`}>
            <h3>
              {result.isValidVoterID ? '✅ ' + t.verifySuccess : '❌ ' + t.verifyFail}
            </h3>
            {result.extracted && (
              <div className="voter-verify-details">
                <h4>{t.ocrDetails}</h4>
                <p><strong>EPIC:</strong> {result.extracted.epicNumber || 'Not found'}</p>
                <div className="voter-verify-raw">
                   {result.extracted.rawText?.split('\n').map((l, i) => <div key={i}>{l}</div>)}
                </div>
              </div>
            )}
            {result.service === 'demo' && (
              <p className="voter-verify-demo-note">Note: This is a demo response. Add API Key for real OCR.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard Component ──
function Dashboard({ onHome, lang, setLang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const pdfGridRef = useRef(null);
  const t = TRANSLATIONS[lang];

  const filteredCards = PDF_CARDS.filter(card => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = lang === 'hi' ? card.titleHi : card.title;
    const subtitle = lang === 'hi' ? card.subtitleHi : card.subtitle;
    return title.toLowerCase().includes(q) || subtitle.toLowerCase().includes(q);
  });


  return (
    <div className="dashboard-wrap">
      {/* ── Main Content (Full Width) ── */}
      <main className="db-main">
        {/* Header */}
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

        {/* PDF Resource Grid */}
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
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (window.gtag && e.target.value.length > 3) {
                    window.gtag('event', 'search', {
                      'search_term': e.target.value
                    });
                  }
                }}
              />
              {searchQuery && (
                <button className="pdf-search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          <div className="pdf-grid">
            {filteredCards.map((card, i) => (
              <PdfCard key={i} card={card} index={i} lang={lang} />
            ))}
          </div>

          {!searchQuery && (
            <>
              <VoterIDVerify lang={lang} />
              
              <div className="section-divider">
                <span>AI NLP Tools</span>
              </div>
              <AIAnalyzer />
              <TranslatorTool />
              
              <div className="section-divider">
                <span>Quiz Zone</span>
              </div>
              <Quiz lang={lang} />
            </>
          )}


          {/* No match message */}
          {searchQuery && filteredCards.length === 0 && (
            <div className="pdf-no-match">
              {lang === 'hi' ? `कोई गाइड नहीं मिली '${searchQuery}'` : `No guides found for '${searchQuery}'`}
            </div>
          )}

          {/* More Coming Soon */}
          <div className="pdf-coming-soon">
            <span className="pdf-coming-soon-emoji" role="img" aria-label="hourglass">⏳</span>
            <h3>{t.comingSoon}</h3>
            <p>{t.comingSoonDesc}</p>
            <span className="pdf-coming-soon-tag">{t.updated}</span>
          </div>
        </div>
      </main>

      {/* Floating Chatbot */}
      <FloatingChat lang={lang} />
    </div>
  );
}

// ── App Root ──
export default function App() {
  const [view, setView] = useState('landing');
  const [lang, setLang] = useState('en');

  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0f', color: 'white' }}>Loading Naagrik AI...</div>}>
        {view === 'landing' ? (
          <Landing onLaunch={() => setView('dashboard')} />
        ) : (
          <Dashboard onHome={() => setView('landing')} lang={lang} setLang={setLang} />
        )}
      </Suspense>
    </ErrorBoundary>
  );
}
