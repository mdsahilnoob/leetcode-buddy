import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { config } from "./config/config.route.js";
import { setupPassport } from "./auth/passport.route.js";
import authRoutes from "./routes/auth.route.js";
import leetcodeRoutes from "./routes/leetcode.route.js";
import profileRoutes from "./routes/profile.route.js";
import historyRoutes from "./routes/history.route.js";
import chartRoutes from "./routes/chart.route.js";

const app = express();

const allowedOrigins = config.nodeEnv === 'production'
  ? ['chrome-extension://', 'https://']
  : ['http://localhost:3000', 'http://localhost:5173', 'chrome-extension://*'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (config.nodeEnv === 'development') {
      return callback(null, true);
    }
    
    // In production, allow chrome-extension:// and https:// origins
    if (origin.startsWith('chrome-extension://') || origin.startsWith('https://')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
setupPassport();

// Routes
app.use('/auth', authRoutes);
app.use('/api', leetcodeRoutes);
app.use('/api', profileRoutes);
app.use('/api', historyRoutes);
app.use('/api', chartRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'LeetCode Buddy API',
    version: '1.0.0',
    endpoints: {
      auth: {
        google: '/auth/google',
        user: '/auth/user (protected)',
        logout: '/auth/logout',
        health: '/auth/health',
        profile: '/api/profile/:username',
        chartData: '/api/chart-data?user1=x&user2=y',
        history: '/api/history (protected)',
        saveHistory: 'POST /api/history (protected)',
        deleteHistory: 'DELETE /api/history/:id (protected)',
        clearHistory: 'DELETE /api/history (protected)',
      },
      api: {
        compare: '/api/compare (protected)',
      },
    },
  });
});

// Export for Vercel serverless
export default app;

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(config.port, () => {
    console.log(`LeetCode Buddy API running on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Google OAuth: ${config.googleClientId ? 'Configured' : 'Not configured'}`);
  });
}
