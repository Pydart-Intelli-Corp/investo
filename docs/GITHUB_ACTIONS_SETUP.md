# GitHub Actions VPS Deployment Setup Guide

This guide explains how to set up GitHub Actions for automatic deployment to your Hostinger VPS.

## 🎯 Overview

GitHub Actions will automatically deploy your investogold application to your Hostinger VPS whenever you push code to the main branch. This creates a complete CI/CD pipeline.

## 📋 Prerequisites

1. **VPS Access**: SSH access to your Hostinger VPS
2. **GitHub Repository**: Your code repository on GitHub
3. **SSH Key Pair**: For secure authentication
4. **Application Setup**: Application already deployed manually once

## 🔧 Setup Steps

### 1. Generate SSH Key Pair

On your local machine or VPS, generate an SSH key pair:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@investogold.com" -f ~/.ssh/github-actions

# This creates:
# ~/.ssh/github-actions (private key)
# ~/.ssh/github-actions.pub (public key)
```

### 2. Add Public Key to VPS

Copy the public key to your VPS:

```bash
# Copy public key content
cat ~/.ssh/github-actions.pub

# On your VPS, add to authorized_keys
echo "ssh-rsa AAAAB3NzaC1yc2E... github-actions@investogold.com" >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3. Configure GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add these secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `VPS_HOST` | Your VPS IP address | `72.61.144.187` |
| `VPS_USERNAME` | VPS username | `root` or your username |
| `VPS_SSH_KEY` | Private key content | Contents of `~/.ssh/github-actions` |
| `VPS_PORT` | SSH port (usually 22) | `22` |
| `APP_URL` | Your application URL | `http://72.61.144.187:5000` |

#### Adding SSH Private Key:
```bash
# Copy the entire private key including headers
cat ~/.ssh/github-actions
```
Copy the output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) and paste it as the `VPS_SSH_KEY` secret.

### 4. Prepare VPS for Automated Deployment

Ensure your VPS has the necessary tools:

```bash
# Install required tools (if not already installed)
sudo apt update
sudo apt install -y git nodejs npm

# Install PM2 globally
npm install -g pm2

# Ensure your application directory exists
sudo mkdir -p /var/www/investogold
sudo chown -R $USER:$USER /var/www/investogold

# Navigate to app directory and ensure git is configured
cd /var/www/investogold
git remote -v  # Should show your GitHub repository
```

### 5. Test SSH Connection

Test the SSH connection from your local machine:

```bash
ssh -i ~/.ssh/github-actions username@72.61.144.187 -p 22
```

### 6. Commit and Push Workflow Files

The workflow files are already created in `.github/workflows/`:

- `simple-deploy.yml` - Basic deployment
- `deploy.yml` - Standard deployment with health checks
- `advanced-deploy.yml` - Advanced deployment with rollback capabilities

Choose one workflow file and delete the others, or rename them with `.disabled` extension.

## 🚀 Workflow Options

### 1. Simple Deploy (`simple-deploy.yml`)
- **Best for**: Quick deployments, testing
- **Features**: Basic git pull and restart
- **Use case**: Small updates, no critical production requirements

### 2. Standard Deploy (`deploy.yml`)
- **Best for**: Production deployments
- **Features**: Build verification, health checks, basic error handling
- **Use case**: Most production environments

### 3. Advanced Deploy (`advanced-deploy.yml`)
- **Best for**: Mission-critical applications
- **Features**: Backup/rollback, environment-specific deployments, comprehensive health checks
- **Use case**: High-availability production systems

## 📝 Environment Variables on VPS

Ensure your VPS has the correct `.env` file:

```bash
# On your VPS
cd /var/www/investogold
ls -la .env  # Should exist

# If not, copy from example and edit
cp .env.example .env
nano .env  # Edit with your production settings
```

## 🔄 How It Works

1. **Push Code**: You push code to the main branch
2. **Trigger**: GitHub Actions workflow is triggered
3. **Build**: Code is built and tested (if tests exist)
4. **Deploy**: Code is deployed to your VPS via SSH
5. **Health Check**: Application health is verified
6. **Notification**: Success/failure notification

## 🎯 Deployment Process

When you push to main branch:

```bash
git add .
git commit -m "Update application"
git push origin main
```

GitHub Actions will:
1. Connect to your VPS via SSH
2. Navigate to `/var/www/investogold`
3. Pull latest code with `git pull origin main`
4. Install dependencies with `npm install`
5. Build application with `npm run build:prod`
6. Restart PM2 with `npm run pm2:restart`
7. Verify deployment success

## 🛠️ Manual Deployment (Fallback)

If GitHub Actions fails, you can still deploy manually:

```bash
# SSH to your VPS
ssh username@72.61.144.187

# Navigate to app directory
cd /var/www/investogold

# Pull latest code
git pull origin main

# Deploy
npm run redeploy
```

## 🔍 Monitoring Deployments

### GitHub Interface:
- Go to your repository → **Actions** tab
- View deployment logs and status
- Monitor build times and success rates

### VPS Monitoring:
```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs investogold

# Monitor resource usage
pm2 monit
```

## 🚨 Troubleshooting

### Common Issues:

1. **SSH Connection Failed**
   ```
   Solution: Check VPS_HOST, VPS_USERNAME, VPS_SSH_KEY secrets
   Verify SSH key is added to VPS authorized_keys
   ```

2. **Permission Denied**
   ```
   Solution: Ensure proper ownership of /var/www/investogold
   sudo chown -R $USER:$USER /var/www/investogold
   ```

3. **Build Failed**
   ```
   Solution: Check application logs for errors
   Verify .env file has correct settings
   Ensure all dependencies are properly installed
   ```

4. **Health Check Failed**
   ```
   Solution: Check if application is running on correct port
   Verify database connection
   Check PM2 logs for startup errors
   ```

### Debug Commands:
```bash
# On VPS - Check application status
cd /var/www/investogold
pm2 status
pm2 logs investogold --lines 50

# Test application manually
curl http://localhost:5000/health

# Check Git status
git status
git log --oneline -5
```

## 🔐 Security Best Practices

1. **SSH Key Security**:
   - Use different SSH keys for different purposes
   - Regularly rotate SSH keys
   - Never commit private keys to repository

2. **Secrets Management**:
   - Use GitHub Secrets for sensitive data
   - Never hardcode credentials in workflow files
   - Regularly audit and rotate secrets

3. **VPS Security**:
   - Keep VPS updated: `sudo apt update && sudo apt upgrade`
   - Use fail2ban for SSH protection
   - Configure firewall rules

## 📊 Monitoring and Alerts

You can enhance the workflows with notifications:

### Slack Notifications:
Add to your workflow:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications:
Add to your workflow:
```yaml
- name: Send Email
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Deployment Status
    body: Deployment ${{ job.status }}
```

## 🎉 Benefits of GitHub Actions Deployment

1. **Automated**: No manual deployment steps
2. **Consistent**: Same process every time
3. **Fast**: Quick deployment after code push
4. **Reliable**: Built-in error handling and rollback
5. **Trackable**: Full deployment history and logs
6. **Secure**: SSH key-based authentication

## 📈 Next Steps

1. **Set up secrets** in GitHub repository
2. **Choose and configure** workflow file
3. **Test deployment** with a small change
4. **Monitor and optimize** deployment process
5. **Add notifications** for deployment status
6. **Consider blue-green deployments** for zero downtime

This setup provides a professional CI/CD pipeline for your investogold application!