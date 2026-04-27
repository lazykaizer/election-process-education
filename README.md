# Naagrik AI 🇮🇳 - Election Education Dashboard

**Live App:** [https://election-process-education-822432431754.asia-south1.run.app](https://election-process-education-822432431754.asia-south1.run.app)
**GitHub:** [https://github.com/lazykaizer/election-process-education](https://github.com/lazykaizer/election-process-education)

---

## 🎯 Chosen Vertical
**Civic Education & Governance**: This project focuses on empowering Indian citizens by simplifying complex election processes. It bridges the gap between official legal documentation and citizen understanding using AI.

## 💡 Approach and Logic
### The Hybrid Intelligence Model
Naagrik AI uses a two-tier logic system to ensure accuracy and performance:
1.  **Keyword Scoring Algorithm**: A custom-built local engine analyzes user queries. It assigns scores based on keyword density and word boundaries (e.g., "vote", "register", "EVM") to instantly match the user with validated, official ECI guidelines.
2.  **Vertex AI Integration (Future-Ready)**: The system is designed to integrate with Gemini API using **Google Search Grounding**. This ensures that for queries outside the static knowledge base, the AI fetches realtime, verified data from the web.

## 🏗️ How the Solution Works
1.  **Dashboard Hub**: Users can interact with visual cards representing core election pillars (Voter Registration, EVM/VVPAT, etc.).
2.  **Conversational Agent**: A reactive chat interface that provides structured, easy-to-read answers.
3.  **Deployment**: Containerized using **Docker** and deployed on **Google Cloud Run** for high availability and auto-scaling.

## 📝 Assumptions Made
-   Users have a basic understanding of mobile/web interfaces.
-   Official guidelines (like Form 6 for registration) remain the standard across election cycles.
-   English is the primary language for this version, with a focus on simple, non-legal terminology.

## 🛡️ Evaluation Focus Areas
### 1. Code Quality
-   **Modular Structure**: Components are separated (Landing, Dashboard, AI Logic).
-   **Clean Logic**: Uses Regex with word boundaries (`\b`) to prevent false-positive matching.
-   **CSS Variables**: Centralized design tokens for consistent branding.

### 2. Security
-   **Environment Protection**: Sensitive configurations are managed via `.env` files (excluded from GitHub).
-   **Input Sanitization**: Query inputs are handled as strings to prevent basic injection patterns.

### 3. Efficiency
-   **Zero-Overhead Search**: Local matching logic is extremely fast (O(n) complexity), reducing API costs for common queries.
-   **Cloud Run Architecture**: Scales to zero when not in use, optimizing resource consumption.

### 4. Accessibility & UI/UX
-   **Semantic HTML**: Uses `<main>`, `<section>`, `<nav>`, and `<button>` correctly.
-   **Inclusive Design**: ARIA labels, high contrast ratios, and clear typography (DM Sans).
-   **Responsive**: Fully optimized for mobile, tablet, and desktop.

### 5. Testing & Validation
- **Unit Logic Testing**: The keyword scoring engine was tested against a battery of 20+ query variations to ensure no infinite loops and high matching accuracy.
- **Responsive Audit**: Verified layouts across iPhone SE, Pixel 7, and 4K Desktop resolutions.
- **Deployment Testing**: Verified production build artifacts using `sirv-cli` locally before pushing to Cloud Run.
- **Accessibility Check**: Basic ARIA validation to ensure screen reader compatibility for core chat actions.

### 6. Google Services Integration
-   **Google Cloud Run**: Managed serverless deployment.
-   **Google Cloud Artifact Registry**: Secure container image management.
-   **Google Search Grounding**: (Implementation-ready) Designed to use Gemini with Google Search for verified realtime grounding.

## 🚀 Future Scope
-   **Multilingual Support**: Integration with Google Translate API for regional language support (Hindi, Marathi, Bengali, etc.).
-   **Voice Assistant**: Implementing Web Speech API for hands-free navigation for elderly citizens.
-   **Realtime Polling Data**: Integration with ECI Open Data APIs (when available) for live turnout statistics.

---
Developed with ❤️ for the Citizens of India.
