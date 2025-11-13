# Investogold Manual VPS Deployment Guide
# Server: root@72.61.144.187
# Port: 85

## Step-by-Step Commands (Run these on your VPS)

### 1. Update system and install Node.js 20.x
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs build-essential git
node --version
npm --version
```

### 2. Install PM2 globally
```bash
npm install -g pm2
pm2 --version
```

### 3. Create application directory
```bash
mkdir -p /var/www/investogold
cd /var/www/investogold
```

### 4. Clone repository
```bash
git clone https://github.com/Pydart-Intelli-Corp/btcbot_node.git .
```

### 5. Create .env file
```bash
nano .env
```

Paste this content:
```
NODE_ENV=production
PORT=85
HOST=0.0.0.0
BASE_URL=http://72.61.144.187:85

DB_HOST=72.61.144.187
DB_PORT=3306
DB_NAME=investogold_db
DB_USER=btc_remote
DB_PASSWORD=Asd@btc123456
DB_DIALECT=mysql

JWT_SECRET=investogold-production-jwt-secret-2024-secure
JWT_REFRESH_SECRET=investogold-refresh-secret-2024-secure
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

ADMIN_EMAIL=admin@investogold.com
ADMIN_PASSWORD=Admin@Investogold2024
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
SUPER_ADMIN_KEY=investogold-super-admin-key-2024

EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=Investogoldofficial@gmail.com
EMAIL_PASS=ypqt jaqh klkx mvrv
EMAIL_FROM=Investogoldofficial@gmail.com

MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp
UPLOAD_PATH=./uploads

BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

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

ENABLE_EMAIL_NOTIFICATIONS=true
```

Save: Press `Ctrl+X`, then `Y`, then `Enter`

### 6. Install dependencies
```bash
npm install
```

### 7. Build Next.js
```bash
npm run build
```

### 8. Create directories
```bash
mkdir -p logs uploads
chmod 755 uploads
```

### 9. Configure firewall
```bash
ufw allow 85/tcp
ufw allow 3306/tcp
ufw status
```

### 10. Start with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 11. Monitor application
```bash
pm2 status
pm2 logs investogold
```

## Quick Access Commands

### View application status
```bash
pm2 status
```

### View logs
```bash
pm2 logs investogold
pm2 logs investogold --lines 100
```

### Restart application
```bash
pm2 restart investogold
```

### Stop application
```bash
pm2 stop investogold
```

### View real-time monitoring
```bash
pm2 monit
```

### Pull latest changes and restart
```bash
cd /var/www/investogold
git pull origin main
npm install
npm run build
pm2 restart investogold
```

## Access Application
- **URL**: http://72.61.144.187:85
- **Admin Panel**: http://72.61.144.187:85/adminpanel
- **Admin Login**: admin@investogold.com / Admin@Investogold2024

## Troubleshooting

### If port 85 is busy
```bash
lsof -i :85
kill -9 <PID>
```

### Check Node.js processes
```bash
ps aux | grep node
```

### View system resources
```bash
htop
```

### Check disk space
```bash
df -h
```

### View application errors
```bash
tail -f /var/www/investogold/logs/error.log
tail -f /var/www/investogold/logs/combined.log
```

### Restart PM2
```bash
pm2 kill
pm2 start ecosystem.config.js --env production
pm2 save
```

## Database Connection Test
```bash
mysql -h 72.61.144.187 -u btc_remote -p investogold_db
# Password: Asd@btc123456
```

## SSL Certificate (Optional - For HTTPS)
```bash
apt install -y certbot
# Configure domain first, then:
certbot certonly --standalone -d yourdomain.com
```
