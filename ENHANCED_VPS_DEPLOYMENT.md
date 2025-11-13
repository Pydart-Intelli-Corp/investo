# 🚀 Enhanced VPS Deployment Guide for investogold

## 📋 Overview

This guide covers the enhanced VPS deployment setup with improved security, performance monitoring, SSL support, and automated maintenance for your investogold application.

## 🎯 Key Improvements

### ✅ Enhanced Features
- **Multi-environment deployment** (production, staging)
- **Advanced health checks** and rollback capabilities
- **SSL/HTTPS support** with Let's Encrypt
- **Performance monitoring** and alerting
- **Automated backups** and log rotation
- **Security hardening** with rate limiting
- **Resource optimization** with PM2 clustering
- **Comprehensive error handling** and recovery

## 🏗️ Infrastructure Components

### 1. GitHub Actions Workflows
- `enhanced-vps-deploy.yml` - Production deployment with health checks
- `simple-express-deploy.yml` - Basic deployment (existing)

### 2. Server Configuration
- **PM2 Ecosystem** - Optimized clustering and monitoring
- **Nginx Reverse Proxy** - SSL termination and load balancing
- **MySQL Database** - Persistent data storage
- **SSL Certificates** - Let's Encrypt integration

### 3. Monitoring & Maintenance
- **System monitoring** script with alerting
- **Automated backups** and cleanup
- **Performance optimization** and tuning
- **Security monitoring** and threat detection

## 🚀 Quick Deployment

### Step 1: Update GitHub Secrets

Add these **new/updated secrets** to your GitHub repository:

```
# Existing secrets (keep these)
VPS_HOST=72.61.144.187
VPS_USER=root
VPS_SSH_KEY=[Your SSH private key]
VPS_PORT=22
MYSQL_PASSWORD=Access@404
ADMIN_EMAIL=btcclub48@gmail.com
ADMIN_PASSWORD=Asd@123456
JWT_SECRET=[Generate strong JWT secret]

# New/Updated secrets for enhanced deployment
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[Your Gmail address]
EMAIL_PASS=[Your Gmail app password]
BACKUP_RETENTION_DAYS=7
```

### Step 2: Deploy Using Enhanced Workflow

1. Go to **Actions** tab in your GitHub repository
2. Select **Enhanced VPS Deployment**
3. Click **Run workflow**
4. Choose environment and options:
   - Environment: `production`
   - Skip tests: `false` (recommended)
5. Click **Run workflow**

## 🔧 Server Setup Commands

### Initial VPS Preparation

```bash
# Connect to your VPS
ssh root@72.61.144.187

# Run the enhanced setup
cd /var/www/investogold
chmod +x scripts/*.sh

# Setup system monitoring (run once)
./scripts/server-monitor.sh --all

# Setup SSL (when you have a domain)
./scripts/setup-ssl.sh yourdomain.com your-email@domain.com
```

### Daily Maintenance

```bash
# Run system health check
./scripts/server-monitor.sh

# Generate system report
./scripts/server-monitor.sh --report

# Create database backup
./scripts/server-monitor.sh --backup

# Update system packages
./scripts/server-monitor.sh --update
```

## 📊 Performance Optimizations

### PM2 Configuration
- **Multi-core clustering** - Uses all available CPU cores
- **Automatic restarts** - Smart restart policies
- **Memory management** - Prevents memory leaks
- **Health monitoring** - Built-in health checks

### Nginx Optimizations
- **HTTP/2 support** - Faster page loading
- **Gzip compression** - Reduced bandwidth usage
- **Static file caching** - Improved performance
- **Rate limiting** - DDoS protection

### Database Optimizations
- **Connection pooling** - Efficient database usage
- **Query optimization** - Faster database operations
- **Automated backups** - Data protection

## 🔒 Security Enhancements

### Application Security
- **Rate limiting** on API endpoints
- **CORS configuration** - Secure cross-origin requests
- **Input validation** - Prevent injection attacks
- **Session management** - Secure user sessions

### Server Security
- **UFW firewall** - Network protection
- **SSH monitoring** - Failed login detection
- **SSL/TLS encryption** - Secure communications
- **Security headers** - Browser protection

### Monitoring & Alerts
- **Failed login tracking** - Suspicious activity detection
- **Resource monitoring** - CPU, memory, disk usage
- **Service monitoring** - MySQL, Nginx, PM2 status
- **Email alerts** - Immediate notifications

## 🌍 SSL/HTTPS Setup

### Automatic SSL with Let's Encrypt

```bash
# Run SSL setup script (requires domain)
./scripts/setup-ssl.sh yourdomain.com admin@yourdomain.com

# Manual SSL certificate renewal
certbot renew

# Check SSL certificate status
certbot certificates
```

### Domain Configuration

1. **Point your domain** to your VPS IP: `72.61.144.187`
2. **Update DNS records**:
   ```
   A record: yourdomain.com → 72.61.144.187
   A record: www.yourdomain.com → 72.61.144.187
   ```
3. **Run SSL setup** script with your domain
4. **Update GitHub secrets** with your domain

## 📈 Monitoring Dashboard

### System Status Check
```bash
# Quick health check
curl http://localhost:5000/health

# PM2 process status
pm2 status

# System resources
pm2 monit
```

### Log Analysis
```bash
# Application logs
pm2 logs investogold

# Nginx logs
tail -f /var/log/nginx/access.log

# System logs
journalctl -u nginx -f
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Application Won't Start
```bash
# Check PM2 logs
pm2 logs investogold

# Restart application
pm2 restart investogold

# Check database connection
node -e "const {sequelize} = require('./config/database'); sequelize.authenticate().then(() => console.log('OK')).catch(err => console.error(err));"
```

#### SSL Certificate Issues
```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew --force-renewal

# Check Nginx configuration
nginx -t
```

#### Database Connection Errors
```bash
# Check MySQL status
systemctl status mysql

# Restart MySQL
systemctl restart mysql

# Check database credentials
mysql -u btcbot_user -p btcbot
```

#### High Resource Usage
```bash
# Check system resources
./scripts/server-monitor.sh --report

# Optimize PM2 processes
pm2 optimize

# Clean up logs
./scripts/server-monitor.sh
```

## 📅 Maintenance Schedule

### Daily (Automated)
- ✅ Health checks and monitoring
- ✅ Log rotation and cleanup
- ✅ Security monitoring

### Weekly (Manual)
- 🔄 System updates: `./scripts/server-monitor.sh --update`
- 🔄 Database backup: `./scripts/server-monitor.sh --backup`
- 🔄 Performance review: `./scripts/server-monitor.sh --report`

### Monthly (Manual)
- 🔄 SSL certificate renewal (automatic)
- 🔄 Security audit and review
- 🔄 Performance optimization review

## 🎉 Post-Deployment Verification

### 1. Application Access
- ✅ **Frontend**: https://yourdomain.com
- ✅ **Admin Panel**: https://yourdomain.com/adminpanel
- ✅ **API**: https://yourdomain.com/api
- ✅ **Health Check**: https://yourdomain.com/health

### 2. Performance Tests
```bash
# Load test (install apache2-utils first)
ab -n 1000 -c 10 https://yourdomain.com/

# SSL test
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### 3. Security Verification
- 🔒 **SSL Rating**: Visit [SSL Labs](https://www.ssllabs.com/ssltest/)
- 🔒 **Security Headers**: Visit [Security Headers](https://securityheaders.com/)
- 🔒 **Firewall Status**: `ufw status`

## 🆘 Support & Resources

### Documentation
- 📚 **Deployment Docs**: `/docs/VPS_DEPLOYMENT_SETUP.md`
- 📚 **Nginx Setup**: `/docs/NGINX_SETUP.md`
- 📚 **GitHub Actions**: `/docs/GITHUB_ACTIONS_SETUP.md`

### Useful Commands
```bash
# Application management
pm2 start ecosystem.config.js --env production
pm2 restart investogold
pm2 stop investogold
pm2 delete investogold

# Server management
systemctl restart nginx
systemctl restart mysql
systemctl status nginx

# Monitoring
./scripts/server-monitor.sh
./scripts/server-monitor.sh --report
htop
iotop
```

### Contact Information
- 📧 **Support Email**: btcclub48@gmail.com
- 🐛 **Issues**: GitHub Issues tab
- 📖 **Documentation**: This README and `/docs/` folder

---

## 🎯 Success Checklist

- [ ] GitHub secrets configured
- [ ] Enhanced deployment workflow running
- [ ] Application accessible via HTTPS
- [ ] Admin panel working correctly
- [ ] SSL certificate installed and valid
- [ ] Monitoring scripts configured
- [ ] Automatic backups enabled
- [ ] Security measures in place
- [ ] Performance optimized
- [ ] Maintenance schedule established

**🎉 Congratulations! Your investogold application is now running on a fully optimized, secure, and monitored VPS server!**