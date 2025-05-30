# Backend Application

This directory contains the Node.js and Express.js backend for the Ticketing System.

## Backend Architecture

The backend application follows a layered architecture, promoting separation of concerns and maintainability. It primarily consists of Models, Routes, and Middleware.

### Models (e.g., using Mongoose for MongoDB)

-   **Schema Definition:** Define the structure of the data that will be stored in the database (e.g., MongoDB). This includes data types, validation rules, and relationships between different data entities (e.g., User, Ticket).
-   **Data Interaction:** Models provide an interface to interact with the database, allowing the application to perform CRUD (Create, Read, Update, Delete) operations.
-   **Location:** Typically found in a `models/` directory (e.g., `models/User.js`, `models/Ticket.js`).

### Routes

-   **API Endpoints:** Define the URL paths for the API and map them to specific controller functions. Each route handles incoming HTTP requests (GET, POST, PUT, DELETE, etc.) for a particular resource or action.
-   **Request Handling:** Routes are responsible for receiving requests, extracting necessary data (e.g., from request body, parameters, or query strings), and invoking the appropriate controller logic.
-   **Response Generation:** Send back HTTP responses to the client, including status codes, data (often in JSON format), or error messages.
-   **Location:** Typically found in a `routes/` or `routes/api/` directory (e.g., `routes/auth.js`, `routes/tickets.js`).

### Controllers (Often part of Routes or in a separate `controllers/` directory)

-   **Business Logic:** Contain the core application logic for handling requests. Controllers interact with models to fetch or store data and perform any necessary data transformations or business rule enforcement.
-   **Separation from Routing:** By placing business logic in controllers, route files remain lean and focused on request handling.
-   **Location:** Can be within route files for simpler applications or in a dedicated `controllers/` directory for larger projects (e.g., `controllers/authController.js`, `controllers/ticketController.js`).

### Middleware

-   **Request Processing Pipeline:** Functions that have access to the request object (`req`), the response object (`res`), and the `next` function in the application's request-response cycle.
-   **Cross-Cutting Concerns:** Used to handle tasks that are common across multiple routes or endpoints, such as:
    -   **Authentication:** Verifying user identity (e.g., checking JWT tokens).
    -   **Authorization:** Checking if a user has permission to access a resource.
    -   **Logging:** Recording request details.
    -   **Error Handling:** Catching and processing errors.
    -   **Data Validation:** Validating incoming request data.
    -   **Request Body Parsing:** (e.g., `express.json()`, `express.urlencoded()`).
-   **Execution Order:** Middleware functions can be executed sequentially, modifying the request or response objects or terminating the request-response cycle if necessary.
-   **Location:** Often found in a `middleware/` directory (e.g., `middleware/authMiddleware.js`).

## Running the Backend Separately

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

3.  **Environment Variables:**
    Create a `.env` file in the `backend` directory. This file will store sensitive configuration information. Add the following variables, replacing placeholder values with your actual configuration:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/ticketing_system
    JWT_SECRET=your_super_secret_jwt_key
    NODE_ENV=development # or production
    ```
    -   `PORT`: The port on which the backend server will run.
    -   `MONGODB_URI`: The connection string for your MongoDB database.
    -   `JWT_SECRET`: A secret key used for signing and verifying JSON Web Tokens for authentication.
    -   `NODE_ENV`: Set to `development` for development-specific features (like more verbose logging) or `production` when deploying.

4.  **Start the server:**
    ```bash
    npm start
    ```
    This command typically runs the main application file (e.g., `server.js` or `app.js`). The backend server will start, and you should see a confirmation message in the console (e.g., "Server running on port 5000").

## Available Scripts

In the `backend/package.json` file, you will typically find the following scripts (or similar):

-   ### `npm start`
    ```json
    "scripts": {
      "start": "node server.js"
    }
    ```
    Runs the application using Node.js. This is generally used for production or for running the application with its compiled/final build.

-   ### `npm run dev` (or `npm run server`, `npm run watch`)
    ```json
    "scripts": {
      "dev": "nodemon server.js"
    }
    ```
    Runs the application using a tool like `nodemon`. Nodemon monitors your project files for changes and automatically restarts the server when a file is saved. This is highly recommended for development as it speeds up the feedback loop.
    If `nodemon` is not already a project dependency, you can install it:
    ```bash
    npm install nodemon --save-dev
    ```
    Then, add the `dev` script to your `package.json`.

Ensure your `server.js` (or your main application entry point) is correctly configured to listen on the `PORT` specified in your `.env` file and connect to the MongoDB instance using `MONGODB_URI`.
