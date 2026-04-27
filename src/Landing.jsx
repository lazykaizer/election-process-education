import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const DEMO_MESSAGES = [
  { role: 'user', text: 'What happens if I miss voting?' },
  { role: 'ai', text: 'No penalty! Voting is your right, not a legal obligation in India. But it\'s one of the most powerful ways to shape your country 🇮🇳' },
  { role: 'user', text: 'Who is eligible to vote?' },
  { role: 'ai', text: 'Any Indian citizen aged 18 or above can vote — as long as they\'re registered in the electoral roll of their constituency.' },
  { role: 'user', text: 'How does the EVM work?' },
  { role: 'ai', text: 'Great question! An EVM has two units — the Control Unit with the officer, and the Ballot Unit where you press a button for your candidate. Simple, tamper-resistant, and efficient ✅' }
];

const Landing = ({ onLaunch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [demoMessages, setDemoMessages] = useState([]);
  const [resourceVisible, setResourceVisible] = useState(false);
  const currentIdx = useRef(0);
  const resourceRef = useRef(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedback = (type) => {
    // Trigger Google Analytics Event
    if (window.gtag) {
      window.gtag('event', 'feedback_submitted', {
        'feedback_type': type
      });
    }
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setShowFeedback(false);
    }, 3000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Auto-play demo messages
    currentIdx.current = 0;
    setDemoMessages([]);
    const interval = setInterval(() => {
      if (currentIdx.current < DEMO_MESSAGES.length) {
        const msg = DEMO_MESSAGES[currentIdx.current];
        setDemoMessages(prev => [...prev, msg]);
        currentIdx.current++;
      } else {
        clearInterval(interval);
      }
    }, 3000);

    // Intersection Observer for resource preview section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setResourceVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (resourceRef.current) {
      observer.observe(resourceRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-page">
      {/* 1. Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : 'dark'}`}>
        <a href="#" className="nav-logo">Naagrik AI</a>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#how">How It Works</a>
          <a href="#topics">Topics</a>
          <a href="#about">About</a>
        </div>
        <button onClick={onLaunch} className="btn-primary pulse-cta">Start Learning →</button>
      </nav>

      {/* 2. Hero Section */}
      <section className="hero" id="home">
        <div className="hero-grain"></div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        {/* Ashoka Chakra SVG */}
        <svg className="ashoka-chakra" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ashoka Chakra - Symbol of Indian Democracy">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
          {[...Array(24)].map((_, i) => (
            <line 
              key={i}
              x1="100" y1="100" 
              x2={100 + 90 * Math.cos((i * 15 * Math.PI) / 180)} 
              y2={100 + 90 * Math.sin((i * 15 * Math.PI) / 180)} 
              stroke="currentColor" strokeWidth="1" 
            />
          ))}
        </svg>

        <div className="hero-container">
          <motion.div 
            className="hero-content-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hero-badge">
              <div className="blink-dot"></div>
              🇮🇳 India's #1 Civic Guide
            </div>
            <h1>Understand How <br /><span className="underline-saffron">India Votes</span></h1>
            <p className="hero-sub">
              Talk to Naagrik AI — your personal guide to elections, timelines, voter rights, and everything in between. No jargon. Just clarity.
            </p>
            <div className="hero-btns">
              <button onClick={onLaunch} className="btn-primary">Start a Conversation →</button>
              <button className="btn-ghost">Watch How It Works</button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">2.5L+ Students Educated</div>
              <div className="stat-item">7 Languages Supported</div>
              <div className="stat-item">100% Free</div>
            </div>
          </motion.div>

          <motion.div 
            className="hero-mockup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="chat-card">
              <div className="chat-bubble chat-user">"How do I register to vote?"</div>
              <div className="chat-bubble chat-ai">
                "Great question! To register, you need to fill Form 6 on the NVSP portal. You must be 18+ and an Indian citizen. Want me to walk you through each step? 🗳️"
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Marquee Strip */}
      <div className="marquee">
        <div className="marquee-content">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="marquee-item">Voter Registration</span>
              <span className="marquee-item">•</span>
              <span className="marquee-item">EVM Process</span>
              <span className="marquee-item">•</span>
              <span className="marquee-item">Election Commission</span>
              <span className="marquee-item">•</span>
              <span className="marquee-item">Model Code of Conduct</span>
              <span className="marquee-item">•</span>
              <span className="marquee-item">Lok Sabha vs Rajya Sabha</span>
              <span className="marquee-item">•</span>
              <span className="marquee-item">Counting Day</span>
              <span className="marquee-item">•</span>
              <span className="marquee-item">NOTA Explained</span>
              <span className="marquee-item">•</span>
              <span className="marquee-item">Form 6 Guide</span>
              <span className="marquee-item">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4. How It Works */}
      <section className="how-it-works section-padding" id="how">
        <div className="container">
          <h2 className="section-title">Learn in 3 Simple Steps</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-icon" role="img" aria-label="speech bubble">💬</span>
              <h3>Ask Anything</h3>
              <p>Type your question in plain language — Hindi or English, whatever feels natural.</p>
            </div>
            <div className="step-card">
              <span className="step-icon" role="img" aria-label="brain">🧠</span>
              <h3>Get Clear Answers</h3>
              <p>Naagrik AI breaks down complex electoral processes into simple, conversational explanations.</p>
            </div>
            <div className="step-card">
              <span className="step-icon" role="img" aria-label="books">📚</span>
              <h3>Go Deeper</h3>
              <p>Explore timelines, flowcharts, key roles, and related topics to build complete understanding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Topics Grid */}
      <section className="topics section-padding" id="topics">
        <div className="container">
          <h2 className="section-title">What Can You Learn?</h2>
          <div className="topics-grid">
            {[
              { e: '🗳️', t: 'Voter Registration', d: 'How to register, check status, and update details' },
              { e: '📅', t: 'Election Timeline', d: 'From announcement to result, every key date' },
              { e: '🏛️', t: 'Lok Sabha & Rajya Sabha', d: 'Difference between the two houses explained' },
              { e: '⚖️', t: 'Election Commission', d: 'The independent body that runs it all' },
              { e: '📋', t: 'Model Code of Conduct', d: 'Rules that govern parties during elections' },
              { e: '🖥️', t: 'EVM & VVPAT', d: 'How electronic voting machines work' },
              { e: '🗂️', t: 'Candidate Filing', d: 'How candidates nominate themselves' },
              { e: '✅', t: 'Your Voter Rights', d: 'What you\'re entitled to on election day' }
            ].map((topic, idx) => (
              <div key={idx} className="topic-card">
                <div className="topic-emoji" role="img" aria-label="topic icon">{topic.e}</div>
                <h4>{topic.t}</h4>
                <p>{topic.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Chat Demo */}
      <section className="chat-demo section-padding">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>It Feels Like Talking to a Friend</h2>
            <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px' }}>Not like reading a government PDF</p>
            <button onClick={onLaunch} className="btn-primary">Try It Now →</button>
          </div>
          <div className="demo-phone">
            <div className="demo-chat-messages">
              {demoMessages.map((m, i) => (
                <div key={i} className={`demo-bubble chat-bubble ${m.role === 'user' ? 'chat-user' : 'chat-ai'}`}>
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Resource Library Preview */}
      <section ref={resourceRef} className={`resource-preview section-padding ${resourceVisible ? 'resource-visible' : ''}`} id="guides">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Free Step-by-Step Election Guides 📚</h2>
          <p className="resource-preview-subtitle">Visual guides with arrows and callouts — like a friend showing you exactly where to click</p>
          <div className="resource-preview-grid">
            {[
              { icon: '🗳️', title: 'Voter Registration — Form 6', subtitle: 'How to add your name to India\'s Electoral Roll', tag: 'Beginner', tagColor: '#006B3C', file: 'FAQ_01_Voter_Registration_Form6.pdf' },
              { icon: '📅', title: 'How to Vote on Election Day', subtitle: 'From leaving home to pressing the EVM button', tag: 'Essential', tagColor: '#FF6B00', file: 'FAQ_02_How_to_Vote_on_Election_Day.pdf' },
              { icon: '📍', title: 'Find Your Polling Booth', subtitle: '3 easy methods — Website, App, and SMS', tag: 'Quick Guide', tagColor: '#2563EB', file: 'FAQ_03_Find_Your_Polling_Booth.pdf' },
              { icon: '📲', title: 'Download Digital Voter ID (e-EPIC)', subtitle: 'Get your Voter ID card as a PDF on your phone', tag: 'Beginner', tagColor: '#006B3C', file: 'FAQ_04_Download_eEPIC_Digital_VoterID.pdf' }
            ].map((card, idx) => (
              <a key={idx} href={`./election pdf/${card.file}`} target="_blank" rel="noopener noreferrer" className="pdf-card resource-preview-card">
                <div className="pdf-card-icon" aria-hidden="true"><span role="img" aria-label="emoji">{card.icon}</span></div>
                <span className="pdf-card-tag" style={{ background: `${card.tagColor}18`, color: card.tagColor }}>{card.tag}</span>
                <h3 className="pdf-card-title">{card.title}</h3>
                <p className="pdf-card-subtitle">{card.subtitle}</p>
                <span className="pdf-card-link">Open Guide <span className="pdf-card-arrow">→</span></span>
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button onClick={onLaunch} className="btn-primary" style={{ fontSize: '17px', padding: '16px 36px' }}>View All 12 Guides →</button>
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA */}
      <section className="bottom-cta section-padding">
        <div className="cta-content">
          <h2>Ready to Become an Informed Voter?</h2>
          <p>Join thousands of Indians learning how their democracy works.</p>
          <button onClick={onLaunch} className="btn-white" style={{ marginTop: '40px', cursor: 'pointer' }}>Launch Naagrik AI →</button>
        </div>
      </section>

      {/* Feedback Widget */}
      <div className={`feedback-widget ${showFeedback ? 'active' : ''}`}>
        {!feedbackSent ? (
          <div className="feedback-content">
            <p>Was this helpful?</p>
            <div className="feedback-buttons">
              <button onClick={() => handleFeedback('yes')} className="fb-btn yes">👍 Yes</button>
              <button onClick={() => handleFeedback('no')} className="fb-btn no">👎 No</button>
            </div>
          </div>
        ) : (
          <div className="feedback-success">
            <p>Thanks for your feedback! ❤️</p>
          </div>
        )}
      </div>

      <button 
        className="feedback-toggle"
        onClick={() => setShowFeedback(!showFeedback)}
        aria-label="Give feedback"
      >
        {showFeedback ? '✕' : <span role="img" aria-label="chat bubble">💬</span>}
      </button>

      {/* 8. Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-logo">Naagrik AI</div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
        <div className="footer-bottom">
          Made with ❤️ for Indian Democracy
        </div>
      </footer>
    </div>
  );
};

Landing.propTypes = {
  onLaunch: PropTypes.func.isRequired,
};

export default Landing;
