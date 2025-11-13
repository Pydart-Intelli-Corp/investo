#!/bin/bash

# Manual deployment script for investogold
# Run this on your VPS server

echo "🚀 Starting manual deployment..."

# Navigate to application directory
cd /var/www/investogold || mkdir -p /var/www/investogold && cd /var/www/investogold

# Stop PM2 processes
echo "⏹️ Stopping PM2 processes..."
pm2 stop investogold || echo "No processes to stop"
pm2 delete investogold || echo "No processes to delete"

# Initialize git if needed
if [ ! -d ".git" ]; then
    git init
    git remote add origin https://github.com/Pydart-Intelli-Corp/btcbot_node.git
fi

# Pull latest code
echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/main
git clean -fd

# Create .env file
echo "⚙️ Creating environment configuration..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=btcbot
DB_USER=btcbot_user  
DB_PASSWORD=Access@404

# JWT Configuration (replace with your generated secret)
JWT_SECRET=your-jwt-secret-here

# Admin Configuration
ADMIN_EMAIL=btcclub48@gmail.com
ADMIN_PASSWORD=Asd@123456

# Application Settings
BASE_URL=http://72.61.144.187:5000
ALLOWED_ORIGINS=http://72.61.144.187:5000,http://localhost:3000
EOF

# Clear caches and install dependencies
echo "📦 Installing dependencies..."
npm cache clean --force
rm -rf node_modules package-lock.json .next
npm install --production

# Build Next.js application
echo "🔨 Building application..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
node migrate.js || echo "Migration completed"

# Start application with PM2
echo "▶️ Starting application with PM2..."
pm2 start server.js --name "investogold" --instances 1

# Save PM2 configuration
pm2 save
pm2 startup

# Check PM2 status
echo "📊 Checking PM2 status..."
pm2 status

# Check application health
echo "🏥 Checking application health..."
sleep 5
curl -f http://localhost:5000/health || echo "Health check pending..."

echo "✅ Manual deployment completed!"
echo "📍 Application URL: http://72.61.144.187:5000"
echo "🔧 Admin Panel: http://72.61.144.187:5000/adminpanel"
echo "📊 Health Check: http://72.61.144.187:5000/health"