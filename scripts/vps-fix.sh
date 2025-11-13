# Quick Fix Script for VPS
# Run this on your VPS to fix CORS and CSP issues

echo "🔧 Applying fixes for CORS and CSP issues..."

cd /var/www/investogold

# Backup current server.js
cp server.js server.js.backup

# Fix CORS configuration - make it more permissive for production
sed -i 's/callback(new Error('\''Not allowed by CORS'\''));/console.log("CORS: Allowing origin:", origin); callback(null, true);/g' server.js

# Ensure helmet CSP is disabled (replace the entire helmet section)
sed -i '/app\.use(helmet(/,/}));/c\
app.use(helmet({\
  contentSecurityPolicy: false,\
  crossOriginEmbedderPolicy: false,\
  crossOriginOpenerPolicy: false,\
  crossOriginResourcePolicy: false\
}));' server.js

echo "✅ Configuration updated!"

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart investogold

# Wait a moment
sleep 3

# Test the fix
echo "🧪 Testing the fixes..."
curl -I http://localhost:5000 | head -10

echo "📊 PM2 Status:"
pm2 status

echo "✅ Fix applied! Test your application at http://72.61.144.187:5000"