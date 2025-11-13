# Nginx Reverse Proxy Setup for investogold

## Install Nginx
```bash
# On your VPS:
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/investogold
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name 72.61.144.187;

    # Proxy all requests to Node.js app
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## Enable Configuration
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/investogold /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Update Firewall
```bash
# Allow HTTP traffic
sudo ufw allow 'Nginx Full'
sudo ufw status
```

## Update Application
Your Node.js app keeps running on port 5000, but users access via port 80.

Update GitHub secrets:
```
BASE_URL = http://72.61.144.187
ALLOWED_ORIGINS = http://72.61.144.187,http://localhost:3000
```

## Benefits:
✅ Clean URL: http://72.61.144.187
✅ Ready for SSL/HTTPS later
✅ Better performance
✅ Professional setup