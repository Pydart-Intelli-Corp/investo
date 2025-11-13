# investogold Project Structure

## 📁 Directory Organization

```
investogold/
├── 📁 api/                    # Backend API routes
│   ├── admin.js               # Admin management endpoints
│   ├── adminAuth.js           # Admin authentication
│   ├── adminDeposits.js       # Admin deposit management
│   ├── adminReferrals.js      # Admin referral management  
│   ├── adminWallets.js        # Admin wallet configuration
│   ├── affiliate.js           # Affiliate/referral system
│   ├── auth.js                # User authentication
│   ├── crypto.js              # Cryptocurrency data
│   ├── deposit.js             # Deposit management
│   ├── portfolio.js           # Investment portfolios
│   ├── transaction.js         # Transaction handling
│   ├── user.js                # User management
│   ├── userAuth.js            # User authentication helpers
│   └── ...
├── 📁 config/                 # Configuration files
│   ├── config.js              # Database configuration
│   └── database.js            # Database connection
├── 📁 docs/                   # Documentation
│   ├── DEPLOYMENT.md          # Deployment instructions
│   ├── GITHUB_ACTIONS_SETUP.md # CI/CD setup guide
│   ├── NGINX_SETUP.md         # Nginx configuration
│   └── VPS_DEPLOYMENT_SETUP.md # VPS deployment guide
├── 📁 middleware/             # Express middleware
│   ├── auth.js                # Authentication middleware
│   ├── errorHandler.js        # Error handling
│   └── validation.js          # Input validation
├── 📁 migrations/             # Database migrations
│   ├── 20240101000001-create-users-table.js
│   ├── 20240101000002-create-portfolios-table.js
│   └── ...
├── 📁 models/                 # Database models (Sequelize)
│   ├── AdminWallet.js         # Admin wallet model
│   ├── Affiliate.js           # Affiliate model
│   ├── Portfolio.js           # Portfolio model
│   ├── Transaction.js         # Transaction model
│   ├── User.js                # User model
│   └── index.js               # Model associations
├── 📁 scripts/                # Deployment & database scripts
│   ├── create-database.js     # Database creation
│   ├── deploy.sh              # Deployment script
│   ├── manual-deploy.sh       # Manual deployment
│   ├── migrate.js             # Migration runner
│   ├── restart-server.sh      # Server restart
│   ├── seed-portfolios.js     # Portfolio seeding
│   └── vps-fix.sh             # VPS fixes
├── 📁 src/                    # Next.js frontend
│   ├── 📁 app/                # Next.js 13+ app router
│   │   ├── adminpanel/        # Admin panel pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── deposit/           # Deposit pages
│   │   ├── forgot-password/   # Password reset
│   │   ├── login/             # Login page
│   │   ├── plans/             # Investment plans
│   │   ├── privacy-policy/    # Legal pages
│   │   ├── profile/           # User profile
│   │   ├── register/          # Registration
│   │   ├── reset-password/    # Password reset
│   │   ├── terms-and-conditions/ # Legal pages
│   │   ├── verify-email/      # Email verification
│   │   ├── verify-otp/        # OTP verification
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── 📁 components/         # React components
│   │   ├── admin/             # Admin-specific components
│   │   ├── AffiliateSection.tsx
│   │   ├── ClientWrapper.tsx
│   │   ├── DashboardPlans.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   └── ...
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 lib/                # Utility libraries
│   └── 📁 utils/              # Utility functions
├── 📁 utils/                  # Backend utilities
│   ├── emailService.js        # Email notifications
│   ├── logger.js              # Winston logging
│   └── responseHelper.js      # API response helpers
├── 📁 uploads/                # File uploads
├── 📁 logs/                   # Application logs
├── 📁 public/                 # Static assets
├── ecosystem.config.js        # PM2 configuration
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies & scripts
├── server.js                  # Main server file
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## 🗂️ Key Directories

### `/api/` - Backend API Routes
- **Purpose**: Express.js route handlers for all API endpoints
- **Organization**: Grouped by functionality (auth, admin, user, etc.)
- **Access**: All routes prefixed with `/api/`

### `/src/app/` - Frontend Pages (Next.js App Router)
- **Purpose**: Next.js 13+ app router pages with server-side rendering
- **Organization**: File-based routing with layout components
- **Features**: TypeScript, Tailwind CSS, React 19

### `/src/components/` - React Components
- **Purpose**: Reusable UI components and page sections
- **Organization**: Grouped by functionality (admin/, general components)
- **Features**: TypeScript, responsive design, animations

### `/models/` - Database Models
- **Purpose**: Sequelize ORM models with relationships
- **Features**: MySQL database with proper associations
- **Security**: Encrypted passwords, validation, hooks

### `/middleware/` - Express Middleware
- **Purpose**: Authentication, validation, error handling
- **Security**: JWT tokens, rate limiting, input sanitization
- **Logging**: Request tracking, security events

### `/scripts/` - Automation Scripts
- **Purpose**: Database setup, deployment, maintenance
- **Features**: Database migrations, server management
- **Deployment**: Production deployment automation

### `/docs/` - Documentation
- **Purpose**: Setup guides, deployment instructions
- **Content**: Technical documentation, API guides
- **Maintenance**: Up-to-date deployment procedures

## 🔧 Configuration Files

- **`ecosystem.config.js`**: PM2 process management
- **`next.config.js`**: Next.js build configuration  
- **`tsconfig.json`**: TypeScript compiler options
- **`package.json`**: Dependencies and npm scripts
- **`.env.example`**: Environment variables template

## 🚀 Getting Started

1. **Install Dependencies**: `npm install`
2. **Setup Database**: `npm run setup`
3. **Start Development**: `npm run dev`
4. **Build Production**: `npm run build:prod`
5. **Deploy**: `npm run deploy`

## 📝 Scripts

- **`npm run dev`**: Development server with hot reload
- **`npm run build`**: Build for production
- **`npm run start`**: Start production server
- **`npm run setup`**: Create database and run migrations
- **`npm run deploy`**: Full production deployment
- **`npm run pm2:start`**: Start with PM2 process manager

For detailed setup instructions, see `README.md`.