# investogold Server Deployment Guide

This guide contains the changes made to ensure the application runs properly when deployed on a server.

## Key Changes Made

### 1. Server Configuration (server.js)
- **CSP Disabled**: Disabled Content Security Policy headers to fix white screen issue in production
- **Helmet Configuration**: Modified to prevent Next.js hydration issues
- **Production Ready**: Server configured to handle both frontend and backend requests

### 2. Environment Configuration (.env)
- **Production Settings**: Updated NODE_ENV to production
- **Database Credentials**: Configured for production database (btcbot_db, btcbot user)
- **Admin Credentials**: Environment-based admin authentication
- **Email Configuration**: Gmail SMTP with app password
- **Server URLs**: Updated to use server IP address

### 3. PM2 Configuration (ecosystem.config.js)
- **Cluster Mode**: 2 instances for load balancing
- **Auto Restart**: Automatic restart on failures
- **Log Management**: Separate log files for errors and output
- **Memory Management**: Auto restart at 1GB memory usage

### 4. Admin Authentication (routes/adminAuth.js)
- **Environment Credentials**: Admin login now checks environment variables first
- **Fallback Authentication**: Falls back to database authentication for other admins
- **JWT Integration**: Proper token generation for environment admin

### 5. Package.json Scripts
- **Production Build**: `npm run build:prod`
- **PM2 Management**: Scripts for PM2 start/stop/restart
- **Deployment**: `npm run deploy` for initial deployment
- **Redeployment**: `npm run redeploy` for updates

## Environment Variables

The following environment variables must be set on the server:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=btcbot_db
DB_USER=btcbot
DB_PASSWORD=SecurePassword123!

# Admin Credentials
ADMIN_EMAIL=btcclub48@gmail.com
ADMIN_PASSWORD=Asd@123456
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User

# Email Configuration
EMAIL_USER=btcclub48@gmail.com
EMAIL_PASS=ovay fxei fzrf sgdr
EMAIL_FROM=btcclub48@gmail.com

# Frontend/Backend URLs
FRONTEND_URL=http://72.61.144.187:5000
BACKEND_URL=http://72.61.144.187:5000
```

## Deployment Commands

On the server, after pulling from GitHub:

```bash
# Install dependencies
npm install

# Setup database (first time only)
npm run setup:prod

# Build and deploy
npm run deploy

# For updates
git pull origin main
npm run redeploy
```

## Server Setup Requirements

1. **Node.js**: Version 16+ 
2. **MySQL**: Database server with btcbot_db database
3. **PM2**: Process manager (`npm install -g pm2`)
4. **Nginx**: Reverse proxy configuration (optional)

## Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name investogold.com www.investogold.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### White Screen Issue
- **Solution**: CSP is disabled in helmet configuration
- **Verification**: Check that contentSecurityPolicy: false in server.js

### Admin Login Issues
- **Solution**: Admin credentials are read from environment variables
- **Verification**: Check .env file has ADMIN_EMAIL and ADMIN_PASSWORD set

### Database Connection Issues
- **Solution**: Ensure MySQL service is running and credentials are correct
- **Verification**: Run `npm run create-db` to test connection

### Port Already in Use
- **Solution**: Use PM2 to manage processes
- **Commands**: `npm run pm2:stop` then `npm run pm2:start`

## Admin Panel Access

- **URL**: http://[server-ip]:5000/adminpanel
- **Email**: btcclub48@gmail.com
- **Password**: Asd@123456

## Monitoring

- **PM2 Status**: `pm2 status`
- **PM2 Logs**: `pm2 logs investogold`
- **PM2 Monitoring**: `pm2 monit`

## Security Notes

1. Admin credentials are now stored in environment variables
2. Database uses dedicated user with limited privileges
3. Email uses app-specific password for Gmail
4. Server configured for production environment
5. Rate limiting enabled for API endpoints