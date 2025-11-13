#!/bin/bash

# investogold Server Quick Deploy Script
# This script automates the deployment process for the investogold application

echo "🚀 Starting investogold Deployment..."
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Check if MySQL is running
if ! systemctl is-active --quiet mysql; then
    echo "❌ MySQL is not running. Please start MySQL service first."
    echo "Run: sudo systemctl start mysql"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "🔧 Please edit .env file with your production settings before continuing."
    echo "Required settings:"
    echo "  - Database credentials (DB_USER, DB_PASSWORD, DB_NAME)"
    echo "  - Admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD)"
    echo "  - Email settings (EMAIL_USER, EMAIL_PASS)"
    echo "  - Server URLs (FRONTEND_URL, BACKEND_URL)"
    echo ""
    echo "After editing .env, run this script again."
    exit 1
fi

# Setup database
echo "🗄️  Setting up database..."
npm run setup:prod

# Build application
echo "🔨 Building application..."
npm run build:prod

# Start with PM2
echo "🚀 Starting application with PM2..."
npm run pm2:start

# Check status
echo "📊 Checking application status..."
pm2 status

echo ""
echo "✅ Deployment completed successfully!"
echo "================================="
echo "🌐 Application URL: http://$(hostname -I | awk '{print $1}'):5000"
echo "🔧 Admin Panel: http://$(hostname -I | awk '{print $1}'):5000/adminpanel"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs investogold   - View application logs"
echo "  pm2 restart investogold - Restart application"
echo "  pm2 stop investogold   - Stop application"
echo ""
echo "For updates:"
echo "  git pull origin main"
echo "  npm run redeploy"