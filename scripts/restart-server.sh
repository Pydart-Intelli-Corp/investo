# Quick Server Restart Commands

# Run these commands on your VPS to fix the white screen issue:

echo "🔄 Restarting application to apply CSP fixes..."

# Restart PM2 processes
pm2 restart investogold

# Check if processes are running
pm2 status

# Check logs for any errors
pm2 logs investogold --lines 20

# Test the application
sleep 5
echo "🏥 Testing application..."
curl -I http://localhost:5000

echo "✅ Restart completed!"
echo "🌐 Visit: http://72.61.144.187:5000"
echo "🔧 Admin: http://72.61.144.187:5000/adminpanel"