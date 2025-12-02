# 🤝 Contributing to ContentFetch-AI-Content-Downloader-MCP-Server

As the Apex Technical Authority, we welcome contributions that adhere to our FAANG-level engineering standards. This repository represents a high-velocity, zero-defect product designed for mission-critical AI agent integration.

By contributing, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 1. Governance and Workflow

We utilize the standard GitHub Flow coupled with rigorous architectural review.

### Before You Start

1.  **Open an Issue:** For any major feature, complex refactoring, or bug fix, first search existing issues. If none exist, open a new one to discuss the scope and architectural implications with the core team.
2.  **Assign Ownership:** Clearly indicate if you intend to implement the solution.
3.  **DCO Sign-off:** All commits must be signed off, agreeing to the Developer Certificate of Origin (DCO). Use `git commit -s`.

### Development Steps

1.  **Fork:** Fork the repository to your own namespace.
2.  **Clone:**
    bash
    git clone https://github.com/<your-username>/ContentFetch-AI-Content-Downloader-MCP-Server.git
    cd ContentFetch-AI-Content-Downloader-MCP-Server
    
3.  **Install Dependencies (Using pnpm):**
    We mandate `pnpm` for efficient dependency management and optimal build times.
    bash
    npm install -g pnpm  # Install pnpm if necessary
    pnpm install
    
4.  **Create a Branch:** Name your branch descriptively (e.g., `feature/add-claude-3-5-support`, `fix/url-encoding-bug`).
    bash
    git checkout -b feature/my-new-function
    

## 2. Development Standards (The Standard of Precision)

### A. Environment and Tooling

| Standard | Tool | Command | Description |
| :--- | :--- | :--- | :--- |
| **Formatting & Linting** | Biome | `pnpm run format` / `pnpm run lint` | Ensures zero-drift code style and high performance. |
| **Testing Framework** | Vitest | `pnpm run test` | For unit, integration, and contract testing of MCP endpoints. |
| **Type Checking** | TypeScript (Strict) | `pnpm run typecheck` | Mandatory full type-safety across all components. |
| **Code Execution** | Node.js (v20+) | `pnpm run start` | Executes the core Content Fetch server. |

### B. Architectural Principles

All code must strictly adhere to the following principles defined in `AGENTS.md`:

*   **SOLID:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
*   **DRY:** Don't Repeat Yourself.
*   **Architectural Pattern:** Modular Monolith / Microservice Communication Protocol (MCP). Ensure clear segregation between the content fetching mechanism, the AI agent integration layer, and the HTTP transport layer.
*   **Error Handling:** All asynchronous operations must use robust `try...catch` blocks or explicit error wrappers, ensuring the MCP response always contains a defined `error` structure on failure.

## 3. Pull Request Submission

When you are ready to submit your code for review, ensure the following checklist is completed:

1.  **Self-Review:** Review your own code carefully. Did you remove all debugging artifacts (`console.log`, `debugger`)?
2.  **Tests:** New features must have comprehensive unit tests (`test/`). Bug fixes must include a regression test that fails without the fix.
3.  **Documentation:** Update the function comments (JSDoc) for any new exported functions or classes.
4.  **Clean History:** Squash unnecessary commits into a logical narrative. Use conventional commit messages (`feat:`, `fix:`, `docs:`).
5.  **Target Branch:** Ensure your PR targets the `main` branch.

### 📜 PR Template Details

Fill out the provided [Pull Request Template](PULL_REQUEST_TEMPLATE.md) completely, linking back to the relevant issues (e.g., `Closes #123`).

## 4. Security Disclosure

If you discover a potential vulnerability, **DO NOT** open a public issue or PR. Please report it privately according to the procedures outlined in our [Security Policy](SECURITY.md).

---
## 5. Resources

| Resource | Link |
| :--- | :--- |
| **Continuous Integration Status** | [Build Status](https://github.com/chirag127/ContentFetch-AI-Content-Downloader-MCP-Server/actions/workflows/ci.yml) |
| **Issue Tracker** | [Open Issues](https://github.com/chirag127/ContentFetch-AI-Content-Downloader-MCP-Server/issues) |
| **Security Policy** | [.github/SECURITY.md](https://github.com/chirag127/ContentFetch-AI-Content-Downloader-MCP-Server/blob/main/.github/SECURITY.md) |