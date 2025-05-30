# Frontend Application

This directory contains the React.js frontend for the Ticketing System.

## Frontend Architecture

The frontend application follows a component-based architecture, leveraging modern React features and best practices.

### Components

- **Reusable UI Elements:** The application is built using a collection of reusable React components, located in the `src/components` directory. These components range from simple UI elements (buttons, inputs) to more complex views (ticket lists, forms).
- **Container Components:** Higher-order components or components that manage application state and logic, often connecting to the Redux store.
- **Presentational Components:** Components focused solely on rendering UI based on props received, promoting reusability and separation of concerns.

### State Management (Redux)

- **Centralized Store:** We use Redux for managing global application state. The Redux store is the single source of truth for data that needs to be accessed by multiple components.
- **Actions & Reducers:**
    - **Actions:** Plain JavaScript objects that represent an intention to change the state. They are dispatched from components (e.g., when a user clicks a button).
    - **Reducers:** Pure functions that specify how the application's state changes in response to actions. Each reducer manages a slice of the application state.
- **Selectors:** Functions used to efficiently retrieve derived data from the Redux store.
- **Middleware (e.g., Redux Thunk):** Used for handling asynchronous operations, such as API calls, before an action reaches the reducers.

The Redux setup (store, reducers, actions) can typically be found in the `src/store` or `src/redux` directory.

### Routing

- **React Router:** Client-side routing is handled by `react-router-dom`. This allows for navigation between different views/pages of the application without requiring a full page reload.
- **Route Definitions:** Routes are typically defined in a central location (e.g., `src/App.js` or a dedicated `src/routes.js` file), mapping URL paths to specific React components.
- **Protected Routes:** Routes that require user authentication are protected, redirecting unauthenticated users to a login page.

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

3.  **Environment Variables (Optional but Recommended):**
    Create a `.env` file in the `frontend` directory to configure environment-specific settings. For example:
    ```env
    REACT_APP_API_BASE_URL=http://localhost:5000/api
    ```
    The frontend will use this base URL to make API requests to the backend.

4.  **Start the development server:**
    ```bash
    npm start
    ```
    This will start the React development server (usually on `http://localhost:3000`) with hot reloading enabled.

## Available Scripts

In the `frontend` directory, you can run the following scripts:

-   ### `npm start`

    Runs the app in development mode.
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
    The page will reload if you make edits. You will also see any lint errors in the console.

-   ### `npm test`

    Launches the test runner in interactive watch mode.
    See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information. (Note: This assumes Create React App or a similar setup).

-   ### `npm run build`

    Builds the app for production to the `build` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.
    The build is minified and the filenames include the hashes. Your app is ready to be deployed!
    See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

-   ### `npm run eject`

    **Note: this is a one-way operation. Once you `eject`, you can’t go back!**
    If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
    Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of पायthe commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point, you’re on your own.
    You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However, we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

(Modify the test and deployment links if not using Create React App as the base).
