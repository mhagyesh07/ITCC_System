const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: false
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process if DB connection fails
  });

// Routes
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve static files from the frontend build directory (React)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));

  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "build", "index.html"));
  // });
}


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
