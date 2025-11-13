#!/bin/bash

# Investogold VPS Deployment Script
# Server: 72.61.144.187
# Port: 85

echo "🚀 Starting Investogold Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="investogold"
APP_DIR="/var/www/investogold"
PORT=85
DOMAIN="72.61.144.187"

echo -e "${YELLOW}📦 Step 1: Installing Node.js and dependencies...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs
apt-get install -y build-essential
apt-get install -y git

echo -e "${YELLOW}📦 Step 2: Installing PM2 globally...${NC}"
npm install -g pm2

echo -e "${YELLOW}📂 Step 3: Creating application directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

echo -e "${YELLOW}🔄 Step 4: Cloning/Updating repository...${NC}"
if [ -d ".git" ]; then
    echo "Repository exists, pulling latest changes..."
    git pull origin main
else
    echo "Cloning repository..."
    git clone https://github.com/Pydart-Intelli-Corp/btcbot_node.git .
fi

echo -e "${YELLOW}📝 Step 5: Creating .env file...${NC}"
cat > .env << 'EOF'
# Application Configuration
NODE_ENV=production
PORT=85
HOST=0.0.0.0
BASE_URL=http://72.61.144.187:85

# Database Configuration
DB_HOST=72.61.144.187
DB_PORT=3306
DB_NAME=investogold_db
DB_USER=btc_remote
DB_PASSWORD=Asd@btc123456
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=investogold-production-jwt-secret-2024-secure-key-change-this
JWT_REFRESH_SECRET=investogold-production-refresh-secret-2024-secure-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Admin Configuration
ADMIN_EMAIL=admin@investogold.com
ADMIN_PASSWORD=Admin@Investogold2024
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
SUPER_ADMIN_KEY=investogold-super-admin-key-2024

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=Investogoldofficial@gmail.com
EMAIL_PASS=ypqt jaqh klkx mvrv
EMAIL_FROM=Investogoldofficial@gmail.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp
UPLOAD_PATH=./uploads

# Security Configuration
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Commission Configuration (15 Levels)
LEVEL_1_COMMISSION=5.0
LEVEL_2_COMMISSION=2.0
LEVEL_3_COMMISSION=2.0
LEVEL_4_COMMISSION=2.0
LEVEL_5_COMMISSION=2.0
LEVEL_6_COMMISSION=1.0
LEVEL_7_COMMISSION=1.0
LEVEL_8_COMMISSION=1.0
LEVEL_9_COMMISSION=1.0
LEVEL_10_COMMISSION=1.0
LEVEL_11_COMMISSION=0.5
LEVEL_12_COMMISSION=0.5
LEVEL_13_COMMISSION=0.5
LEVEL_14_COMMISSION=0.5
LEVEL_15_COMMISSION=0.5

# Notification Configuration
ENABLE_EMAIL_NOTIFICATIONS=true
EOF

echo -e "${YELLOW}📦 Step 6: Installing dependencies...${NC}"
npm install --production

echo -e "${YELLOW}🏗️  Step 7: Building Next.js application...${NC}"
npm run build

echo -e "${YELLOW}📁 Step 8: Creating necessary directories...${NC}"
mkdir -p logs
mkdir -p uploads
chmod 755 uploads

echo -e "${YELLOW}🔥 Step 9: Setting up firewall...${NC}"
ufw allow 85/tcp
ufw allow 3306/tcp
ufw --force enable

echo -e "${YELLOW}🚀 Step 10: Starting application with PM2...${NC}"
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u root --hp /root

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 Application URL: http://72.61.144.187:85${NC}"
echo -e "${GREEN}📊 PM2 Dashboard: pm2 monit${NC}"
echo -e "${GREEN}📝 View Logs: pm2 logs $APP_NAME${NC}"
echo -e "${GREEN}🔄 Restart App: pm2 restart $APP_NAME${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
