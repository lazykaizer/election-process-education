import React, { useState, useEffect, useRef } from 'react';
import Landing from './Landing';

const PDF_BASE_URL = "https://github.com/lazykaizer/election-process-education/releases/download/v1.0";

// ── PDF Card Data ──
const PDF_CARDS = [
  {
    icon: '🗳️',
    title: 'Voter Registration — Form 6',
    subtitle: 'How to add your name to India\'s Electoral Roll',
    tag: 'Beginner',
    tagColor: '#006B3C',
    file: 'FAQ_01_Voter_Registration_Form6.pdf'
  },
  {
    icon: '📅',
    title: 'How to Vote on Election Day',
    subtitle: 'From leaving home to pressing the EVM button',
    tag: 'Essential',
    tagColor: '#FF6B00',
    file: 'FAQ_02_How_to_Vote_on_Election_Day.pdf'
  },
  {
    icon: '📍',
    title: 'Find Your Polling Booth',
    subtitle: '3 easy methods — Website, App, and SMS',
    tag: 'Quick Guide',
    tagColor: '#2563EB',
    file: 'FAQ_03_Find_Your_Polling_Booth.pdf'
  },
  {
    icon: '📲',
    title: 'Download Digital Voter ID (e-EPIC)',
    subtitle: 'Get your Voter ID card as a PDF on your phone',
    tag: 'Beginner',
    tagColor: '#006B3C',
    file: 'FAQ_04_Download_eEPIC_Digital_VoterID.pdf'
  },
  {
    icon: '✏️',
    title: 'Update Voter ID Details — Form 8',
    subtitle: 'Correct name, address, photo or link mobile number',
    tag: 'How-To',
    tagColor: '#7C3AED',
    file: 'FAQ_05_Update_Voter_ID_Form8.pdf'
  },
  {
    icon: '✋',
    title: 'What is NOTA?',
    subtitle: 'None of the Above — how it works and what it changes',
    tag: 'Concept',
    tagColor: '#DC2626',
    file: 'FAQ_06_What_is_NOTA.pdf'
  },
  {
    icon: '⚖️',
    title: 'Model Code of Conduct (MCC)',
    subtitle: 'Rules that govern parties, candidates and government',
    tag: 'Intermediate',
    tagColor: '#D97706',
    file: 'FAQ_07_Model_Code_of_Conduct.pdf'
  },
  {
    icon: '🖥️',
    title: 'How Does an EVM Work?',
    subtitle: 'Electronic Voting Machine + VVPAT explained',
    tag: 'Intermediate',
    tagColor: '#D97706',
    file: 'FAQ_08_How_EVM_Works.pdf'
  },
  {
    icon: '🏛️',
    title: 'Lok Sabha vs Rajya Sabha',
    subtitle: 'India\'s two Parliament houses — key differences',
    tag: 'Concept',
    tagColor: '#DC2626',
    file: 'FAQ_09_Lok_Sabha_vs_Rajya_Sabha.pdf'
  },
  {
    icon: '📋',
    title: 'How to File Nomination as a Candidate',
    subtitle: 'Step-by-step guide to contesting an election',
    tag: 'Advanced',
    tagColor: '#991B1B',
    file: 'FAQ_10_How_to_File_Nomination.pdf'
  },
  {
    icon: '🏢',
    title: 'Election Commission of India (ECI)',
    subtitle: 'Independent body running all Indian elections',
    tag: 'Concept',
    tagColor: '#DC2626',
    file: 'FAQ_11_Election_Commission_of_India.pdf'
  },
  {
    icon: '✈️',
    title: 'NRI Voter Registration — Form 6A',
    subtitle: 'How overseas Indians can register and vote',
    tag: 'Special',
    tagColor: '#0D9488',
    file: 'FAQ_12_NRI_Voter_Registration.pdf'
  }
];

// ── Chatbot AI Responses (keyword-matched) ──
const CHAT_RESPONSES = [
  {
    keywords: ['register', 'form 6', 'voter id', 'epic', 'nvsp', 'enroll'],
    response: "To register as a voter in India:\n\n1️⃣ Visit voters.eci.gov.in\n2️⃣ Sign up and log in\n3️⃣ Click 'New Voter Registration' → Fill Form 6\n4️⃣ Upload your photo + address proof + DOB proof\n5️⃣ Submit and save your Acknowledgement Number\n\nProcessing takes 15–30 days. Check the 📄 Form 6 guide above for the full step-by-step walkthrough with screenshots!"
  },
  {
    keywords: ['nota', 'none of the above', 'reject'],
    response: "NOTA = None of the Above 🗳️\n\nIt's the last button on the EVM. Press it if you want to reject ALL candidates. Your vote is counted but has zero electoral value — the candidate with most votes still wins.\n\nKey fact: Even if NOTA gets the most votes in a constituency, the runner-up candidate still wins. Check the 📄 NOTA guide in the library above!"
  },
  {
    keywords: ['evm', 'electronic voting', 'ballot unit', 'vvpat'],
    response: "EVMs have two parts:\n\n🔹 Control Unit — with the Presiding Officer\n🔹 Ballot Unit — inside the voting compartment\n\nYou press the blue button next to your candidate → you hear a beep → VVPAT shows your choice for 7 seconds.\n\nEVMs are never connected to the internet — they are standalone machines. See the 📄 EVM guide in the library for a full breakdown!"
  },
  {
    keywords: ['booth', 'polling station', 'where to vote', 'find booth'],
    response: "3 ways to find your polling booth:\n\n1️⃣ Website: electoralsearch.eci.gov.in → enter EPIC number\n2️⃣ App: Download 'Voter Helpline' app → scan your Voter ID\n3️⃣ SMS: Send 'ECI [EPIC Number]' to 1950\n\nOn election day, Help Desks are set up at every polling centre entrance. Check the 📄 Polling Booth guide above!"
  },
  {
    keywords: ['mcc', 'model code', 'conduct', 'campaign rules'],
    response: "Model Code of Conduct (MCC) kicks in the moment ECI announces election dates 📋\n\nKey rules:\n• No new government schemes during MCC\n• No campaigning within 100 metres of polling booths\n• 48-hour silence period before voting\n• No use of government vehicles for campaigns\n\nReport violations: Use the cVIGIL App or call 1950. See the full 📄 MCC guide above!"
  },
  {
    keywords: ['lok sabha', 'rajya sabha', 'parliament', 'mp', 'seats'],
    response: "India has two houses of Parliament:\n\n🏛️ Lok Sabha — 543 seats, directly elected by citizens, 5-year term\n🏛️ Rajya Sabha — 245 seats, elected by state assemblies, permanent house\n\nThe Prime Minister comes from the Lok Sabha majority. Money bills can only be introduced in Lok Sabha. See the full comparison in the 📄 Lok Sabha vs Rajya Sabha guide!"
  },
  {
    keywords: ['candidate', 'nomination', 'contest', 'file', 'form 2a'],
    response: "To contest an election in India:\n\n1️⃣ Get Form 2A from the Returning Officer\n2️⃣ Pay security deposit (Rs 25,000 for Lok Sabha)\n3️⃣ File sworn affidavit (Form 26) declaring criminal cases + assets\n4️⃣ Submit to RO within the filing window\n5️⃣ Survive scrutiny day → get your election symbol\n\nSee the full 📄 Nomination guide in the library!"
  },
  {
    keywords: ['nri', 'overseas', 'abroad', 'foreign'],
    response: "NRI voters can register using Form 6A on voters.eci.gov.in 🇮🇳\n\nRequirements:\n• Valid Indian passport\n• Have NOT acquired citizenship of another country\n• 18+ years of age\n\n⚠️ Important: NRI voters must physically travel to India to vote. No online or postal voting is available for NRIs yet. See the 📄 NRI Registration guide for full steps!"
  },
  {
    keywords: ['eci', 'election commission', 'who runs elections'],
    response: "The Election Commission of India (ECI) was established on January 25, 1950 — one day before India became a Republic! 🏛️\n\nIt runs ALL elections: Lok Sabha, State Assemblies, President, Vice President.\n\nHeaded by: Chief Election Commissioner (CEC) — removable only like a Supreme Court judge.\n\nHelpline: 1950 | Website: eci.gov.in\n\nSee the 📄 ECI guide in the library for full details!"
  }
];

const DEFAULT_CHAT_RESPONSE = "Great question! 🇮🇳 I'm Naagrik AI — your guide to Indian elections.\n\nYou can ask me about:\n• Voter registration (Form 6)\n• How to vote on election day\n• What is NOTA\n• How EVMs work\n• Model Code of Conduct\n• Lok Sabha vs Rajya Sabha\n• NRI voting\n• Nomination process\n\nOr browse the guides above — each one has step-by-step visuals with arrows and callout boxes!";

function getChatResponse(input) {
  if (!input) return DEFAULT_CHAT_RESPONSE;
  const lower = input.toLowerCase().trim();

  for (const entry of CHAT_RESPONSES) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        return entry.response;
      }
    }
  }
  return DEFAULT_CHAT_RESPONSE;
}

// ── PDF Card Component ──
function PdfCard({ card, index }) {
  const pdfPath = `${PDF_BASE_URL}/${card.file}`;
  return (
    <a
      href={pdfPath}
      target="_blank"
      rel="noopener noreferrer"
      className="pdf-card"
      style={{ animationDelay: `${(index + 1) * 0.08}s` }}
    >
      <div className="pdf-card-icon" aria-hidden="true">{card.icon}</div>
      <span className="pdf-card-tag" style={{ background: `${card.tagColor}18`, color: card.tagColor }}>{card.tag}</span>
      <h3 className="pdf-card-title">{card.title}</h3>
      <p className="pdf-card-subtitle">{card.subtitle}</p>
      <span className="pdf-card-link">Open Guide <span className="pdf-card-arrow">→</span></span>
    </a>
  );
}

// ── Floating Chatbot Component ──
function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const scrollRef = useRef(null);
  const tooltipTimer = useRef(null);
  const tooltipAutoHide = useRef(null);

  const SUGGESTIONS = [
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
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function toggleChat() {
    setOpen(prev => !prev);
    setShowTooltip(false);
    clearTimeout(tooltipAutoHide.current);
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // --- Input Validation & Security ---
    // 1. Length check
    if (trimmed.length > 300) {
      alert("Message too long! Please keep it under 300 characters.");
      return;
    }

    // 2. Basic XSS/Hack Prevention (Sanitization)
    const sanitized = trimmed
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .replace(/[<>]/g, '');      // Remove stray angle brackets

    const userMsg = { role: 'user', text: sanitized };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const aiText = getChatResponse(sanitized);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    }, 1200);
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
          <span>👋 Ask your election question here!</span>
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
              <span className="chat-panel-flag-icon">🇮🇳</span>
            </div>
            <div>
              <div className="chat-panel-name">Naagrik AI Assistant</div>
              <div className="chat-panel-subtitle">Official Election Education Guide</div>
            </div>
          </div>
          <button className="chat-panel-close" onClick={toggleChat} aria-label="Close chat">✕</button>
        </div>


        {/* Messages Area */}
        <div className="chat-panel-body">
          {showSuggestions && (
            <div className="chat-panel-suggestions">
              <p className="chat-panel-suggestions-title">What would you like to know?</p>
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
              placeholder="Ask about elections..."
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

// ── Dashboard Component ──
function Dashboard({ onHome }) {
  const [searchQuery, setSearchQuery] = useState('');
  const pdfGridRef = useRef(null);

  const filteredCards = PDF_CARDS.filter(card => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return card.title.toLowerCase().includes(q) || card.subtitle.toLowerCase().includes(q);
  });


  return (
    <div className="dashboard-wrap">
      {/* ── Main Content (Full Width) ── */}
      <main className="db-main">
        {/* Header */}
        <header className="db-header">
          <div className="db-header-title">🗳️ Naagrik AI</div>
          <div className="db-header-actions">

            <button className="db-action-btn" onClick={onHome}>
              🏠 Home
            </button>
          </div>
        </header>

        {/* PDF Resource Grid */}
        <div className="pdf-section" ref={pdfGridRef}>
          <div className="pdf-section-header">
            <h1 className="pdf-section-title">Election Resource Library 🗳️</h1>
            <p className="pdf-section-subtitle">Click any guide to open it — step-by-step visual guides on every election topic</p>
            <div className="pdf-search-wrap">
              <span className="pdf-search-icon">🔍</span>
              <input
                className="pdf-search"
                type="text"
                placeholder="Search guides... try 'voter ID' or 'EVM'"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="pdf-search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          <div className="pdf-grid">
            {filteredCards.map((card, i) => (
              <a
                key={i}
                href={`${PDF_BASE_URL}/${card.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-card"
                style={{ animationDelay: `${(i + 1) * 0.08}s` }}
              >
                <div className="pdf-card-icon" aria-hidden="true">{card.icon}</div>
                <span className="pdf-card-tag" style={{ background: `${card.tagColor}18`, color: card.tagColor }}>{card.tag}</span>
                <h3 className="pdf-card-title">{card.title}</h3>
                <p className="pdf-card-subtitle">{card.subtitle}</p>
                <span className="pdf-card-link">Open Guide <span className="pdf-card-arrow">→</span></span>
              </a>
            ))}
          </div>


          {/* No match message */}
          {searchQuery && filteredCards.length === 0 && (
            <div className="pdf-no-match">
              No guides found for '<strong>{searchQuery}</strong>' — try 'EVM', 'NOTA', or 'voter'
            </div>
          )}

          {/* More Coming Soon */}
          <div className="pdf-coming-soon">
            <span className="pdf-coming-soon-emoji">⏳</span>
            <h3>More Guides Coming Soon</h3>
            <p>We're adding guides on: Presidential Elections, State vs Central Elections, Counting Day Process, Election Disputes & Courts, and more. Stay tuned!</p>
            <span className="pdf-coming-soon-tag">Updated regularly — April 2026</span>
          </div>
        </div>
      </main>

      {/* Floating Chatbot */}
      <FloatingChat />
    </div>
  );
}

// ── App Root ──
export default function App() {
  const [view, setView] = useState('landing');

  if (view === 'landing') {
    return <Landing onLaunch={() => setView('dashboard')} />;
  }

  return <Dashboard onHome={() => setView('landing')} />;
}
