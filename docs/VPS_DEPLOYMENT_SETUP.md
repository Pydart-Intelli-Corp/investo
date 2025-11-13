# VPS Deployment Setup Guide

## Prerequisites
Your VPS server details:
- **IP Address**: 72.61.144.187
- **User**: root
- **SSH Access**: Required

## Step 1: GitHub Repository Secrets Setup

Navigate to your GitHub repository: `https://github.com/Pydart-Intelli-Corp/btcbot_node`

Go to **Settings** → **Secrets and variables** → **Actions** and add these secrets:

### Required Secrets:
```
VPS_HOST=72.61.144.187
VPS_USER=root
VPS_SSH_KEY=[Your SSH private key content]
VPS_PORT=22
MYSQL_PASSWORD=Access@404
ADMIN_EMAIL=btcclub48@gmail.com
ADMIN_PASSWORD=Asd@123456
JWT_SECRET=[Generate a strong JWT secret]
BACKUP_RETENTION_DAYS=7
```

### Optional Environment Secrets:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[Your email]
EMAIL_PASS=[Your email password]
```

## Step 2: SSH Key Setup

### Generate SSH Key (if you don't have one):
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

### Add Public Key to VPS:
```bash
# Copy your public key
cat ~/.ssh/id_rsa.pub

# SSH to your VPS and add the key
ssh root@72.61.144.187
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Add Private Key to GitHub Secrets:
```bash
# Copy your private key content
cat ~/.ssh/id_rsa
```
Copy the entire content (including BEGIN/END lines) and paste it as the `VPS_SSH_KEY` secret.

## Step 3: VPS Server Preparation

### Connect to your VPS:
```bash
ssh root@72.61.144.187
```

### Install Required Software:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install MySQL (if not already installed)
apt install mysql-server -y

# Secure MySQL installation
mysql_secure_installation

# Create application directory
mkdir -p /var/www/investogold
chown root:root /var/www/investogold

# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS btcbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Configure MySQL User:
```sql
-- Connect to MySQL
mysql -u root -p

-- Create application user (replace 'your_password' with Access@404)
CREATE USER 'btcbot_user'@'localhost' IDENTIFIED BY 'Access@404';
GRANT ALL PRIVILEGES ON btcbot.* TO 'btcbot_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 4: Environment Configuration

### Create production .env on VPS:
```bash
# Create .env file
cat > /var/www/investogold/.env << 'EOF'
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=btcbot
DB_USER=btcbot_user
DB_PASSWORD=Access@404

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here

# Admin Configuration
ADMIN_EMAIL=btcclub48@gmail.com
ADMIN_PASSWORD=Asd@123456

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Application Settings
BASE_URL=http://72.61.144.187:5000
ALLOWED_ORIGINS=http://72.61.144.187:5000,http://localhost:3000
EOF
```

## Step 5: Firewall Configuration

```bash
# Allow SSH, HTTP, and application port
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 5000
ufw --force enable
```

## Step 6: Domain Setup (Optional)

If you have a domain, update your DNS:
```
A record: yourdomain.com → 72.61.144.187
A record: www.yourdomain.com → 72.61.144.187
```

## Step 7: Deploy Using GitHub Actions

### Available Workflows:

1. **Simple Deploy** (`.github/workflows/simple-deploy.yml`)
   - Basic deployment with minimal setup
   - Triggered manually or on push to main

2. **Standard Deploy** (`.github/workflows/deploy.yml`)
   - Full deployment with health checks
   - Automatic rollback on failure

3. **Advanced Deploy** (`.github/workflows/advanced-deploy.yml`)
   - Multi-stage deployment with testing
   - Comprehensive monitoring

4. **Environment Deploy** (`.github/workflows/environment-deploy.yml`)
   - Environment-specific deployments
   - Support for staging/production

### Manual Deployment Trigger:
1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select the workflow you want to run
4. Click **Run workflow**
5. Select the branch (main) and click **Run workflow**

### Automatic Deployment:
- Push to `main` branch will automatically trigger deployment
- The workflow will handle:
  - Code deployment
  - Dependency installation
  - Database migration
  - PM2 process management
  - Health checks

## Step 8: Post-Deployment Verification

### Check Application Status:
```bash
# SSH to VPS
ssh root@72.61.144.187

# Check PM2 processes
pm2 status

# Check application logs
pm2 logs investogold

# Check if app is running
curl http://localhost:5000

# Check admin panel
curl http://localhost:5000/adminpanel
```

### Access Your Application:
- **Frontend**: http://72.61.144.187:5000
- **Admin Panel**: http://72.61.144.187:5000/adminpanel
- **API**: http://72.61.144.187:5000/api

### Test Admin Login:
- Email: btcclub48@gmail.com
- Password: Asd@123456

## Troubleshooting

### Common Issues:

1. **SSH Connection Failed**:
   - Verify SSH key is correctly added to GitHub secrets
   - Check VPS firewall allows SSH (port 22)

2. **Database Connection Failed**:
   - Verify MySQL is running: `systemctl status mysql`
   - Check database credentials in .env file

3. **Application Not Starting**:
   - Check PM2 logs: `pm2 logs investogold`
   - Verify all dependencies installed: `npm install`

4. **Port Already in Use**:
   - Check running processes: `netstat -tulpn | grep :5000`
   - Kill conflicting processes or change port

### Useful Commands:
```bash
# Restart application
pm2 restart investogold

# View logs
pm2 logs investogold --lines 50

# Monitor resources
pm2 monit

# Reload application (zero downtime)
pm2 reload investogold

# Stop application
pm2 stop investogold

# Delete application from PM2
pm2 delete investogold
```

## Security Recommendations

1. **Change default passwords**
2. **Enable UFW firewall**
3. **Regular security updates**
4. **Monitor application logs**
5. **Setup SSL certificate (Let's Encrypt)**
6. **Regular database backups**

## Next Steps

1. ✅ **Setup GitHub Secrets** (VPS_HOST, VPS_USER, VPS_SSH_KEY, etc.)
2. ✅ **Prepare VPS server** (Node.js, PM2, MySQL)
3. ✅ **Configure environment variables**
4. ✅ **Run GitHub Actions deployment**
5. ✅ **Verify deployment and test application**
6. 🔄 **Setup SSL certificate** (optional)
7. 🔄 **Configure domain** (optional)
8. 🔄 **Setup monitoring** (optional)

Your application is ready for deployment! 🚀