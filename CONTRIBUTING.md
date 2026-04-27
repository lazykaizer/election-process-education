# Contributing to Naagrik AI 🇮🇳

First off, thank you for considering contributing to Naagrik AI! It's people like you that make this civic education platform an empowering tool for the Indian Electoral Process.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please be welcoming, inclusive, and respectful to all contributors.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue in the repository with the following information:
*   A clear and descriptive title.
*   Steps to reproduce the issue.
*   Expected behavior vs. actual behavior.
*   Browser and OS version.

### Suggesting Enhancements

We are always looking for ways to improve Naagrik AI. If you have a feature request:
*   Open an issue tagged as an `enhancement`.
*   Provide a detailed description of the proposed feature and its benefit to users.

### Pull Requests

1.  **Fork the repository** and clone it locally.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `fix/your-bug-fix`.
3.  **Make your changes**, ensuring they adhere to the project's coding standards.
    *   Add JSDoc comments to all major functions.
    *   Keep functions modular (ideally under 40 lines).
    *   Use PropTypes for React components.
4.  **Test your changes**. Run `npm test` and ensure all tests pass.
5.  **Commit your changes** with a clear and descriptive commit message.
6.  **Push to your fork** and submit a **Pull Request** to the `main` branch.

## Development Setup

See the [README.md](README.md) for detailed instructions on setting up the local development environment, including required environment variables for Google Cloud Services.

## Coding Standards

*   **Structure**: Follow the "Senior Developer" organizational pattern:
    *   `constants/`: Static data (election stats, language lists).
    *   `utils/`: Pure helper functions and logic shared across routes.
    *   `config/`: Environment and initialization logic.
    *   `routes/`: API endpoint definitions (should remain slim).
    *   `services/`: External API integrations (Google Cloud, etc.).
*   **Formatting**: We use `.editorconfig` for consistent formatting. Ensure your editor respects these rules.
*   **Documentation**: All new services, routes, and utilities must be documented using JSDoc.
*   **Components**: React components should be functional components using Hooks and must define `propTypes`.
*   **Error Handling**: Frontend components should utilize the `ErrorBoundary`. Backend routes must handle errors gracefully and provide clear error messages.

Thank you for contributing to India's democracy! 🗳️
