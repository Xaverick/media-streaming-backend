const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const historyRoutes = require('./routes/historyRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const watchProgressRoutes = require('./routes/watchProgressRoutes');
const ExpressError = require('./utils/ExpressError');
const { specs, swaggerUi } = require('./config/swagger');
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Database Connection
const DB_URL = process.env.MONGO_URI;
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/history', historyRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/progress", watchProgressRoutes);

// 404 Error Handling
app.all("*", (req, res, next) => {
  next(new ExpressError('page not found', 404));
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  console.log(err);
  res.status(statusCode).json(err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
