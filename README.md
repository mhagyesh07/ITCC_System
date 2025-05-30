# Project Title: Ticketing System

This project is a comprehensive ticketing system designed to streamline customer support and issue tracking. It features a robust backend API built with Node.js and Express, a user-friendly frontend interface developed with React, and a scalable MongoDB database for data storage.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Other:** Mongoose (ODM for MongoDB), pnpm (Package Manager)

## Features

- **Ticketing System:** Allows users to create, view, update, and close support tickets.
- **User Authentication:** Secure user registration and login functionality.
- **Admin Panel:** Provides administrators with tools to manage users, tickets, and system settings.
- **Real-time Updates:** (Optional) Implement real-time notifications for ticket updates using WebSockets.
- **Search and Filtering:** Enables users to easily find specific tickets based on various criteria.

## Project Structure

The project is organized into two main directories:

- **`backend/`**: Contains the Node.js/Express.js application, including API routes (in `routes/`), data models (in `models/`), and middleware (in `middleware/`).
- **`frontend/`**: Contains the React application, including components (in `src/components/`), state management logic (primarily in `src/redux/`), and pages/views (in `src/pages/`).

## Setup and Running the Project

### Prerequisites

- Node.js (v14 or higher)
- pnpm (Node Package Manager) - *This project uses pnpm.*
- MongoDB (running instance)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies using pnpm:**
    ```bash
    pnpm install
    ```

3.  **Create a `.env` file in the `backend` directory with the following environment variables:**
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/ticketing_system
    JWT_SECRET=your_super_secret_jwt_key_for_signing_tokens
    NODE_ENV=development # set to 'production' for deployment
    ```
    *Replace placeholder values with your actual configuration. `JWT_SECRET` should be a long, random string.*
    *Refer to `backend/README.md` for more details on environment variables if needed.*

4.  **Start the backend server (development mode):**
    ```bash
    pnpm run dev
    ```
    **Start the backend server (production mode):**
    ```bash
    pnpm start
    ```
    The backend server will typically run on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies using pnpm:**
    ```bash
    pnpm install
    ```
3.  **Start the frontend development server:**
    ```bash
    pnpm start
    ```
    The React application will typically open in your browser at `http://localhost:3000`.

## API Documentation (Preliminary)

The backend API endpoints are defined in `backend/routes/`. This section provides a summary. (Assumes API routes are mounted under `/api`, e.g., user routes at `/api/users`, ticket routes at `/api/tickets`).

### Authentication (User Routes - likely mounted at `/api/users`)

-   **`POST /api/users/` (Register/Signup):** Register a new user.
    -   **Request Body:** `{ "username": "testuser", "email": "test@example.com", "employeeNumber": "EMP123", "password": "password123", "role": "employee" }` (role is optional, defaults might apply)
    -   **Response (Success):** `{ "message": "User created successfully", "token": "jwt_token" }`
    -   **Response (Error):** `{ "error": "Email or employee number already exists." }` or other error messages.
-   **`POST /api/users/login`**: Login an existing user.
    -   **Request Body:** `{ "email": "test@example.com", "password": "password123" }`
    -   **Response (Success):** `{ "message": "Login successful", "token": "jwt_token", "role": "user_role" }`
    -   **Response (Error):** `{ "error": "No account found with this email." }` or `{ "error": "Invalid email or password." }`

### Tickets (Ticket Routes - likely mounted at `/api/tickets`)
*All ticket routes typically require authentication (JWT Bearer Token in Authorization header).*

-   **`POST /api/tickets/`**: Create a new ticket.
    -   **Request Body:** `{ "title": "Issue with login", "description": "I cannot log in to my account.", "priority": "High", ... }` (other fields as per `Ticket` model)
    -   **Response (Success):** `{ "_id": "ticket_id", ...ticketDetails }`
-   **`GET /api/tickets/`**: Get tickets. Behavior might differ based on user role (admin vs. user's own tickets). Supports query params like `limit` and `sort`.
-   **`GET /api/tickets/:id`**: Get a specific ticket by ID.
-   **`PUT /api/tickets/:id/comment`**: Add/Update an admin comment on a ticket.
-   **`PUT /api/tickets/:id/close`**: Close a ticket (changes status to 'Closed').
-   **Note:** The `DELETE /api/tickets/:id` endpoint, previously mentioned, is not currently implemented in `backend/routes/ticketRoutes.js`.

*(This API documentation is based on current route files and may evolve. Refer to the source code in `backend/routes/` for the most accurate details.)*

## Deployment

The frontend is configured for deployment using Vercel. A `frontend/vercel.json` file exists which may contain specific deployment settings.

**General Vercel Deployment Steps (refer to Vercel documentation for details):**

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Sign up or log in to [Vercel](https://vercel.com/).
3.  Import your Git repository.
4.  Configure the project settings:
    *   **Framework Preset:** Select "Create React App" or "Vite" or your specific React setup. Vercel often auto-detects this.
    *   **Build Command:** Typically `pnpm run build` (ensure this is set in Vercel if it defaults to `npm`).
    *   **Output Directory:** Usually `frontend/build`.
    *   **Install Command:** `pnpm install` (ensure this is set in Vercel).
    *   **Environment Variables:** Add any necessary environment variables like `REACT_APP_API_BASE_URL` to Vercel's project settings.
5.  Deploy.

The backend can be deployed to various platforms like Heroku, AWS, Google Cloud, or any Node.js hosting provider.

## Testing Strategy (Placeholder)

Information about the testing strategy, frameworks used (e.g., Jest, React Testing Library, Cypress), and detailed instructions on how to run tests will be added here.

Currently, you can run frontend tests (if configured) using:
```bash
cd frontend
pnpm test
```

## Contribution Guidelines (Placeholder)

This project currently does not have formal contribution guidelines. If you wish to contribute, please open an issue first to discuss the proposed changes.

Key areas for future contributions might include:
-   Expanding API features.
-   Improving UI/UX.
-   Adding more comprehensive tests.
-   Setting up CI/CD pipelines.

## License (Placeholder)

This project is currently unlicensed. A suitable open-source license (e.g., MIT, Apache 2.0) will be added soon.
Make sure to add a `LICENSE` file to the repository root when a license is chosen.

---

*This README is a living document and will be updated as the project evolves.*
