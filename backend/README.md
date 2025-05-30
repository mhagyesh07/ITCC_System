# Backend Application

This directory contains the Node.js and Express.js backend for the Ticketing System. It provides the API for the frontend application, handles business logic, and interacts with the MongoDB database.

## Backend Architecture

The backend application follows a layered architecture to promote separation of concerns and maintainability.

### Core Structure:
- **`models/`**: Contains Mongoose schema definitions for database entities (e.g., `User.js`, `Ticket.js`). These define the structure of data and provide methods for database interaction.
- **`routes/`**: Defines the API endpoints (e.g., `userRoutes.js`, `ticketRoutes.js`). Each route file handles incoming HTTP requests for a specific resource and maps them to controller logic.
- **`middleware/`**: Contains custom middleware functions used in the request-response cycle (e.g., `authMiddleware.js` for JWT authentication and authorization).
- **`server.js`**: The main entry point for the application. It sets up the Express server, connects to the database, loads middleware, and mounts the API routes.
- **`.env`**: (Not version controlled) Stores environment-specific configuration variables.

*(Note on `backend/build/` directory: A `build/` directory currently exists within `backend/`. This appears to be a misplaced frontend production build. Refer to the main project `README.md` for more details. This backend is not currently configured to serve static files from this directory.)*

### Models (Mongoose)

-   **Schema Definition:** Located in `models/`, these define the structure, data types, validation, and relationships for entities like Users and Tickets.
-   **Data Interaction:** Mongoose models provide a programming interface for CRUD (Create, Read, Update, Delete) operations on the MongoDB database.

-   **API Endpoints:** Defined in `routes/`. These files use Express Router to define paths (e.g., `/api/users`, `/api/tickets/:id`).
-   **Controller Logic:** The business logic for handling requests is currently implemented directly within the route handler functions in the `routes/` files. For more complex applications, this logic might be refactored into separate controller files (e.g., in a `controllers/` directory), but for now, it resides alongside the route definitions.

### Middleware

-   **Request Processing:** Located in `middleware/`. These functions execute during the request-response cycle. Examples include:
    -   `authMiddleware.js`: Protects routes by verifying JWTs and can also handle role-based authorization.
    -   Standard Express middleware like `express.json()` for parsing request bodies.
-   **Error Handling:** Custom error handling middleware can also be defined here to centralize error responses.

## Running the Backend Separately

### Prerequisites

-   Node.js (v14 or higher)
-   pnpm (Node Package Manager) - *This project uses pnpm.*
-   MongoDB (a running instance, either local or cloud-based)

### Setup and Running

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies using pnpm:**
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `backend` directory. This is crucial for security and configuration.
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string # Example: mongodb://localhost:27017/ticketing_system_db
    JWT_SECRET=your_very_strong_and_long_random_jwt_secret_key
    NODE_ENV=development # Can be 'development', 'production', or 'test'
    ```
    -   `PORT`: The port on which the Express server will listen (default is 5000 if not set).
    -   `MONGODB_URI`: The full connection string for your MongoDB database. Ensure the database exists or your setup allows for automatic creation.
    -   `JWT_SECRET`: A long, random, and secret string used to sign and verify JSON Web Tokens. This is critical for security. **Do not commit this to version control.**
    -   `NODE_ENV`: Affects behavior in some libraries (e.g., error handling detail, logging). Set to `production` for deployed environments.

4.  **Start the server:**

    -   **For development (with automatic restarts on file changes using nodemon, if configured):**
        ```bash
        pnpm run dev
        ```
        *(This assumes a `dev` script is defined in `package.json` like `"dev": "nodemon server.js"`)*

    -   **For production (or if no `dev` script is available):**
        ```bash
        pnpm start
        ```
        *(This assumes a `start` script like `"start": "node server.js"`)*

    The server will start, and you should see a console message indicating it's running and connected to MongoDB (if connection logic includes logging).

## Available Scripts

The `package.json` file in the `backend` directory defines available scripts. Common scripts include:

-   ### `pnpm start`
    Typically runs the application directly with Node: `node server.js`. Suitable for production.

-   ### `pnpm run dev`
    Often uses `nodemon` (e.g., `nodemon server.js`) to run the application in development mode, automatically restarting the server when code changes are detected. If `nodemon` is not listed as a dev dependency in `package.json`, you can install it with `pnpm add -D nodemon` and then define the script.

*(Check `backend/package.json` for the exact script definitions.)*

---

*This README provides an overview of the backend application. For more specific details, refer to the source code and comments within the respective files.*
