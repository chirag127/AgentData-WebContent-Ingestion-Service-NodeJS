# PROPOSED: AgentData Web Content Ingestion AI Agent

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg?style=flat-square)](https://creativecommons.org/licenses/by-nc/4.0/)
[![CI](https://img.shields.io/github/actions/workflow/status/chirag127/AgentData-WebContent-Ingestion-AI-Agent-NodeJS-Service/ci.yml?branch=main&style=flat-square)](https://github.com/chirag127/AgentData-WebContent-Ingestion-AI-Agent-NodeJS-Service/actions/workflows/ci.yml)

A professional, frontend-only website for interacting with multiple AI providers to fetch and process web content directly in your browser. This repository is a demonstration of a modern, serverless, and secure AI-powered web application.

---

## 🌟 Key Features

-   🌐 **100% Frontend-Only**: Zero backend dependencies. Deployable on any static hosting platform (GitHub Pages, Vercel, etc.).
-   🧠 **Multi-Provider AI Orchestration**: Integrates with Cerebras, Google Gemini, DeepSeek, and other top-tier AI providers.
-   🔄 **Automatic Fallback Mechanism**: If one provider fails, the system automatically cascades to the next available one, ensuring high availability.
-   🔐 **Secure API Key Management**: API keys are provided by the user at runtime and stored exclusively in the browser's local storage. No keys are ever transmitted to a server.
-   ✨ **Spatial-Adaptive User Interface**: A modern, clean, and responsive UI built with Tailwind CSS, featuring a bento-grid layout.
-   🛠️ **Modern Tech Stack**: Built with Vite, React, and TypeScript for a fast, efficient, and type-safe development experience.
-   📜 **Compliant with `AGENTS.md`**: Adheres to the strict architectural and coding standards outlined in the `AGENTS.md` file.

---

## 🏗️ Architecture Overview

The application follows a clean, feature-based architecture, with a strict separation of concerns.

```
/
├── .github/              # CI/CD workflows and repository templates
├── public/               # Static assets (e.g., favicon)
├── src/
│   ├── services/         # Core application logic
│   │   └── AIService.ts  # Handles all AI provider API calls and orchestration
│   ├── App.tsx           # The main React component with the UI
│   ├── main.tsx          # The entry point of the React application
│   └── index.css         # Global styles using Tailwind CSS
├── tests/                # Unit and integration tests
│   └── AIService.test.ts # Tests for the AI service
├── .gitignore            # Standard gitignore for a Vite project
├── AGENTS.md             # The master directive for AI agent development
├── index.html            # The main HTML file
├── LICENSE               # CC BY-NC 4.0 License
├── package.json          # Project dependencies and scripts
└── vite.config.ts        # Vite configuration
```

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

-   Node.js (version 18 or newer)
-   npm (version 9 or newer) or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/chirag127/AgentData-WebContent-Ingestion-AI-Agent-NodeJS-Service.git
    cd AgentData-WebContent-Ingestion-AI-Agent-NodeJS-Service
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

### Running in Development Mode

1.  **Start the development server:**
    ```sh
    npm run dev
    ```
    This will start the Vite development server, and you can access the application at `http://localhost:5173`.

2.  **Configure API Keys:**
    -   In the application's UI, you'll find a section for API keys.
    -   Enter your personal API keys for the AI providers you wish to use.
    -   Click the "Save Keys" button. Your keys will be saved securely in your browser's local storage.

---

## 🤝 How to Contribute

We welcome contributions from the community! To get started, please read our [CONTRIBUTING.md](CONTRIBUTING.md) file, which contains our development workflow, coding standards, and pull request guidelines.

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License**. See the [LICENSE](LICENSE) file for more details.

---

## ⭐ Show Your Support

If you find this project interesting or useful, please consider giving it a star on GitHub!
