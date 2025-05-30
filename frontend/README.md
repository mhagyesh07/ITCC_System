# Frontend Application

This directory contains the React.js frontend for the Ticketing System. It is designed to interact with the backend API to provide a user interface for creating, managing, and viewing tickets.

## Frontend Architecture

The frontend application follows a component-based architecture, leveraging modern React features and best practices.

### Core Structure:
- **`public/`**: Contains static assets like `index.html`, `favicon.ico`, and `manifest.json`.
- **`src/`**: Contains the vast majority of the React application code.
    - **`src/components/`**: Reusable UI components (e.g., buttons, forms, layout elements).
    - **`src/pages/`**: Top-level components that represent different pages or views of the application (e.g., LoginPage, DashboardPage, TicketDetailPage).
    - **`src/redux/`**: Contains all Redux-related code for state management.
        - **`store.js`**: The main Redux store configuration (`frontend/src/redux/store.js`).
        - **Sub-directories (e.g., `tickets/`)**: Typically for actions, reducers, and selectors related to specific state slices.
    - **`src/App.js`**: The main application component, often responsible for routing.
    - **`src/index.js`**: The entry point of the React application, rendering the `App` component into the DOM.
- **`vercel.json`**: Configuration file for deploying this frontend to Vercel.

*(Note: There also appears to be a `frontend/redux/` directory. This might be redundant or legacy. It's recommended to consolidate all Redux logic under `frontend/src/redux/` for clarity and consistency.)*

### Components

- **Reusable UI Elements:** Located in `src/components/`, these are general-purpose components used throughout the application.
- **Page Components:** Located in `src/pages/`, these components orchestrate various UI elements and application logic for specific views.
- **Container vs. Presentational Components:** While not strictly enforced by directory structure, the application aims to separate components that manage logic and state (containers) from those that primarily render UI (presentational).

### State Management (Redux)

- **Centralized Store:** Redux (`frontend/src/redux/store.js`) is used for global application state that needs to be shared across multiple components (e.g., user authentication status, ticket lists).
- **Actions & Reducers:** Standard Redux pattern for updating state in response to application events or API calls.
- **Middleware (e.g., Redux Thunk):** Used for handling asynchronous operations like fetching data from the backend API.

### Routing

- **React Router:** `react-router-dom` is used for client-side navigation, allowing users to move between different pages without full page reloads.
- **Route Definitions:** Typically configured within `src/App.js` or a dedicated routing module.
- **Protected Routes:** Implemented to restrict access to certain pages based on user authentication status.

## Building and Running the Frontend Separately

### Prerequisites

- Node.js (v14 or higher)
- pnpm (Node Package Manager) - *This project uses pnpm.*

### Setup and Running

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies using pnpm:**
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `frontend` directory. This is especially important for specifying the backend API URL:
    ```env
    REACT_APP_API_BASE_URL=http://localhost:5000/api
    ```
    -   `REACT_APP_API_BASE_URL`: This variable tells the frontend where to send API requests. During local development, it usually points to your local backend server. For production deployments, this would be the URL of your deployed backend.
    *(Your application might require other environment variables; document them here as they are added.)*

4.  **Start the development server:**
    ```bash
    pnpm start
    ```
    This will start the React development server (usually on `http://localhost:3000`) with hot reloading.

## Available Scripts

In the `frontend` directory, you can run the following scripts using `pnpm`:

-   ### `pnpm start`

    Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits, and you'll see lint errors in the console.

-   ### `pnpm test`

    Launches the test runner in interactive watch mode (if testing frameworks like Jest are configured). See project-specific testing documentation for more details.

-   ### `pnpm run build`

    Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified, and filenames include hashes.

-   ### `pnpm run eject` (If applicable)

    **Note: this is a one-way operation. Once you `eject`, you can’t go back!**
    If your project was bootstrapped with a tool like Create React App and you need to customize the underlying build configurations (webpack, Babel, ESLint, etc.), `eject` will remove the single build dependency and copy the configuration files into your project. Use with caution. If this project does not use Create React App, this script might not be relevant.

## Deployment

This frontend application is configured for deployment via Vercel, as indicated by the `vercel.json` file. For detailed deployment steps and backend deployment, refer to the "Deployment" section in the main project `README.md` at the root of this repository.

---

*This README provides an overview of the frontend application. For more specific details, refer to the source code and comments within the respective files.*
