# Project Title: Ticketing System

This project is a comprehensive ticketing system designed to streamline customer support and issue tracking. It features a robust backend API built with Node.js and Express, a user-friendly frontend interface developed with React, and a scalable MongoDB database for data storage.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Other:** Mongoose (ODM for MongoDB)

## Features

### Core Functionalities
- **User Authentication:** Secure user registration and login.
- **Ticketing System:** Allows users to create, view, update, and manage support tickets.
- **Admin Panel:** Provides administrators with tools to manage users, tickets, and system settings.
- **Search and Filtering:** Enables users to easily find specific tickets.
- **Real-time Updates:** (Optional) Implement real-time notifications for ticket updates using WebSockets.

### User Roles
- **Regular User:**
    - Can register and log in to the system.
    - Can create new support tickets.
    - Can view and update their own tickets.
    - Can close their own tickets.
- **Admin User:**
    - Has all the capabilities of a regular user.
    - Can view all tickets in the system.
    - Can assign tickets to themselves or other admins.
    - Can update the status of any ticket.
    - Can manage user accounts (e.g., view users, delete users - future enhancement).
    - Can access system settings and administrative dashboards.

### Ticket Management Workflow
1.  **Creation:** A regular user creates a new ticket, providing a title, description, and optionally, priority. The ticket is initially marked as "Open".
2.  **Assignment (Admin):** An admin user can view unassigned "Open" tickets and assign them to themselves or another admin. The ticket status might change to "In Progress".
3.  **Status Updates:**
    *   Users (for their own tickets) or Admins (for any ticket) can add comments or updates.
    *   Admins can change the ticket status (e.g., "Open", "In Progress", "Pending User Response", "Resolved", "Closed").
4.  **Resolution:** Once the issue is resolved, an admin (or the user if they resolved it themselves) can mark the ticket as "Resolved".
5.  **Closure:** Resolved tickets can be formally "Closed". Users can also close their own tickets if the issue is no longer relevant.

## Project Structure

The project is organized into two main directories:

- **`backend/`**: Contains the Node.js/Express.js application, including API routes, controllers, models, and middleware.
- **`frontend/`**: Contains the React application, including components, views, and state management logic.

## Setup and Running the Project

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (running instance)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file in the `backend` directory with the following environment variables:**
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    *Replace `your_mongodb_connection_string` and `your_jwt_secret_key` with your actual MongoDB connection string and a strong secret key for JWT.*
4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend server will typically run on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file in the `frontend` directory (if needed by your React setup, e.g., for API base URL):**
    ```env
    REACT_APP_API_BASE_URL=http://localhost:5000
    ```
4.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The React application will typically open in your browser at `http://localhost:3000`.

## API Documentation

The API allows for managing users and tickets. All API requests should have `Content-Type: application/json`. Authenticated routes require a JWT token passed in the `Authorization` header as `Bearer <token>`.

### Authentication Endpoints

#### `POST /api/auth/register`
- **Description:** Registers a new user.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "username": "testuser",
      "email": "test@example.com",
      "isAdmin": false
    }
  }
  ```
- **Error Responses:**
    - `400 Bad Request`: Missing fields, invalid email, password too short.
    - `409 Conflict`: Email already exists.

#### `POST /api/auth/login`
- **Description:** Logs in an existing user.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "username": "testuser",
      "email": "test@example.com",
      "isAdmin": false
    }
  }
  ```
- **Error Responses:**
    - `400 Bad Request`: Missing fields.
    - `401 Unauthorized`: Invalid credentials.

### Ticket Endpoints

Authentication (`Bearer <token>`) is required for all ticket endpoints.

#### `POST /api/tickets`
- **Description:** Creates a new ticket.
- **Access:** Regular Users, Admins
- **Request Body:**
  ```json
  {
    "title": "Issue with login",
    "description": "I cannot log in to my account.",
    "priority": "High" // Optional, defaults to 'Medium'
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "_id": "ticket_id_here",
    "user": "user_id",
    "title": "Issue with login",
    "description": "I cannot log in to my account.",
    "priority": "High",
    "status": "Open",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```
- **Error Responses:**
    - `400 Bad Request`: Missing title or description.
    - `401 Unauthorized`: Not logged in.

#### `GET /api/tickets`
- **Description:** Gets all tickets. Regular users get their own tickets. Admins get all tickets.
- **Access:** Regular Users (own tickets), Admins (all tickets)
- **Query Parameters (Admin only):**
    - `status=<status>`: Filter by status (e.g., "Open", "In Progress")
    - `priority=<priority>`: Filter by priority (e.g., "High", "Medium", "Low")
    - `assignedTo=<admin_id>`: Filter by assigned admin
    - `user=<user_id>`: Filter by user who created the ticket
- **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "ticket_id_1",
      "user": "user_id",
      "title": "Issue with login",
      "description": "I cannot log in to my account.",
      "priority": "High",
      "status": "Open",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    },
    {
      "_id": "ticket_id_2",
      "user": "another_user_id",
      "title": "Feature request",
      "description": "Please add X feature.",
      "priority": "Medium",
      "status": "In Progress",
      "assignedTo": "admin_id",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```
- **Error Responses:**
    - `401 Unauthorized`: Not logged in.

#### `GET /api/tickets/:id`
- **Description:** Gets a specific ticket by ID. Users can only access their own tickets unless they are an admin.
- **Access:** Regular Users (own ticket), Admins
- **Path Parameters:**
    - `id`: The ID of the ticket.
- **Success Response (200 OK):**
  ```json
  {
    "_id": "ticket_id_here",
    "user": "user_id",
    "title": "Issue with login",
    "description": "I cannot log in to my account.",
    "priority": "High",
    "status": "Open",
    "comments": [
        { "user": "user_id", "text": "Any updates?", "createdAt": "timestamp" },
        { "user": "admin_id", "text": "We are looking into it.", "createdAt": "timestamp" }
    ], // Assuming comments are part of the ticket model
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```
- **Error Responses:**
    - `401 Unauthorized`: Not logged in or not authorized to view the ticket.
    - `404 Not Found`: Ticket not found.

#### `PUT /api/tickets/:id`
- **Description:** Updates a ticket by ID. Regular users can only update their own tickets (e.g., add comments, change priority if allowed, close). Admins can update any ticket (e.g., change status, assign, add comments).
- **Access:** Regular Users (own ticket, limited fields), Admins
- **Path Parameters:**
    - `id`: The ID of the ticket.
- **Request Body (User):**
  ```json
  {
    "description": "Updated description: I still cannot log in.",
    "priority": "Urgent", // If allowed
    "status": "Closed" // If user is closing their own ticket
  }
  ```
- **Request Body (Admin):**
  ```json
  {
    "title": "Login Issue - User Cannot Access Account",
    "description": "User reports inability to log in. Credentials might be compromised.",
    "priority": "High",
    "status": "In Progress",
    "assignedTo": "admin_user_id" // ID of an admin user
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "_id": "ticket_id_here",
    "user": "user_id",
    "title": "Updated Title",
    "description": "Updated description.",
    "priority": "High",
    "status": "In Progress",
    "assignedTo": "admin_user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```
- **Error Responses:**
    - `400 Bad Request`: Invalid data.
    - `401 Unauthorized`: Not logged in or not authorized to update the ticket.
    - `403 Forbidden`: User trying to update fields they are not allowed to.
    - `404 Not Found`: Ticket not found.

#### `DELETE /api/tickets/:id`
- **Description:** Deletes a ticket by ID. (Typically, this might be restricted to Admins or implement soft delete).
- **Access:** Admins (Potentially users for their own tickets if system design allows)
- **Path Parameters:**
    - `id`: The ID of the ticket.
- **Success Response (200 OK):**
  ```json
  {
    "message": "Ticket removed successfully"
  }
  ```
- **Error Responses:**
    - `401 Unauthorized`: Not logged in or not authorized.
    - `403 Forbidden`: User not allowed to delete this ticket.
    - `404 Not Found`: Ticket not found.


## Contributing

We welcome contributions to enhance the Ticketing System! Please follow these guidelines:

### Coding Standards
- **Consistency:** Strive for consistency with the existing codebase in terms of style, formatting, and naming conventions.
- **Comments:** Write clear and concise comments for complex logic or non-obvious code sections.
- **Simplicity:** Keep functions and components focused on a single responsibility.
- **Testing:** (Future Goal) Write unit and integration tests for new features and bug fixes.

### Branch Management
- **`main`:** This branch represents the production-ready code. Direct pushes are discouraged.
- **`develop`:** This branch is for ongoing development and integration of new features. All feature branches should be based off `develop`.
- **Feature Branches:** Create a new branch for each new feature or bugfix.
    - Naming: `feat/<feature-name>` (e.g., `feat/user-profile-page`)
    - Naming: `fix/<bug-name>` (e.g., `fix/login-error-handling`)
- **Hotfix Branches:** For urgent production fixes, branch from `main` (`hotfix/<issue>`) and merge back into `main` and `develop`.

### Pull Request (PR) Guidelines
1.  **Base Branch:** Ensure your PR is set to merge into the `develop` branch (or `main` for hotfixes).
2.  **Title & Description:** Provide a clear and descriptive PR title and a summary of the changes made. Reference any related issue numbers.
3.  **Self-Review:** Review your own code changes before submitting the PR.
4.  **Tests:** (Future Goal) Ensure all existing tests pass and, if applicable, add new tests for your changes.
5.  **Code Review:** At least one other developer should review and approve the PR before merging.
6.  **Keep it Focused:** PRs should ideally address a single feature or bugfix.

## Deployment

This application can be deployed to various platforms that support Node.js backends and React frontends, such as Heroku, AWS, Google Cloud, or self-hosted servers.

### Frontend Deployment (Vercel)
The frontend is configured for easy deployment to Vercel. The `frontend/vercel.json` file contains the necessary configuration.
1. Connect your Git repository to Vercel.
2. Configure the project root in Vercel to point to the `frontend` directory.
3. Vercel will typically auto-detect the React (Create React App) settings and build/deploy the application.

### Backend Deployment
1.  Ensure your server has Node.js and npm installed.
2.  Set up environment variables as described in the "Backend Setup" section (especially `MONGODB_URI`, `JWT_SECRET`, and `PORT`).
3.  Build the frontend if you are serving it via the backend (e.g., `npm run build` in the `frontend` directory, then configure Express to serve static files from the build folder).
4.  Run the backend server using a process manager like PM2 for better reliability: `pm2 start backend/server.js --name ticketing-backend`.

## License

This project is licensed under the MIT License.

**MIT License**

Copyright (c) 2024 The Project Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
*Remember to replace `[Year]` and `[Your Name/Organization]` in the License section.*
