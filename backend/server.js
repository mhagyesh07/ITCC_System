/**
 * @file server.js
 * @description Main entry point for the backend application.
 * This file initializes the Express server, connects to MongoDB,
 * sets up middleware, and defines routes.
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

/**
 * @section Middleware Setup
 */

/**
 * @description Middleware to parse JSON bodies.
 * @name app.use-bodyParser.json
 */
app.use(bodyParser.json());

/**
 * @description Middleware to enable Cross-Origin Resource Sharing (CORS).
 * @name app.use-cors
 */
app.use(cors());

/**
 * @section MongoDB Connection
 * @description Establishes connection to MongoDB using Mongoose.
 * Exits the process if the connection fails.
 * Note: useNewUrlParser and useUnifiedTopology are deprecated in newer Mongoose versions but kept for compatibility.
 */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Deprecated, but included for older Mongoose compatibility if necessary
    useUnifiedTopology: true, // Deprecated, but included for older Mongoose compatibility if necessary
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit process if DB connection fails
  });

/**
 * @section API Routes
 * @description Defines the base paths for API routes.
 */

/**
 * @description Routes for ticket-related operations.
 * @name app.use-/api/tickets
 * @see {@link ./routes/ticketRoutes}
 */
app.use('/api/tickets', require('./routes/ticketRoutes'));

/**
 * @description Routes for user-related operations.
 * @name app.use-/api/users
 * @see {@link ./routes/userRoutes}
 */
app.use('/api/users', require('./routes/userRoutes'));

/**
 * @section Static File Serving (Production)
 * @description Serves static files from the React frontend build directory
 * when the application is in a production environment.
 */
if (process.env.NODE_ENV === "production") {
  /**
   * @description Serves static files (e.g., CSS, JS, images) from the 'build' directory.
   * @name app.use-express.static
   */
  app.use(express.static(path.join(__dirname, "build")));

  // The following catch-all route is commented out but is common for SPAs:
  // It ensures that any request not handled by other routes serves the index.html,
  // allowing client-side routing to take over.
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "build", "index.html"));
  // });
}

/**
 * @section Server Initialization
 * @description Starts the Express server on the specified port.
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
