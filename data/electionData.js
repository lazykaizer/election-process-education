'use strict';

/**
 * @fileoverview Comprehensive Indian Election Data — used as context for AI chat
 * and as structured API responses for election education.
 * Data sourced from Election Commission of India (eci.gov.in) and official publications.
 * @module data/electionData
 */

const ELECTION_DATA = {
  /** Key numerical facts about Indian democracy */
  keyFacts: [
    { label: 'Eligible Voters', value: '96.8 Crore', icon: '🗳️' },
    { label: 'Lok Sabha Seats', value: '543', icon: '🏛️' },
    { label: 'Polling Stations', value: '10.5 Lakh+', icon: '📍' },
    { label: 'Voter Helpline', value: '1950', icon: '📞' },
    { label: 'Voting Age', value: '18 years', icon: '🎂' },
    { label: 'ECI Established', value: '25 Jan 1950', icon: '📅' },
  ],

  /** Types of elections conducted in India */
  electionTypes: [
    { name: 'Lok Sabha (General)', desc: 'Elects Members of Parliament to the lower house every 5 years.', nextDue: '2029', frequency: '5 years' },
    { name: 'Rajya Sabha', desc: 'Members elected by state MLAs; 1/3 retire every 2 years. Never dissolved.', nextDue: 'Ongoing (biennial)', frequency: '6-year terms' },
    { name: 'State Assembly (Vidhan Sabha)', desc: 'Elects MLAs to state legislatures. Each state has its own cycle.', nextDue: 'Varies by state', frequency: '5 years' },
    { name: 'Panchayat / Local Body', desc: 'Grassroots elections for village, block, and district-level governance.', nextDue: 'Varies', frequency: '5 years' },
    { name: 'Presidential', desc: 'President elected by Electoral College (elected MPs + MLAs).', nextDue: '2027', frequency: '5 years' },
    { name: 'Vice-Presidential', desc: 'VP elected by members of both houses of Parliament.', nextDue: '2027', frequency: '5 years' },
    { name: 'By-elections', desc: 'Held to fill vacancies caused by resignation, death, or disqualification.', nextDue: 'As needed', frequency: 'As needed' },
  ],

  /** Step-by-step guide to voting on election day */
  votingSteps: [
    { step: 1, title: 'Check Your Name', description: 'Verify your name on the Electoral Roll at voters.eci.gov.in or the Voter Helpline App. Note your polling station address.' },
    { step: 2, title: 'Carry Valid ID', description: 'Bring your EPIC (Voter ID) or any of the 12 approved photo IDs — Aadhaar, passport, driving licence, PAN card, etc.' },
    { step: 3, title: 'Go to Your Polling Station', description: 'Visit your designated polling station between 7 AM – 6 PM on election day. Look for the Help Desk at the entrance.' },
    { step: 4, title: 'Join the Queue', description: 'Stand in the voter queue. Priority access for elderly (80+), disabled, and pregnant voters.' },
    { step: 5, title: 'Get Verified', description: 'Show your ID to the Polling Officer. They will verify your name in the register and apply indelible ink to your left index finger.' },
    { step: 6, title: 'Cast Your Vote', description: 'Enter the voting compartment alone. Press the blue button next to your chosen candidate on the Ballot Unit of the EVM. The VVPAT will show a slip for 7 seconds confirming your choice.' },
    { step: 7, title: 'Leave Quietly', description: 'Exit the polling station. Do not loiter. Maintain the secrecy of your vote as mandated by law.' },
  ],

  /** Parliament structure */
  parliament: {
    lokSabha: {
      seats: 543,
      term: '5 years',
      method: 'Direct election by citizens (First-Past-The-Post)',
      ageRequirement: '25 years',
      speaker: 'Om Birla',
      current: '18th Lok Sabha (2024–2029)',
      reservedSeats: '131 (84 SC + 47 ST)',
      quorum: '1/10 of total members',
    },
    rajyaSabha: {
      seats: 245,
      composition: '233 elected by state MLAs + 12 nominated by President',
      term: '6 years (1/3 retire every 2 years)',
      ageRequirement: '30 years',
      chairman: 'Vice President (Jagdeep Dhankhar)',
      neverDissolved: true,
      largestDelegations: [
        { state: 'Uttar Pradesh', seats: 31 },
        { state: 'Maharashtra', seats: 19 },
        { state: 'Tamil Nadu', seats: 18 },
        { state: 'West Bengal', seats: 16 },
        { state: 'Bihar', seats: 16 },
      ],
    },
  },

  /** President and Vice President info */
  president: {
    current: 'Droupadi Murmu',
    number: '15th President',
    since: 'July 2022',
    term: '5 years',
    electorate: 'Electoral College (elected MPs + elected MLAs)',
    votingSystem: 'Single Transferable Vote (preferential voting)',
    eligibility: 'Indian citizen, 35+ years, no office of profit',
  },
  vicePresident: {
    current: 'Jagdeep Dhankhar',
    number: '14th Vice President',
    since: 'August 2022',
    role: 'Ex-officio Chairman of Rajya Sabha',
  },

  /** States with most Lok Sabha seats */
  topStatesBySeats: [
    { state: 'Uttar Pradesh', seats: 80 },
    { state: 'Maharashtra', seats: 48 },
    { state: 'West Bengal', seats: 42 },
    { state: 'Bihar', seats: 40 },
    { state: 'Tamil Nadu', seats: 39 },
    { state: 'Karnataka', seats: 28 },
    { state: 'Gujarat', seats: 26 },
    { state: 'Rajasthan', seats: 25 },
    { state: 'Madhya Pradesh', seats: 29 },
    { state: 'Andhra Pradesh', seats: 25 },
  ],

  /** Key electoral terms */
  keyTerms: [
    { term: 'EVM', full: 'Electronic Voting Machine', desc: 'Standalone electronic device used for casting votes since 1982.' },
    { term: 'VVPAT', full: 'Voter Verified Paper Audit Trail', desc: 'Prints a paper slip showing voter choice for 7-second verification.' },
    { term: 'EPIC', full: 'Electors Photo Identity Card', desc: 'The official Voter ID card issued by ECI.' },
    { term: 'NOTA', full: 'None Of The Above', desc: 'Option introduced in 2013 by Supreme Court order to reject all candidates.' },
    { term: 'MCC', full: 'Model Code of Conduct', desc: 'Guidelines for parties and candidates during election period. Enforced by ECI.' },
    { term: 'BLO', full: 'Booth Level Officer', desc: 'Local election official responsible for voter registration at booth level.' },
    { term: 'ERO', full: 'Electoral Registration Officer', desc: 'District-level officer responsible for preparing and revising electoral rolls.' },
    { term: 'NVSP', full: 'National Voter Services Portal', desc: 'Online portal for voter registration, corrections, and status tracking.' },
    { term: 'FPTP', full: 'First Past The Post', desc: 'Voting system where the candidate with the most votes wins, used in all direct elections.' },
  ],

  /** Important resources and links */
  resources: [
    { name: 'Voter Registration', url: 'https://voters.eci.gov.in' },
    { name: 'Electoral Search', url: 'https://electoralsearch.eci.gov.in' },
    { name: 'Candidate Affidavits', url: 'https://affidavit.eci.gov.in' },
    { name: 'Voter Helpline', url: 'tel:1950' },
    { name: 'NVSP Portal', url: 'https://www.nvsp.in' },
    { name: 'cVIGIL App', url: 'https://play.google.com/store/apps/details?id=in.eci.cvigil' },
  ],

  /** Quiz questions for civic education */
  quizQuestions: [
    { q: 'What is the minimum voting age in India?', options: ['16', '18', '21', '25'], answer: 1, explanation: 'The 61st Constitutional Amendment (1989) lowered the voting age from 21 to 18 years.' },
    { q: 'How many seats are in the Lok Sabha?', options: ['245', '543', '552', '750'], answer: 1, explanation: 'Lok Sabha has 543 elected seats. The maximum strength is 552 including nominated members.' },
    { q: 'What does NOTA stand for?', options: ['Not On The Agenda', 'None Of The Above', 'National Option for Total Abstain', 'No One To Approve'], answer: 1, explanation: 'NOTA was introduced in 2013 following a Supreme Court order.' },
    { q: 'Who is the current President of India?', options: ['Ram Nath Kovind', 'Pranab Mukherjee', 'Droupadi Murmu', 'A.P.J. Abdul Kalam'], answer: 2, explanation: 'Droupadi Murmu became the 15th President of India in July 2022.' },
    { q: 'When was the Election Commission of India established?', options: ['15 Aug 1947', '26 Jan 1950', '25 Jan 1950', '1 Jan 1951'], answer: 2, explanation: 'ECI was established on 25 January 1950, one day before India became a Republic.' },
    { q: 'Which form is used for new voter registration?', options: ['Form 2A', 'Form 6', 'Form 8', 'Form 10'], answer: 1, explanation: 'Form 6 is for new voter registration. Form 8 is for corrections, and Form 6A is for NRIs.' },
    { q: 'What is the term of a Rajya Sabha member?', options: ['2 years', '4 years', '5 years', '6 years'], answer: 3, explanation: 'Rajya Sabha members serve 6-year terms, with 1/3 retiring every 2 years.' },
    { q: 'What is VVPAT?', options: ['Voter Verified Paper Audit Trail', 'Virtual Voting and Paper Trail', 'Verified Vote and Print Technology', 'Vote Validation Paper Tracker'], answer: 0, explanation: 'VVPAT prints a paper slip for 7 seconds so voters can verify their choice.' },
    { q: 'Who appoints the Chief Election Commissioner?', options: ['Prime Minister', 'Parliament', 'President', 'Supreme Court'], answer: 2, explanation: 'The President of India appoints the CEC on the advice of a selection committee.' },
    { q: 'What is the security deposit for Lok Sabha candidacy?', options: ['₹10,000', '₹25,000', '₹50,000', '₹1,00,000'], answer: 1, explanation: '₹25,000 for General candidates and ₹12,500 for SC/ST candidates.' },
  ],

  /** Upcoming election dates */
  upcomingDates: [
    { event: 'Bihar Assembly Elections', expected: '2025 (Oct–Nov)', type: 'State Assembly' },
    { event: 'Delhi Assembly Elections', expected: '2025 (Feb)', type: 'State Assembly' },
    { event: 'Presidential Election', expected: '2027', type: 'Presidential' },
    { event: 'Next Lok Sabha Election', expected: '2029', type: 'General Election' },
  ],

  /** Latest announcements */
  announcements: [
    { title: 'Voter Helpline App Updated', date: '2026-03-15', summary: 'New features include booth-level search, digital voter slip, and complaint tracking.' },
    { title: 'Remote Voting for Domestic Migrants', date: '2026-02-20', summary: 'ECI is piloting a remote electronic voting system for migrant workers.' },
    { title: 'ECI Mandates Accessibility Audits', date: '2026-01-10', summary: 'All polling stations must now be wheelchair-accessible and have Braille signage.' },
  ],
};

module.exports = { ELECTION_DATA };
