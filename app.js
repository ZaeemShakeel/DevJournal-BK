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

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color =
      status >= 500 ? '\x1b[31m' :   // red   – server error
      status >= 400 ? '\x1b[33m' :   // yellow – client error
      status >= 200 ? '\x1b[32m' :   // green  – success
      '\x1b[0m';

    console.log(
      `${color}[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${status} (${duration}ms)\x1b[0m`
    );

    if (status >= 400) {
      console.error(`  ↳ Error: ${body?.message || JSON.stringify(body)}`);
    }

    return originalJson(body);
  };

  next();
});
// ──────────────────────────────────────────────────────────────────────────────


// Test route
app.get('/', (req, res) => {
  res.send('DevJournal API is running! 🚀');
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 404 handler
app.use((req, res, next) => {
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