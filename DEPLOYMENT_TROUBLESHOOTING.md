# 🔧 Website Not Updating - Troubleshooting Guide

## 🚨 Quick Fixes

If your GitHub Actions deployment shows success but the website isn't updated, try these solutions:

### 1. **Manual Force Deployment on Server**

SSH into your server and run:

```bash
ssh root@72.61.144.187
cd /var/www/investogold
chmod +x scripts/manual-deploy.sh
./scripts/manual-deploy.sh
```

### 2. **Check if PM2 Process is Actually Running**

```bash
pm2 status
pm2 logs investogold
```

### 3. **Force Restart Everything**

```bash
# Stop all processes
pm2 stop all
pm2 delete all

# Clear caches
npm cache clean --force
rm -rf node_modules .next

# Reinstall and rebuild
npm install --production
npm run build

# Start fresh
pm2 start ecosystem.config.js --env production
```

## 🔍 Common Issues & Solutions

### Issue 1: **Browser Cache**
**Symptoms**: Old content still showing
**Solution**: 
- Hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Try incognito/private browsing mode

### Issue 2: **Next.js Build Cache**
**Symptoms**: Components not updating
**Solution**:
```bash
cd /var/www/investogold
rm -rf .next
npm run build
pm2 restart investogold
```

### Issue 3: **Git Not Pulling Latest Changes**
**Symptoms**: Deployment success but code unchanged
**Solution**:
```bash
cd /var/www/investogold
git status
git fetch origin
git reset --hard origin/main
git clean -fd
```

### Issue 4: **Port/URL Issues**
**Symptoms**: Can't access website
**Solution**: Make sure you're accessing:
- `http://72.61.144.187:5000` (with port 5000)
- Not just `http://72.61.144.187` (without port)

### Issue 5: **PM2 Process Not Restarting**
**Symptoms**: Old code still running
**Solution**:
```bash
pm2 kill  # Kill all PM2 processes
pm2 start ecosystem.config.js --env production
```

## 🧪 Verification Steps

After deployment, verify these:

1. **Check Git Commit on Server**:
   ```bash
   cd /var/www/investogold
   git log --oneline -5
   ```

2. **Check Build Artifacts**:
   ```bash
   ls -la .next/
   ```

3. **Check Application Health**:
   ```bash
   curl http://localhost:5000/health
   ```

4. **Check PM2 Status**:
   ```bash
   pm2 status
   pm2 logs investogold --lines 20
   ```

## 🚀 Emergency Deployment Script

If GitHub Actions isn't working, use this emergency script:

```bash
#!/bin/bash
# Emergency deployment - run on server

cd /var/www/investogold

# Kill everything
pm2 kill
pkill -f node

# Fresh start
git fetch origin
git reset --hard origin/main
rm -rf node_modules .next package-lock.json
npm install --production
npm run build

# Start application
pm2 start server.js --name investogold
pm2 save

echo "Emergency deployment completed!"
echo "Visit: http://72.61.144.187:5000"
```

## 📞 Quick Diagnostic Commands

Run these to get full system status:

```bash
# System overview
echo "=== SYSTEM STATUS ==="
date
uptime
df -h
free -h

echo "=== APPLICATION STATUS ==="
cd /var/www/investogold
git log --oneline -3
pm2 status
curl -s http://localhost:5000/health | head -20

echo "=== NETWORK STATUS ==="
netstat -tulpn | grep 5000
ss -tulpn | grep 5000
```

## 🔄 Automated Fix Script

Save this as `fix-deployment.sh` and run when issues occur:

```bash
#!/bin/bash
set -e

echo "🔧 Running automated deployment fix..."

cd /var/www/investogold

# Stop processes
pm2 stop all || true
pm2 delete all || true

# Clean everything
git clean -fd
git reset --hard origin/main
rm -rf node_modules .next package-lock.json npm-debug.log*

# Fresh install
npm cache clean --force
npm install --production
npm run build

# Start application
pm2 start ecosystem.config.js --env production || pm2 start server.js --name investogold
pm2 save

# Verify
sleep 10
if curl -f http://localhost:5000/health; then
    echo "✅ Fix successful!"
    echo "🌐 Visit: http://72.61.144.187:5000"
else
    echo "❌ Fix failed - check logs:"
    pm2 logs investogold --lines 10
fi
```

## 📧 Contact Support

If none of these solutions work:

1. Check the GitHub Actions logs for specific errors
2. SSH into your server and run the diagnostic commands above
3. Share the output of `pm2 logs investogold` and `curl http://localhost:5000/health`

**Most likely causes:**
1. Browser cache (try incognito mode)
2. Missing port in URL (use :5000)
3. PM2 not restarting properly
4. Build cache issues (.next folder)