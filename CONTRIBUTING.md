# Contributing to the Spatial-Adaptive AI Interface

We're thrilled you're interested in contributing! Your help is vital for building a cutting-edge, frontend-only AI application. To ensure a smooth and collaborative process, please take a moment to review these guidelines.

## 🚀 How to Contribute

1.  **Fork the repository** on GitHub.
2.  **Clone your forked repository** to your local machine.
3.  **Create a new branch** for your changes. Use a descriptive name like `feature/add-new-provider` or `fix/ui-glitch`.
4.  **Make your changes**, ensuring they align with the architectural principles in `AGENTS.md`.
5.  **Add or update tests** to cover your changes. We aim for high test coverage.
6.  **Run all checks** to ensure your code is clean and tests pass: `npm test` and `npm run lint`.
7.  **Commit your changes** using the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).
8.  **Push your changes** to your forked repository.
9.  **Create a pull request** to the `main` branch of the original repository.

## 🤝 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all, regardless of level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality. Please be respectful in all interactions.

## 🛠️ Development Setup

-   **Node.js**: v20+
-   **Package Manager**: npm v10+

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run tests
npm test
```

## 🎨 Code Style & Quality

-   **Formatting**: We use [Prettier](https://prettier.io/) for consistent code formatting. Run `npm run format` to format your code.
-   **Linting**: We use [ESLint](https://eslint.org/) to catch potential errors and enforce code style. Run `npm run lint` to check your code.
-   **TypeScript**: We use TypeScript in strict mode. Ensure your code is fully typed.

## 🏛️ Architectural Principles

This project's architecture is strictly defined by the `AGENTS.md` file. It is the single source of truth for all architectural decisions. Key principles include:

-   **Frontend-Only**: Absolutely no backend code. The application must run entirely in the browser.
-   **Multi-Provider AI Service**: All AI-related functionality must be implemented through the `AIService` abstraction layer.
-   **SOLID & Clean Code**: We adhere to SOLID principles to keep the codebase maintainable and scalable.

## 🧠 AI Best Practices

When working with the AI services, please follow these guidelines:

-   **Use the `AIService`**: Never call AI provider APIs directly. Always use the `AIService` located at `src/services/AIService.ts`. This ensures that the provider cascade, error handling, and security measures are applied consistently.
-   **API Keys**: Remember that users provide their own API keys. Do not hardcode any keys or introduce any mechanism that would store them outside of the user's browser.
-   **Testing**: When adding or modifying AI-related features, you must include tests that mock the API endpoints. The tests should cover success cases, failure cases, and the provider fallback mechanism.

## 🐛 Reporting Bugs

If you encounter a bug, please open an issue on our [issue tracker](https-//github.com/chirag127/AgentData-WebContent-Ingestion-AI-Agent-NodeJS-Service/issues). Include a clear title, a detailed description, and steps to reproduce the bug.

## 💡 Proposing Features

Have an idea for a new feature? We'd love to hear it! Please open an issue to start a discussion. This helps us align on the feature's scope and implementation details before any code is written.

Thank you for contributing to the future of AI interfaces!
