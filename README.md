# Project Title: Ticketing System

This project is a comprehensive ticketing system designed to streamline customer support and issue tracking. It features a robust backend API built with Node.js and Express, a user-friendly frontend interface developed with React, and a scalable MongoDB database for data storage.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Other:** Mongoose (ODM for MongoDB)

## Features

- **User Registration & Login:** Secure account creation and authentication for users.
- **User Profile Management:** Users can view their profile information.
- **Ticket Creation:** Authenticated users can create new support tickets with details like title and description.
- **View User's Tickets:** Users can view a list of tickets they have submitted.
- **View Specific Ticket:** Users can view the detailed information of a specific ticket.
- **Ticket Updates:** Users can update their tickets (Note: current backend routes don't explicitly show a general ticket update by user, mainly close and admin comment. This point might need to be refined or removed if only admins can update).
- **Close Tickets:** Users or Admins can close tickets.

**Admin Functionalities:**
- **Admin Dashboard:** Centralized panel for administrative tasks.
- **View All Tickets:** Admins can view all tickets submitted in the system.
- **Sort and Limit Ticket Display:** Admins can sort and limit the number of tickets displayed.
- **Admin Comments:** Admins can add comments to tickets, visible to relevant parties.
- **Manage Users:** Admins can view all registered users.
- **Reset User Passwords:** Admins have the capability to reset passwords for users.
- **Ticket Filtering:** (Assumed from "Search and Filtering" and admin view of all tickets) Admins can search and filter tickets.

**General:**
- **Role-Based Access Control:** Different functionalities accessible based on user roles (user vs. admin).
- **API Security:** Protected API endpoints using JWT authentication.
- **Scalable Backend:** Built with Node.js, Express, and MongoDB for efficient data handling.
- **User-Friendly Frontend:** Developed with React for a responsive user experience.
- **(Optional) Real-time Updates:** Potential for real-time notifications for ticket updates (e.g., using WebSockets).

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

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the `backend` directory with the following environment variables:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   *Replace `your_mongodb_connection_string` and `your_jwt_secret_key` with your actual MongoDB connection string and a strong secret key for JWT.*

4. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend server will typically run on `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the `frontend` directory (if needed by your React setup, e.g., for API base URL):**
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

4. **Start the frontend development server:**
   ```bash
   npm start
   ```
   The React application will typically open in your browser at `http://localhost:3000`.

## API Documentation

All API endpoints are prefixed with `/api`. For example, user registration is `POST /api/users/`.
Protected routes require a JSON Web Token (JWT) in the `Authorization` header: `Authorization: Bearer <token>`.

### User Authentication & Management (`/api/users`)

-   **`POST /users/` - Register a new user**
    -   **Description:** Creates a new user account. Assumes `userRoutes.js` is mounted at `/api/users`.
    -   **Request Body Example:**
        ```json
        {
          "username": "testuser",
          "email": "test@example.com",
          "password": "password123",
          "employeeNumber": "EMP123",
          "department": "Tech Support"
        }
        ```
        *(Note: Verify all available fields like `username`, `employeeNumber`, `department` from the `User.js` model.)*
    -   **Response (201 Created):**
        ```json
        {
          "message": "User created successfully",
          "token": "jwt_token_here"
        }
        ```
    -   **Error Responses:**
        -   `400 Bad Request`: If email or employee number already exists, or validation fails.
        -   `500 Internal Server Error`: If an error occurs during account creation.

-   **`POST /users/login` - Login an existing user**
    -   **Description:** Authenticates a user and returns a JWT. Assumes `userRoutes.js` is mounted at `/api/users`.
    -   **Request Body:**
        ```json
        {
          "email": "test@example.com",
          "password": "password123"
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Login successful",
          "token": "jwt_token_here",
          "role": "user"
        }
        ```
    -   **Error Responses:**
        -   `400 Bad Request`: Invalid email or password.
        -   `404 Not Found`: No account found with the email.
        -   `500 Internal Server Error`: If an error occurs during login.

-   **`GET /users/profile` - Get user profile**
    -   **Description:** Retrieves the profile of the currently authenticated user. Assumes `userRoutes.js` is mounted at `/api/users`.
    -   **Headers:** `Authorization: Bearer <token>` (Protected)
    -   **Response (200 OK):**
        ```json
        {
          "_id": "user_id",
          "username": "testuser",
          "email": "test@example.com",
          "employeeNumber": "EMP123",
          "department": "Tech Support",
          "role": "user"
        }
        ```
        *(Password field is excluded)*
    -   **Error Responses:**
        -   `401 Unauthorized`: If token is missing or invalid.
        -   `404 Not Found`: User not found.
        -   `500 Internal Server Error`: Failed to fetch profile.

-   **`GET /users/` - Get all users**
    -   **Description:** Retrieves a list of all users. Assumes `userRoutes.js` is mounted at `/api/users`.
    -   **Headers:** `Authorization: Bearer <token>` (Protected by `protect` middleware - any authenticated user can access)
    -   **Response (200 OK):**
        ```json
        [
          {
            "_id": "user_id1",
            "username": "adminuser",
            "email": "admin@example.com",
            "role": "admin"
          },
          {
            "_id": "user_id2",
            "username": "testuser",
            "email": "test@example.com",
            "role": "user"
          }
        ]
        ```
        *(Password field is excluded)*
    -   **Error Responses:**
        -   `401 Unauthorized`: If token is missing or invalid.
        -   `500 Internal Server Error`: If an error occurs.

-   **`POST /users/admin/reset-password` - Reset Employee Password (Admin)**
    -   **Description:** Allows an administrator to reset the password for an employee. Assumes `userRoutes.js` is mounted at `/api/users`.
    -   **Headers:** `Authorization: Bearer <token>` (Protected by `protect` middleware. Should ideally be `protectAdmin`)
    -   **Request Body:**
        ```json
        {
          "email": "employee@example.com",
          "newPassword": "newSecurePassword123"
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Password reset successfully."
        }
        ```
    -   **Error Responses:**
        -   `401 Unauthorized`: If not an admin (if logic inside route checks role) or token invalid.
        -   `404 Not Found`: Employee not found.
        -   `500 Internal Server Error`: If an error occurs.

### Ticket Management (`/api/tickets`)

All routes in this section require authentication (`Authorization: Bearer <token>`). Assumes `ticketRoutes.js` is mounted at `/api/tickets`.

-   **`POST /` - Create a new ticket**
    -   **Description:** Allows an authenticated user to create a new support ticket. The backend route `POST /` in `ticketRoutes.js` uses `new Ticket(req.body)`, so `employeeId` should be part of the body if not handled by `protect` middleware to inject user details.
    -   **Request Body Example:**
        ```json
        {
          "title": "Login Issue",
          "description": "Cannot log in to the portal.",
          "employeeId": "user_id_of_ticket_creator",
          "priority": "High",
          "category": "Technical"
        }
        ```
        *(Note: Verify all available fields like `priority`, `category` from the `Ticket.js` model. `employeeId` might be automatically assigned from `req.user` in a controller, which is best practice.)*
    -   **Response (201 Created):**
        ```json
        {
          "_id": "ticket_id",
          "title": "Login Issue",
          "description": "Cannot log in to the portal.",
          "employeeId": "user_id",
          "status": "Open"
        }
        ```
    -   **Error Responses:**
        -   `400 Bad Request`: If validation fails.
        -   `401 Unauthorized`.

-   **`GET /` - Get all tickets**
    -   **Description:** Retrieves all tickets. The current route implementation in `ticketRoutes.js` does not filter by user, so any authenticated user will receive all tickets.
    -   **Headers:** `Authorization: Bearer <token>` (Protected by `protect` middleware)
    -   **Query Parameters (Optional):**
        -   `limit=<number>`: Number of tickets to return.
        -   `sort=<field>:<asc|desc>`: Sort tickets (e.g., `createdAt:desc`).
    -   **Response (200 OK):**
        ```json
        [
          {
            "_id": "ticket_id1",
            "title": "Issue A",
            "employeeId": { "_id": "user_id", "username": "testuser", "department": "Sales" }
          }
        ]
        ```
    -   **Error Responses:**
        -   `401 Unauthorized`.
        -   `500 Internal Server Error`.

-   **`GET /:id` - Get a specific ticket by ID**
    -   **Description:** Retrieves detailed information for a specific ticket.
    -   **Headers:** `Authorization: Bearer <token>` (Protected by `protect` middleware)
    -   **Response (200 OK):**
        ```json
        {
          "_id": "ticket_id",
          "title": "Login Issue",
          "employeeId": {
             "_id": "user_id",
             "username": "testuser",
             "department": "Tech Support"
           },
          "status": "Open",
          "adminComment": "Looking into this."
        }
        ```
    -   **Error Responses:**
        -   `401 Unauthorized`.
        -   `404 Not Found`: Ticket not found.
        -   `500 Internal Server Error`.

-   **`PUT /:id/comment` - Add/Update admin comment on a ticket**
    -   **Description:** Allows an authenticated user to add or update a comment on a ticket. The route is protected by `protect`, not `protectAdmin`, meaning any authenticated user can comment on any ticket if they know its ID.
    -   **Headers:** `Authorization: Bearer <token>` (Protected by `protect` middleware)
    -   **Request Body:**
        ```json
        {
          "adminComment": "The issue has been resolved by resetting the service."
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Admin comment updated successfully",
          "ticket": {
            "_id": "ticket_id",
            "adminComment": "The issue has been resolved by resetting the service."
          }
        }
        ```
    -   **Error Responses:**
        -   `401 Unauthorized`.
        -   `404 Not Found`: Ticket not found.
        -   `500 Internal Server Error`.

-   **`PUT /:id/close` - Close a ticket**
    -   **Description:** Marks a ticket status as 'Closed'. Protected by `protect` middleware.
    -   **Headers:** `Authorization: Bearer <token>` (Protected by `protect` middleware)
    -   **Response (200 OK):**
        ```json
        {
          "message": "Ticket closed successfully",
          "ticket": {
            "_id": "ticket_id",
            "status": "Closed"
          }
        }
        ```
    -   **Error Responses:**
        -   `401 Unauthorized`.
        -   `404 Not Found`: Ticket not found.
        -   `500 Internal Server Error`.

-   **`GET /admin-only` - Get all tickets (Admin Specific)**
    -   **Description:** Retrieves all tickets in the system. Specifically for admin users.
    -   **Headers:** `Authorization: Bearer <token>` (Protected by `protectAdmin` middleware)
    -   **Response (200 OK):** (Array of all ticket objects)
        ```json
        [
          {
            "_id": "ticket_id1",
            "title": "Issue A"
          }
        ]
        ```
    -   **Error Responses:**
        -   `401 Unauthorized` (If not admin or invalid token).
        -   `500 Internal Server Error`.

-   **`GET /employee/:id` - Get tickets for a specific employee**
    -   **Description:** Retrieves all tickets associated with a specific employee ID.
    -   **Headers:** `Authorization: Bearer <token>` (Protected by `protect` middleware)
    -   **Response (200 OK):**
        ```json
        [
          {
            "_id": "ticket_id1",
            "title": "Employee Specific Issue",
            "employeeId": "employee_user_id"
          }
        ]
        ```
    -   **Error Responses:**
        -   `401 Unauthorized`.
        -   `404 Not Found`: No tickets found for the employee.
        -   `500 Internal Server Error`.

*(Note: The previous README mentioned a `DELETE /api/tickets/:id` endpoint. This route does not appear to exist in the current `backend/routes/ticketRoutes.js` and has been omitted from this documentation.)*
