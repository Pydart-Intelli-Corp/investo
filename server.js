const express = require('express');
const next = require('next');
const { sequelize } = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: __dirname });
const handle = nextApp.getRequestHandler();

// Import middleware and utilities
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./api/auth');
const userAuthRoutes = require('./api/userAuth');
const adminAuthRoutes = require('./api/adminAuth');
const userRoutes = require('./api/user');
const portfolioRoutes = require('./api/portfolio');
const transactionRoutes = require('./api/transaction');
const affiliateRoutes = require('./api/affiliate');
const adminRoutes = require('./api/admin');
const adminReferralRoutes = require('./api/adminReferrals');
const adminWalletRoutes = require('./api/adminWallets');
const adminPaymentsRoutes = require('./api/adminPayments');
const paymentsRoutes = require('./api/payments');

// Database connection
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    
    logger.logSystemEvent('DATABASE_CONNECTED', {
      host: sequelize.config.host,
      database: sequelize.config.database,
      port: sequelize.config.port,
      dialect: sequelize.getDialect()
    });

    console.log(`MySQL Connected: ${sequelize.config.host}:${sequelize.config.port}/${sequelize.config.database}`);
  } catch (error) {
    logger.logError(error, { context: 'Database Connection' });
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Start server function
const startServer = async () => {
  try {
    // Prepare Next.js
    await nextApp.prepare();
    console.log('✅ Next.js prepared successfully');
    
    // Connect to database
    await connectDatabase();
    
    // Create Express app
    const app = express();

    // Trust proxy for accurate IP addresses (important for rate limiting)
    app.set('trust proxy', 1);

    // CORS configuration - Allow all origins for external access
    const corsOptions = {
      origin: function (origin, callback) {
        const allowedOrigins = [
          process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 5000}`,
          `http://localhost:${process.env.PORT || 5000}`,
          'http://localhost:3000',
          'http://localhost:3001',
          'http://72.61.144.187',
          `http://72.61.144.187:${process.env.PORT || 5000}`,
          'https://investogold.com',
          'https://www.investogold.com'
        ];
        
        // Allow requests with no origin (same-origin requests, mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          // Allow all origins in production for deployment (can be restricted later)
          console.log('CORS: Allowing origin:', origin);
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      optionsSuccessStatus: 200
    };

    // Apply CORS middleware
    app.use(cors(corsOptions));

    // Security middleware - Completely disabled for Next.js SSR compatibility
    // NOTE: Helmet security policies cause white screen issues with Next.js
    // The CSP, COEP, COOP, and CORP policies block Next.js resources
    // For production, implement security at the Nginx level instead
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      dnsPrefetchControl: false,
      frameguard: false,
      hidePoweredBy: false,
      hsts: false,
      ieNoOpen: false,
      noSniff: false,
      originAgentCluster: false,
      permittedCrossDomainPolicies: false,
      referrerPolicy: false,
      xssFilter: false
    }));

    // Rate limiting
    const generalLimiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        error: {
          message: 'Too many requests from this IP, please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logger.logSecurityEvent(
          'RATE_LIMIT_EXCEEDED',
          'IP exceeded rate limit',
          req.user?.id || null,
          req.ip,
          req.get('User-Agent')
        );
        res.status(429).json({
          success: false,
          error: {
            message: 'Too many requests from this IP, please try again later.',
            code: 'RATE_LIMIT_EXCEEDED'
          }
        });
      }
    });

    // Apply rate limiting to API routes only
    app.use('/api', generalLimiter);

    // Stricter rate limiting for auth routes
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // limit each IP to 10 auth requests per windowMs
      skipSuccessfulRequests: true,
      message: {
        success: false,
        error: {
          message: 'Too many authentication attempts, please try again later.',
          code: 'AUTH_RATE_LIMIT_EXCEEDED'
        }
      }
    });

    // HTTP request logging
    app.use(morgan('combined', { stream: logger.stream }));

    // Body parsing middleware
    app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        req.rawBody = buf;
      }
    }));
    app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));



    // Serve static files (uploaded files)
    app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

    // Request logging middleware for API routes only
    app.use('/api', (req, res, next) => {
      logger.http(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id
      });
      next();
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        frontend: 'Next.js SSR',
        backend: 'Express.js'
      });
    });

    // API routes
    app.use('/api/auth', authLimiter, authRoutes);
    app.use('/api/user/auth', authLimiter, userAuthRoutes);
    app.use('/api/admin/auth', authLimiter, adminAuthRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/portfolios', portfolioRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/affiliate', affiliateRoutes);
  // Mount admin wallets before the general /api/admin router so
  // the public wallets endpoint (GET /api/admin/wallets/public)
  // is not intercepted by the admin router's global `protect` middleware.
  app.use('/api/admin/wallets', adminWalletRoutes);
  app.use('/api/admin/payments', adminPaymentsRoutes);
  app.use('/api/admin/referrals', adminReferralRoutes);
  app.use('/api/admin', adminRoutes);
    app.use('/api/payments', paymentsRoutes);

    // API documentation endpoint (basic)
    app.get('/api', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Investogold API Server with Next.js SSR',
        version: '1.0.0',
        endpoints: {
          authentication: '/api/auth',
          user: '/api/user',
          portfolios: '/api/portfolios',
          transactions: '/api/transactions',
          affiliate: '/api/affiliate',
          admin: '/api/admin'
        },
        documentation: 'https://docs.investogold.com',
        support: 'support@investogold.com',
        frontend: 'Server-Side Rendered with Next.js'
      });
    });

    // Handle Next.js pages - This must be AFTER API routes
    app.all('*', (req, res) => {
      return handle(req, res);
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || 'localhost';

    const server = app.listen(PORT, HOST, () => {
      logger.logSystemEvent('SERVER_STARTED', {
        port: PORT,
        host: HOST,
        environment: process.env.NODE_ENV || 'development'
      });
      
      console.log(`
🚀 Investogold Full-Stack Server Started Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server: http://${HOST}:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 API Docs: http://${HOST}:${PORT}/api
🏥 Health Check: http://${HOST}:${PORT}/health
🎨 Frontend: Server-Side Rendered with Next.js
🔗 Single Port: Frontend & Backend Combined
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.logError(error, { context: 'Server Error' });
      console.error('Server error:', error.message);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.logSystemEvent('SERVER_SHUTDOWN', { reason: 'SIGTERM' });
      console.log('SIGTERM received. Shutting down gracefully...');
      try {
        await sequelize.close();
        console.log('Database connection closed.');
        process.exit(0);
      } catch (error) {
        console.error('Error closing database connection:', error);
        process.exit(1);
      }
    });

    process.on('SIGINT', async () => {
      logger.logSystemEvent('SERVER_SHUTDOWN', { reason: 'SIGINT' });
      console.log('SIGINT received. Shutting down gracefully...');
      try {
        await sequelize.close();
        console.log('Database connection closed.');
        process.exit(0);
      } catch (error) {
        console.error('Error closing database connection:', error);
        process.exit(1);  
      }
    });

    return app;
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { startServer };