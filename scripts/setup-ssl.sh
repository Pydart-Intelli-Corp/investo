#!/bin/bash

# investogold SSL Setup Script with Let's Encrypt
# This script sets up SSL certificates for your domain

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN="${1:-investogold.com}"
EMAIL="${2:-btcclub48@gmail.com}"
NGINX_CONFIG="/etc/nginx/sites-available/investogold"

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

print_usage() {
    echo "Usage: $0 [DOMAIN] [EMAIL]"
    echo "Example: $0 investogold.com admin@investogold.com"
    echo ""
    echo "If no domain is provided, SSL setup will be skipped."
    echo "You can run this script later when you have a domain."
    exit 1
}

check_prerequisites() {
    log "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        log "${RED}❌ Please run this script as root${NC}"
        exit 1
    fi
    
    # Check if domain is provided and valid
    if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "investogold.com" ]; then
        log "${YELLOW}⚠️ No custom domain provided${NC}"
        log "${YELLOW}⚠️ SSL setup requires a valid domain name${NC}"
        read -p "Do you want to continue without SSL? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_usage
        fi
        return 1
    fi
    
    # Check if Nginx is installed
    if ! command -v nginx >/dev/null 2>&1; then
        log "${RED}❌ Nginx is not installed${NC}"
        exit 1
    fi
    
    # Check if domain resolves to this server
    SERVER_IP=$(curl -s ifconfig.me)
    DOMAIN_IP=$(dig +short "$DOMAIN" @8.8.8.8 | tail -n1)
    
    if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
        log "${YELLOW}⚠️ Domain $DOMAIN does not resolve to this server IP ($SERVER_IP)${NC}"
        log "${YELLOW}⚠️ Current domain IP: $DOMAIN_IP${NC}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    log "${GREEN}✅ Prerequisites check passed${NC}"
    return 0
}

install_certbot() {
    log "${BLUE}📦 Installing Certbot...${NC}"
    
    # Install snapd if not present
    if ! command -v snap >/dev/null 2>&1; then
        apt update
        apt install snapd -y
    fi
    
    # Install certbot via snap
    snap install core; snap refresh core
    snap install --classic certbot
    
    # Create symlink
    ln -sf /snap/bin/certbot /usr/bin/certbot
    
    log "${GREEN}✅ Certbot installed${NC}"
}

setup_nginx_ssl() {
    log "${BLUE}🔧 Setting up Nginx SSL configuration...${NC}"
    
    # Backup current configuration
    cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup"
    
    # Create SSL-ready Nginx configuration
    cat > "$NGINX_CONFIG" << EOF
# investogold SSL-Enabled Nginx Configuration

# Rate limiting zones
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=auth:10m rate=3r/s;
limit_req_zone \$binary_remote_addr zone=general:10m rate=30r/s;

# Connection limiting
limit_conn_zone \$binary_remote_addr zone=addr:10m;

# Upstream backend configuration
upstream investogold_backend {
    least_conn;
    server 127.0.0.1:5000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

# HTTP server (redirects to HTTPS)
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all HTTP traffic to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration (Let's Encrypt certificates will be added here)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';" always;
    
    # Rate limiting
    limit_req zone=general burst=50 nodelay;
    limit_conn addr 10;
    
    # Large client body size for file uploads
    client_max_body_size 10M;
    client_body_buffer_size 128k;
    
    # Timeout settings
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Security - Hide nginx version
    server_tokens off;
    
    # API routes with stricter rate limiting
    location /api/auth {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://investogold_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_buffering off;
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://investogold_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_buffering off;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "https://$DOMAIN" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://$DOMAIN";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization, X-Requested-With";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Max-Age 86400;
            return 204;
        }
    }
    
    # Static file serving with caching
    location /uploads/ {
        alias /var/www/investogold/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Next.js static files
    location /_next/static/ {
        proxy_pass http://investogold_backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://investogold_backend;
        access_log off;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Admin panel with additional security
    location /adminpanel {
        add_header X-Robots-Tag "noindex, nofollow" always;
        
        proxy_pass http://investogold_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # All other requests
    location / {
        proxy_pass http://investogold_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Enable caching for static content
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
            proxy_pass http://investogold_backend;
        }
    }
    
    # Block common attack patterns
    location ~* /(wp-admin|wp-login|admin|phpmyadmin|mysql|phpinfo) {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Block hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Custom error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /var/www/html;
    }
}
EOF
    
    log "${GREEN}✅ Nginx SSL configuration created${NC}"
}

obtain_ssl_certificate() {
    log "${BLUE}🔐 Obtaining SSL certificate...${NC}"
    
    # Stop Nginx temporarily for standalone certificate
    systemctl stop nginx
    
    # Obtain certificate
    certbot certonly \
        --standalone \
        --agree-tos \
        --no-eff-email \
        --email "$EMAIL" \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"
    
    # Start Nginx
    systemctl start nginx
    
    log "${GREEN}✅ SSL certificate obtained${NC}"
}

setup_auto_renewal() {
    log "${BLUE}🔄 Setting up automatic certificate renewal...${NC}"
    
    # Create renewal hook script
    cat > /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF
    
    chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh
    
    # Test automatic renewal
    certbot renew --dry-run
    
    log "${GREEN}✅ Automatic renewal configured${NC}"
}

update_application_config() {
    log "${BLUE}⚙️ Updating application configuration for SSL...${NC}"
    
    # Update environment variables for HTTPS
    cd /var/www/investogold
    
    # Update .env file
    sed -i "s|BASE_URL=.*|BASE_URL=https://$DOMAIN|g" .env
    sed -i "s|ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN|g" .env
    
    # Restart application
    pm2 restart investogold
    
    log "${GREEN}✅ Application updated for HTTPS${NC}"
}

verify_ssl_setup() {
    log "${BLUE}🧪 Verifying SSL setup...${NC}"
    
    # Test Nginx configuration
    nginx -t
    systemctl reload nginx
    
    # Wait for services to start
    sleep 5
    
    # Test HTTPS connection
    if curl -sf "https://$DOMAIN/health" > /dev/null; then
        log "${GREEN}✅ HTTPS is working correctly${NC}"
    else
        log "${RED}❌ HTTPS test failed${NC}"
        return 1
    fi
    
    # Test SSL certificate
    SSL_EXPIRY=$(openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
    log "${GREEN}✅ SSL certificate valid until: $SSL_EXPIRY${NC}"
    
    # Test SSL rating
    log "${BLUE}🔍 SSL configuration analysis...${NC}"
    log "${YELLOW}Visit https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN for detailed SSL analysis${NC}"
}

main() {
    log "${CYAN}🔐 Starting SSL setup for investogold...${NC}"
    
    if check_prerequisites; then
        install_certbot
        setup_nginx_ssl
        obtain_ssl_certificate
        setup_auto_renewal
        update_application_config
        verify_ssl_setup
        
        log "${GREEN}🎉 SSL setup completed successfully!${NC}"
        log "${GREEN}Your application is now available at:${NC}"
        log "${GREEN}• https://$DOMAIN${NC}"
        log "${GREEN}• https://www.$DOMAIN${NC}"
        log "${GREEN}• Admin Panel: https://$DOMAIN/adminpanel${NC}"
        
    else
        log "${YELLOW}⚠️ Skipping SSL setup - no domain configured${NC}"
        log "${YELLOW}Your application remains available at:${NC}"
        log "${YELLOW}• http://$(curl -s ifconfig.me):5000${NC}"
        log "${YELLOW}• Admin Panel: http://$(curl -s ifconfig.me):5000/adminpanel${NC}"
    fi
}

# Print usage if --help is passed
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    print_usage
fi

# Run main function
main "$@"