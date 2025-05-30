# Contributing to the Ticketing System

Thank you for considering contributing to the Ticketing System project! We welcome your help to make this project better. All contributions are greatly appreciated, from bug reports and feature suggestions to code changes.

To ensure a smooth and effective collaboration, please review these guidelines.

## Code of Conduct

We are committed to fostering an open and welcoming environment. All contributors are expected to treat each other with respect, professionalism, and consideration. Please engage in discussions constructively and avoid any form of harassment. (A formal Code of Conduct may be added in the future).

## Getting Started: Setting up Your Development Environment

1.  **Fork the Repository:**
    Start by forking the main repository to your own GitHub account.

2.  **Clone Your Fork:**
    Clone your forked repository to your local machine:
    ```bash
    git clone https://github.com/YOUR_USERNAME/ticketing-system.git
    cd ticketing-system
    ```
    Replace `YOUR_USERNAME` with your actual GitHub username.

3.  **Install Backend Dependencies:**
    Navigate to the backend directory and install the necessary Node.js packages:
    ```bash
    cd backend
    npm install
    ```

4.  **Set Up Backend Environment Variables:**
    Create a `.env` file in the `backend` directory by copying the example or creating it manually.
    ```bash
    cp .env.example .env  # If an .env.example exists, or create manually
    ```
    Populate it with the required variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/ticketing_system_dev
    JWT_SECRET=your_super_secret_jwt_key_for_development_at_least_32_characters
    NODE_ENV=development
    ```
    *Ensure `MONGODB_URI` points to your development database instance.*
    *Use a distinct `JWT_SECRET` for your development environment.*

5.  **Install Frontend Dependencies:**
    Navigate to the frontend directory and install its dependencies:
    ```bash
    cd ../frontend # Assuming you were in the backend/ directory
    # Or from the project root: cd frontend
    npm install
    ```

6.  **Set Up Frontend Environment Variables:**
    Create a `.env` file in the `frontend` directory.
    ```bash
    cp .env.example .env  # If an .env.example exists, or create manually
    ```
    Add the necessary environment variables:
    ```env
    REACT_APP_API_BASE_URL=http://localhost:5000/api
    ```
    *Note: The frontend `package.json` also includes a `proxy` setting for development, which directs API calls to `http://localhost:5000`. `REACT_APP_API_BASE_URL` can be used for more explicit control or for builds.*

7.  **Running the Application:**
    -   **Backend:** From the `backend` directory, run `npm run dev`.
    -   **Frontend:** From the `frontend` directory, run `npm start`.

## Branching Strategy

We use a Gitflow-inspired branching model:

-   **`main`:** This branch reflects the latest production-ready code. Direct commits to `main` are restricted. Merges to `main` are typically done from `develop` (for releases) or `hotfix` branches.
-   **`develop`:** This is the primary development branch. All new features and non-critical bug fixes are developed here or in feature branches off of `develop`. It should ideally always be stable and ready for a potential release.
-   **Feature Branches (`feature/...`):**
    -   For new features, create a branch from `develop`.
    -   Naming convention: `feature/<short-feature-description>` (e.g., `feature/user-profile-editing`).
    -   Once the feature is complete and tested, submit a Pull Request to merge it into `develop`.
-   **Bugfix Branches (`fix/...`):**
    -   For non-critical bug fixes, branch from `develop`.
    -   Naming convention: `fix/<issue-id>-<short-description>` (e.g., `fix/123-login-button-alignment`).
    -   Merge back into `develop` via a Pull Request.
-   **Hotfix Branches (`hotfix/...`):**
    -   For critical production bugs that need immediate attention.
    -   Branch directly from `main`.
    -   Naming convention: `hotfix/<issue-id>-<urgent-fix-description>` (e.g., `hotfix/456-critical-auth-vulnerability`).
    -   Once fixed and tested, merge directly into `main` AND also into `develop` to ensure the fix is incorporated into ongoing development.

## Making Changes & Coding Style

-   **Consistency:** Adhere to the existing code style, formatting, and naming conventions found in the project. We aim for clean and readable code.
-   **Clarity & Comments:** Write clear and concise code. Add comments to explain complex logic, non-obvious decisions, or areas that might be confusing to others.
-   **Focused Changes:** Each commit and Pull Request should ideally address a single issue, feature, or bugfix. Avoid bundling unrelated changes.
-   **Linting:** (If linters like ESLint/Prettier are configured) Ensure your code adheres to the project's linting rules before committing. You might be able to run a linting script (e.g., `npm run lint`).
-   **API Design (Backend):** When adding or modifying API endpoints, follow RESTful principles. Ensure responses are consistent and use appropriate HTTP status codes.
-   **Component Design (Frontend):** Aim for reusable and well-encapsulated React components. Separate concerns (e.g., presentational vs. container components, stateful logic).

## Testing

While comprehensive test suites are still under development, we encourage writing tests for new contributions.

-   **Running Existing Tests:**
    -   **Frontend:** `npm test` (in the `frontend` directory).
    -   **Backend:** (Specify if backend tests and how to run them are available, e.g., `npm test` in `backend`).
-   **Expectations for New Code:**
    -   New features should ideally be accompanied by unit tests and/or integration tests.
    -   Bug fixes should include tests that demonstrate the bug and verify the fix.
    -   Even if you're unsure how to write tests, please indicate this in your PR, and we can help.

## Submitting Pull Requests (PRs)

1.  **Ensure your local `develop` branch is up-to-date** with the upstream `develop` before creating your feature/fix branch.
2.  **Complete Your Changes:** Make your changes on your feature/fix branch.
3.  **Test Your Changes:** Run any relevant tests and ensure they pass. Manually test your changes thoroughly.
4.  **Commit Your Work:** Write clear and descriptive commit messages.
5.  **Push Your Branch:** Push your feature/fix branch to your fork on GitHub.
    ```bash
    git push origin feature/<your-feature-name>
    ```
6.  **Create the Pull Request:**
    -   Navigate to the main repository on GitHub.
    -   You should see a prompt to create a PR from your recently pushed branch.
    -   **Target Branch:**
        -   Most PRs (features, non-critical fixes) should target the `develop` branch.
        -   Hotfixes should target the `main` branch.
    -   **Title:** Provide a clear, concise title that summarizes the changes (e.g., "Feat: Add user profile editing page" or "Fix: Resolve login error for invalid credentials").
    -   **Description:**
        -   Clearly describe the problem your PR solves or the feature it adds.
        -   Explain the changes you made.
        -   Link to any relevant GitHub issues (e.g., "Closes #123", "Fixes #456").
        -   Include steps for reviewers to test your changes if applicable.
    -   **Draft PRs:** If your work is not yet ready for a full review but you'd like early feedback, consider creating a Draft Pull Request.
7.  **Code Review:**
    -   Request reviews from project maintainers or other contributors.
    -   Be prepared to discuss your changes and make adjustments based on feedback.
    -   Once the PR is approved and all checks pass, it will be merged by a maintainer.

Thank you for contributing! Your efforts help make this project better for everyone.
