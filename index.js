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

// Vercel demands we EXPORT the express instance (app) instead of binding it to app.listen()
export default app;