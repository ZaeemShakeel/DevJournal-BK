import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

// Load environment variables
dotenv.config();

export const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.send('DevJournal API is running! 🚀');
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 404 handler - FIXED VERSION (removed the problematic '*')
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});