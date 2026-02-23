This project demonstrates an E2E automation framework for a complex AI-based platform.

The Mission
To automate a complete workflow including authentication, dynamic token capture, and complex UI interactions within a modal environment.

Key Technical Challenges Solved
Network Interception: Instead of hardcoding credentials, I implemented a network listener that intercepts the Bearer JWT directly from outgoing API requests. This ensures the test remains synchronized with the application's authentication state.

Environment Cleanup: To ensure test idempotency and a clean environment, I implemented a post-test cleanup routine. This routine reverts any changes made during the test (such as deleting created files), ensuring the system remains in its original state for subsequent runs.

Stability and Clean Code: Integrated JSDoc documentation for all methods and utilized partial attribute matching for locators to ensure the suite remains resilient to minor UI changes.

Architecture
Page Object Model (POM): Organized for high maintainability and clear separation of concerns.

Hybrid Synchronization: Designed to handle asynchronous loading states using networkidle and explicit element waits.

Quick Start
Bash
npm install
npx playwright test
