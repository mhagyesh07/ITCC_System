# Backend Application

This directory contains the Node.js and Express.js backend for the Ticketing System. It provides a RESTful API for managing users and tickets.

## Backend Architecture

The backend application follows a layered architecture, promoting separation of concerns and maintainability. It primarily consists of Models, Routes (incorporating controller logic), and Middleware.

### Models (Mongoose for MongoDB)

-   **Schema Definition:** Define the structure of data stored in MongoDB (e.g., `User`, `Ticket`). This includes data types, validation rules, and relationships.
    -   Located in: `models/` (e.g., `models/User.js`, `models/Ticket.js`).
-   **Data Interaction:** Models provide an interface for CRUD (Create, Read, Update, Delete) operations on the database.

### Routes & Controllers

-   **API Endpoints:** Define URL paths for the API (e.g., `/api/users`, `/api/tickets`) and map them to specific handler functions within the route files.
-   **Request Handling & Business Logic:** Route handlers are responsible for:
    -   Receiving and parsing incoming HTTP requests.
    -   Extracting data from request body, parameters, or query strings.
    -   Validating input.
    -   Interacting with Models to perform business logic and data manipulation.
    -   Generating and sending HTTP responses (JSON data, status codes, error messages).
-   **Location:**
    -   Routes are defined in the `routes/` directory (e.g., `routes/userRoutes.js`, `routes/ticketRoutes.js`).
    -   Controller logic is integrated within these route files, keeping related logic grouped by resource. For larger applications, this logic might be separated into dedicated `controllers/` files.

### Middleware

-   **Request Processing Pipeline:** Functions that access the request (`req`), response (`res`), and `next` function in the request-response cycle. They are used for cross-cutting concerns.
-   **Core Middleware Used:**
    -   `express.json()`: Parses incoming requests with JSON payloads.
    -   `express.urlencoded()`: Parses incoming requests with URL-encoded payloads.
    -   `cors`: Enables Cross-Origin Resource Sharing, allowing the frontend (on a different domain/port) to interact with the backend API. Configuration might be applied to allow specific origins.
    -   Custom Authentication Middleware (`middleware/authMiddleware.js`): Verifies JWT tokens sent in request headers to protect routes and identify users.
-   **Other Potential Uses:** Logging, further data validation, rate limiting.
-   **Location:** Common middleware like `authMiddleware.js` is found in the `middleware/` directory.

## Environment Variables

Create a `.env` file in the `backend` directory to store sensitive configuration. **This file should not be committed to version control.**

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/ticketing_system
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
NODE_ENV=development # Options: development, production, test
```

-   `PORT`: The port on which the backend server will listen (default: 5000).
-   `MONGODB_URI`: The full connection string for your MongoDB database instance.
-   `JWT_SECRET`: A strong, unique secret key used for signing and verifying JSON Web Tokens. This is critical for security.
-   `NODE_ENV`: Specifies the runtime environment.
    -   `development`: May enable more verbose logging, debugging features.
    -   `production`: Optimizes for performance, may have less verbose logging.
    -   `test`: For running automated tests.

## Error Handling and Logging

### Error Handling
-   **Synchronous Errors:** Standard JavaScript `try...catch` blocks can be used within route handlers.
-   **Asynchronous Errors:** For errors in asynchronous operations (e.g., database queries), ensure promises are correctly handled (e.g., using `.catch(next)` or `async/await` with `try...catch` passing errors to `next`).
-   **Centralized Error Middleware:** A dedicated error-handling middleware function is typically defined at the end of the middleware stack (after all routes). This function has a signature of `(err, req, res, next)`.
    -   It catches errors passed via `next(err)`.
    -   It sends a standardized error response to the client, often including an appropriate HTTP status code and a JSON message.
    -   Example:
        ```javascript
        // In server.js, after all app.use(routes)
        app.use((err, req, res, next) => {
          console.error(err.stack); // Log the error stack for debugging
          const statusCode = err.statusCode || 500;
          res.status(statusCode).json({
            message: err.message || 'An unexpected error occurred.',
            // Optionally, include stack in development
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
          });
        });
        ```

### Logging
-   **HTTP Request Logging:** While not explicitly configured with a dedicated library like `morgan` in this project, basic request details can be logged manually if needed. For more detailed production logging, `morgan` can be easily integrated.
-   **Application Event Logging:** Currently, application events and errors are primarily logged using `console.log()` and `console.error()`.
-   **Production Logging:** For robust production environments, consider integrating more advanced logging libraries like `winston` or `pino`. These libraries offer features such as:
    -   Different log levels (info, warn, error, debug).
    -   Logging to multiple transports (e.g., files, databases, external logging services).
    -   Structured logging (e.g., JSON format).

## Running the Backend

### Prerequisites

-   Node.js (v14 or higher)
-   npm (Node Package Manager)
-   MongoDB (a running instance, either local or cloud-based)

### Setup and Running

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:** Create and populate the `.env` file as described above.
4.  **Start the server:**
    -   For development (with automatic restarts on file changes):
        ```bash
        npm run dev
        ```
    -   For production:
        ```bash
        npm start
        ```
    The server will start, typically on the port specified by `PORT` (e.g., "Server running on port 5000").

## Available Scripts

Defined in `backend/package.json`:

-   ### `npm start`
    ```json
    "scripts": {
      "start": "node server.js"
    }
    ```
    Runs the application directly with Node.js. Suitable for production.

-   ### `npm run dev`
    ```json
    "scripts": {
      "dev": "nodemon server.js"
    }
    ```
    Runs the application using `nodemon`, which automatically restarts the server upon detecting file changes. Ideal for development. `nodemon` is listed as a devDependency.

Ensure your `server.js` entry point correctly loads environment variables, connects to MongoDB, and starts the Express server.
