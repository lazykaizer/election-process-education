import React, { useState, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import Quiz from './components/Quiz';
import ErrorBoundary from './components/ErrorBoundary';
import PdfCard from './components/PdfCard';
import FloatingChat from './components/FloatingChat';
import Dashboard from './components/Dashboard';

// Lazy load Landing component
const Landing = lazy(() => import('./Landing'));

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
    icon: '🇮🇳',
    title: 'NRI Voter Registration — Form 6A',
    titleHi: 'NRI मतदाता पंजीकरण — फॉर्म 6A',
    subtitle: 'How overseas Indians can register and vote',
    subtitleHi: 'प्रवासी भारतीय कैसे पंजीकरण और मतदान कर सकते हैं',
    tag: 'Special',
    tagColor: '#0D9488',
    file: 'FAQ_12_NRI_Voter_Registration.pdf'
  }
];

/**
 * Fetches AI chat response from the backend.
 * @param {string} input - User message
 * @param {Array} history - Chat history
 * @returns {Promise<string>} AI reply or error message
 */
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

let currentAudio = null;
/**
 * Handles text-to-speech using Google Cloud TTS with fallback to browser SpeechSynthesis.
 * @param {string} text - Text to speak
 * @param {string} lang - Language code
 * @param {Function} onEnd - Callback when speaking ends
 * @returns {Promise<Object>} Controller object with a stop method
 */
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

  if (!window.speechSynthesis) return { stop: () => {} };
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.9;
  utterance.onend = () => { if(onEnd) onEnd(); };
  window.speechSynthesis.speak(utterance);
  return { stop: () => window.speechSynthesis.cancel() };
}

/**
 * Main App component that manages navigation between Landing and Dashboard.
 */
export default function App() {
  const [view, setView] = useState('landing');
  const [lang, setLang] = useState('en');

  const handleLaunch = () => {
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      {view === 'landing' ? (
        <Suspense fallback={<div className="loading">Loading Naagrik AI...</div>}>
          <Landing onLaunch={handleLaunch} />
        </Suspense>
      ) : (
        <Dashboard 
          onHome={handleHome}
          lang={lang}
          setLang={setLang}
          pdfCards={PDF_CARDS}
          translations={TRANSLATIONS}
          speakFn={speak}
          FloatingChat={FloatingChat}
          getChatResponse={getChatResponse}
        />
      )}
    </ErrorBoundary>
  );
}
