# investogold Full-Stack Application

A comprehensive Next.js + Node.js application for a cryptocurrency trading platform with referral-based subscription system, using MySQL database with Sequelize ORM.

## 🚀 Architecture

This is a **unified full-stack application** that combines:
- **Frontend**: Next.js 15 with React 19 (Server-Side Rendered)
- **Backend**: Express.js API server 
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based authentication system
- **Deployment**: PM2 cluster mode with automated CI/CD

## Features

- **User Authentication**: Registration, login, JWT tokens, password reset with OTP
- **Referral System**: 15-level multi-level marketing structure with commission distribution
- **Portfolio Management**: Investment plans with different tiers (Basic, Premium, Elite)
- **Deposit System**: Manual deposit approval with file upload for payment proofs
- **Withdrawal System**: Admin-approved withdrawal requests with multiple payment methods
- **Rank Management**: Automatic rank assignment based on deposits and referrals
- **Admin Dashboard**: Complete admin panel for managing users, deposits, withdrawals
- **Bot Management**: Automated trading bot activation and earnings simulation
- **Transaction History**: Comprehensive transaction logging and reporting
- **Security**: Rate limiting, input validation, secure headers, logging
- **Real-time Price Data**: Live cryptocurrency prices with caching and rate limiting

## 🚀 CI/CD Deployment

This project includes **GitHub Actions** for automated deployment to VPS servers:

- **Automatic Deployment**: Deploy on push to main branch
- **Environment Support**: Production, staging, and development environments
- **Health Checks**: Automated application health verification
- **Rollback Support**: One-click rollback to previous versions
- **Zero Downtime**: PM2 cluster mode with graceful reloads

[📖 **Setup GitHub Actions Deployment**](./GITHUB_ACTIONS_SETUP.md)

## Features

- **User Authentication**: Registration, login, JWT tokens, password reset
- **Referral System**: 15-level multi-level marketing structure with commission distribution
- **Portfolio Management**: Investment plans with different tiers (Basic, Premium, Elite)
- **Deposit System**: Manual deposit approval with file upload for payment proofs
- **Withdrawal System**: Admin-approved withdrawal requests with multiple payment methods
- **Rank Management**: Automatic rank assignment based on deposits and referrals
- **Admin Dashboard**: Complete admin panel for managing users, deposits, withdrawals
- **Bot Management**: Automated trading bot activation and earnings simulation
- **Transaction History**: Comprehensive transaction logging and reporting
- **Security**: Rate limiting, input validation, secure headers, logging
- **Automated Deployment**: GitHub Actions CI/CD pipeline

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator, Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Email**: Nodemailer with Gmail SMTP
- **Process Management**: PM2 Cluster Mode
- **UI Components**: Heroicons, Lucide React, Framer Motion
- **Styling**: Tailwind CSS with custom animations

## Directory Structure

```
investogold/
├── src/                 # Next.js frontend application
│   ├── app/            # Next.js 13+ app router pages
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries and services
│   └── utils/          # Utility functions
├── api/                # Express.js API routes (organized)
├── models/             # Sequelize database models
├── migrations/         # Database migration files
├── middleware/         # Express middleware
├── scripts/            # Database setup & deployment scripts
├── docs/               # Documentation files
├── utils/              # Backend utility functions
├── config/             # Configuration files
├── uploads/            # File upload directory
├── logs/               # Application logs
├── public/             # Static assets
└── server.js           # Main application server
```

📖 **For detailed directory structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager
- PM2 (for production deployment)

### 2. Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pydart-Intelli-Corp/btcbot_node.git
   cd btcbot_node
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your .env file:**
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   HOST=localhost

   # Database Configuration
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=btcbot_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d

   # Admin Configuration
   ADMIN_EMAIL=admin@investogold.com
   ADMIN_PASSWORD=AdminPassword123!
   ADMIN_FIRST_NAME=Admin
   ADMIN_LAST_NAME=User

   # Email Configuration (Gmail SMTP)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com

   # Frontend URL
   FRONTEND_URL=http://localhost:5000
   ```

### 3. Database Setup

1. **Create MySQL database:**
   ```bash
   npm run create-db
   ```

2. **Run migrations:**
   ```bash
   npm run migrate
   ```

3. **Or do both with setup script:**
   ```bash
   npm run setup
   ```

### 4. Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The application will start on `http://localhost:5000` with both frontend and backend served from the same port.

### 5. Access Points

- **Homepage**: `http://localhost:5000`
- **Admin Panel**: `http://localhost:5000/adminpanel`
- **API Health**: `http://localhost:5000/health`
- **API Documentation**: `http://localhost:5000/api`

## Models Overview

### User Model
- Basic user information (email, password, name, phone)
- Wallet information (address, QR code)
- Referral system (referral code, referrer, level)
- Financial data (balance, deposits, withdrawals, earnings)
- Rank system (Bronze, Silver, Gold, Platinum, Diamond)
- Bot settings and subscription status

### Portfolio Model
- Investment plans (Basic, Premium, Elite packages)
- Pricing and duration information
- Daily ROI and return limits
- Features and benefits
- Bot configuration
- Subscription management

### Transaction Model
- All financial transactions (deposits, withdrawals, commissions)
- Payment proofs and verification
- Status tracking and approval workflow
- Commission distribution tracking
- Bot earnings recording

### Affiliate Model
- Referral tracking and statistics
- 15-level commission structure
- Team performance metrics
- Marketing tools and resources
- Tier management (Bronze, Silver, Gold, Diamond)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for API endpoints
- Input validation and sanitization
- Secure HTTP headers with Helmet
- CORS configuration
- Request logging and monitoring
- Account lockout after failed attempts
- IP-based security tracking

## Commission Structure

Default 15-level commission rates:
- Level 1: 5.0%
- Levels 2-5: 2.0%
- Levels 6-10: 1.0%
- Levels 11-15: 0.5%

## Rank System

Automatic rank assignment based on total deposits:
- **Bronze**: $0 - $999
- **Silver**: $1,000 - $4,999
- **Gold**: $5,000 - $24,999
- **Platinum**: $25,000 - $99,999
- **Diamond**: $100,000+

## Next Steps

1. **Implement remaining route handlers** for user, portfolio, transaction, affiliate, and admin modules
2. **Set up email service** for notifications and password reset
3. **Implement file upload handling** for payment proofs
4. **Add more comprehensive validation** and error handling
5. **Set up automated testing** with Jest and Supertest
6. **Configure production deployment** with PM2 or Docker
7. **Add API documentation** with Swagger/OpenAPI
8. **Implement real-time features** with Socket.io if needed

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Build for production
npm run build:prod

# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### GitHub Actions (Recommended)

Automated deployment with CI/CD pipeline:

```bash
# Setup GitHub Actions (one-time setup)
# See GITHUB_ACTIONS_SETUP.md for detailed instructions

# Deploy by pushing to main branch
git push origin main

# Manual deployment trigger
# Go to GitHub → Actions → Run workflow
```

### Manual Deployment

```bash
# Initial server setup
npm run setup:prod

# Deploy application
npm run deploy

# Update existing deployment
npm run redeploy

# PM2 process management
npm run pm2:start    # Start processes
npm run pm2:restart  # Restart processes  
npm run pm2:stop     # Stop processes
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your production settings

# Key variables for production:
NODE_ENV=production
DB_HOST=127.0.0.1
DB_NAME=btcbot_db
DB_USER=btcbot
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

## 📚 Documentation

- [🚀 GitHub Actions Setup Guide](./GITHUB_ACTIONS_SETUP.md) - Complete CI/CD setup
- [📋 Deployment Guide](./DEPLOYMENT.md) - Manual deployment instructions
- [📝 Changes Summary](./CHANGES_SUMMARY.md) - All changes made for production

## Support

For support and questions:
- Email: support@investogold.com
- Documentation: https://docs.investogold.com (when available)

## License

MIT License - see LICENSE file for details.