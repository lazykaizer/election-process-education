import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_DATA = [
  {
    question: "What is the minimum age to vote in India?",
    options: ["16", "18", "21", "25"],
    answer: "18",
    explanation: "Article 326 of the Constitution provides that the elections to the House of the People and to the Legislative Assembly of every State shall be on the basis of adult suffrage, meaning anyone 18 or older."
  },
  {
    question: "Which document is mandatory for voting in India?",
    options: ["PAN Card", "Aadhar Card", "Voter ID (EPIC)", "Ration Card"],
    answer: "Voter ID (EPIC)",
    explanation: "An Elector's Photo Identity Card (EPIC) is issued by the Election Commission of India. However, if not available, 11 other alternative documents are allowed."
  },
  {
    question: "What does EVM stand for?",
    options: ["Election Vote Machine", "Electronic Voting Machine", "Every Voter Matters", "Electronic Voter Method"],
    answer: "Electronic Voting Machine",
    explanation: "Electronic Voting Machines (EVMs) have replaced paper ballots in local, state and general (parliamentary) elections in India since the late 1990s."
  },
  {
    question: "What is NOTA?",
    options: ["None of the Above", "New Online Training Act", "National Order of Teaching Agencies", "None of These Agencies"],
    answer: "None of the Above",
    explanation: "NOTA allows voters to express their disapproval of all the candidates in a constituency. It was introduced following a 2013 Supreme Court directive."
  },
  {
    question: "Who conducts elections in India?",
    options: ["Supreme Court", "Parliament", "Election Commission of India", "President"],
    answer: "Election Commission of India",
    explanation: "The ECI is an autonomous constitutional authority responsible for administering election processes in India at national and state levels."
  }
];

export default function Quiz({ lang }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (option) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === QUIZ_DATA[currentStep].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < QUIZ_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    const percentage = Math.round((score / QUIZ_DATA.length) * 100);
    return (
      <motion.div 
        className="quiz-card result"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <span className="quiz-emoji">{percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}</span>
        <h3>Quiz Completed!</h3>
        <p className="quiz-score">Your Score: {score} / {QUIZ_DATA.length}</p>
        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
          {percentage >= 80 ? 'Excellent knowledge of the election process!' : 'Good effort! Keep exploring the guides to learn more.'}
        </p>
        <button className="quiz-btn-primary" onClick={resetQuiz}>Try Again</button>
      </motion.div>
    );
  }

  const currentQ = QUIZ_DATA[currentStep];

  return (
    <motion.div 
      className="quiz-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={currentStep}
    >
      <div className="quiz-header">
        <span className="quiz-tag">Question {currentStep + 1}</span>
        <span className="quiz-progress">{currentStep + 1}/{QUIZ_DATA.length}</span>
      </div>
      
      <div className="quiz-progress-bar">
        <motion.div 
          className="quiz-progress-fill" 
          initial={{ width: `${(currentStep / QUIZ_DATA.length) * 100}%` }}
          animate={{ width: `${((currentStep + 1) / QUIZ_DATA.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <h3 className="quiz-question">{currentQ.question}</h3>
      
      <div className="quiz-options">
        {currentQ.options.map(opt => {
          let btnClass = "quiz-option-btn";
          if (isAnswered) {
            if (opt === currentQ.answer) btnClass += " correct";
            else if (opt === selectedOption) btnClass += " incorrect";
            else btnClass += " disabled";
          }
          
          return (
            <motion.button 
              key={opt} 
              className={btnClass} 
              onClick={() => handleAnswer(opt)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div 
            className="quiz-explanation"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
          >
            <div className={`explanation-box ${selectedOption === currentQ.answer ? 'success' : 'error'}`}>
              <strong>{selectedOption === currentQ.answer ? '✅ Correct!' : '❌ Incorrect!'}</strong>
              <p>{currentQ.explanation}</p>
            </div>
            <button className="quiz-next-btn" onClick={handleNext}>
              {currentStep < QUIZ_DATA.length - 1 ? 'Next Question →' : 'See Results 🏆'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
