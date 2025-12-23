# Security Policy (Updated: December 2025)

The security of this application is a top priority. We are committed to ensuring the safety of our users and their data by following modern security best practices. We appreciate the efforts of security researchers and the community in helping us maintain a secure environment.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it to us as soon as possible. We will work with you to verify and address the issue promptly.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send a detailed email to `security@chirag127.dev`.

Please include the following in your report:

-   A clear and concise description of the vulnerability.
-   Step-by-step instructions to reproduce the vulnerability.
-   The potential impact of the vulnerability (e.g., data exposure, cross-site scripting).
-   Any suggested mitigations or fixes.

We will acknowledge your email within 48 hours and will provide regular updates on our progress. We kindly request that you do not publicly disclose the issue until we have had a chance to investigate and deploy a fix.

## 🏛️ Architectural Security Practices

This project's security posture is built on a foundation of modern, frontend-only principles as outlined in our `AGENTS.md` file.

-   **100% Frontend-Only**: The application has no backend server, which eliminates a significant portion of the traditional web application attack surface. All code runs in the user's browser.
-   **No Server-Side Data Storage**: The application does not have a database or any server-side storage. All user data is managed and stored on the client-side.

## 🔐 Client-Side Security Measures

### API Key Management

-   **User-Provided Keys**: All API keys for AI services are provided by the user at runtime. We do not provide or endorse the use of any specific keys.
-   **Local Storage**: API keys are stored exclusively in the browser's `localStorage`. They are never transmitted to any server or third-party service, other than the direct API calls to the respective AI providers.
-   **No Hardcoded Secrets**: The codebase contains no hardcoded API keys, tokens, or other secrets.

### Prompt Injection Defense

We recognize that prompt injection is a significant security concern in AI-powered applications. While our frontend-only architecture limits the potential impact, we still take the following precautions:

-   **Input Sanitization**: We perform basic sanitization of user inputs to prevent common cross-site scripting (XSS) attacks.
-   **User Awareness**: The UI is designed to make it clear to the user that they are interacting with a third-party AI service.
-   **Restricted Functionality**: The application does not perform any dangerous actions based on AI-generated content. All AI responses are treated as plain text and are not executed or interpreted in any way.

### Dependency Management

-   **Regular Audits**: We use `npm audit` to regularly scan for vulnerabilities in our dependencies.
-   **Dependabot**: We use GitHub's Dependabot to automatically keep our dependencies up-to-date.

Thank you for helping us keep this project secure.
