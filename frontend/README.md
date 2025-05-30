# Frontend Application

This directory contains the React.js frontend for the Ticketing System. It is built using Create React App, with Redux for state management and Bootstrap for styling.

## Frontend Architecture

The frontend application follows a component-based architecture, leveraging modern React features and best practices.

### Core Technologies
- **React:** A JavaScript library for building user interfaces.
- **Redux Toolkit:** For efficient and predictable state management (`@reduxjs/toolkit`). The Redux setup, including the store, reducers (slices), and actions, is located in the `src/redux` directory.
- **React Router:** `react-router-dom` is used for client-side routing and navigation.
- **Bootstrap & React-Bootstrap:** For UI components and styling, providing a responsive and consistent look and feel.
- **Axios:** A promise-based HTTP client for making API requests to the backend.
- **React Hot Toast:** For displaying notifications to the user.

### Project Structure
- **`src/components/`**: Contains reusable UI components that are used across multiple parts of the application (e.g., login forms, buttons, specific parts of views). These are generally presentational or have localized state.
- **`src/pages/`**: Contains top-level components that represent distinct pages or views within the application (e.g., Dashboard, Ticket List, User Profile). These components often orchestrate multiple smaller components and connect to the Redux store for data.
- **`src/redux/`**: Houses all Redux-related code:
    - `store.js`: Configures the main Redux store.
    - Subdirectories for different state slices (e.g., `tickets/`): Each slice typically contains its reducer, actions, and potentially selectors, following the Redux Toolkit paradigm.
- **`src/App.js`**: The main application component, often responsible for setting up routing and global layout.
- **`public/`**: Contains static assets like `index.html`, favicons, and `manifest.json`.

### State Management (Redux Toolkit)
- **Centralized Store:** A single Redux store (`src/redux/store.js`) serves as the source of truth for global application state.
- **Slices:** Redux Toolkit's `createSlice` is used to define reducers and actions for different parts of the application state (e.g., tickets, user authentication). This simplifies boilerplate and promotes best practices.
- **Actions & Reducers:** Actions are dispatched to update the store, and reducers (within slices) specify how the state changes in response.
- **Async Operations:** Asynchronous logic, like API calls, is typically handled using Redux Thunks (built into Redux Toolkit's `createAsyncThunk`) or other middleware.

### Routing
- **`react-router-dom`:** Handles navigation between different pages/views.
- **Route Definitions:** Routes are typically defined in `src/App.js` or a dedicated routing configuration file, mapping URL paths to components in the `src/pages/` directory.
- **Protected Routes:** Routes requiring authentication are guarded, redirecting unauthenticated users to a login page.

## Building and Running the Frontend Separately

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup and Running

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `frontend` directory:
    ```env
    REACT_APP_API_BASE_URL=http://localhost:5000/api
    ```
    - `REACT_APP_API_BASE_URL`: Specifies the base URL for API requests. This is crucial for production builds or when the backend is running on a different host/port not covered by the proxy.
    - **Development Proxy:** Note that the `package.json` includes a `proxy` setting (`"proxy": "http://localhost:5000"`). During development (`npm start`), this proxies API requests from the React development server to the backend server at `http://localhost:5000`, allowing you to make requests like `/api/tickets` directly without specifying the full base URL. However, `REACT_APP_API_BASE_URL` is still useful for explicit configuration or for builds deployed independently of the backend.

4.  **Start the development server:**
    ```bash
    npm start
    ```
    This will start the React development server (usually on `http://localhost:3000`) with hot reloading.

## Available Scripts

In the `frontend` directory, you can run the following standard Create React App scripts:

-   ### `npm start`
    Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it.
-   ### `npm test`
    Launches the test runner. See the CRA documentation on [running tests](https://facebook.github.io/create-react-app/docs/running-tests).
-   ### `npm run build`
    Builds the app for production to the `build` folder. See the CRA documentation on [deployment](https://facebook.github.io/create-react-app/docs/deployment).
-   ### `npm run eject`
    Removes the single build dependency and copies configuration files into your project for full control. **This is a one-way operation.**

## Deployment

The frontend can be built using `npm run build` and the resulting static assets in the `build/` folder can be deployed to any static hosting service.

- **Vercel:** This project includes a `vercel.json` file in the `frontend` directory, configured for deployments to [Vercel](https://vercel.com/). When deploying to Vercel, ensure the project root is set to the `frontend` directory. Vercel will use this file and typically auto-detect Create React App settings. For more general deployment information, refer to the main project README's "Deployment" section.
