import { app } from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000;

/* 
// ==========================================
// ⬇️ LOCAL DEVELOPMENT SERVER CONFIGURATION ⬇️
// (Commented out for Vercel Serverless Deployment)
// (Uncomment this section if you need to run 'npm start' on your PC locally again)
// ==========================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server only after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
  });
});
*/

// ==========================================
// ⬇️ VERCEL SERVERLESS CONFIGURATION ⬇️
// ==========================================

// Global variable to cache the DB connection across Vercel function invocations
let isConnected = false;

const connectDBForVercel = async () => {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Fails fast in 5 seconds instead of 10s
    });
    isConnected = db.connections[0].readyState === 1; // 1 means connected
    console.log(`✅ MongoDB Connected (New Instance on Vercel)`);
  } catch (error) {
    console.error(`❌ DB Error: ${error.message}`);
    throw error; // Rethrow to let the middleware handle it
  }
};

// Use Express middleware to guarantee DB is connected BEFORE processing any API request
app.use(async (req, res, next) => {
  try {
    await connectDBForVercel();
    next();
  } catch (error) {
    // This stops the request and returns the actual reason the DB failed
    return res.status(500).json({
      success: false,
      message: 'Database connection failed.',
      error: error.message
    });
  }
});

// Vercel demands we EXPORT the express instance (app) instead of binding it to app.listen()
export default app;