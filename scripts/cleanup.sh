#!/bin/bash

# investogold Project Cleanup Script
# This script helps maintain a clean project structure

echo "🧹 investogold Project Cleanup"
echo "=========================="

# Clear logs but keep directory structure
echo "📝 Cleaning log files..."
rm -f logs/*.log 2>/dev/null || true
echo "✅ Log files cleared"

# Clear Next.js build cache
echo "🔄 Clearing Next.js cache..."
rm -rf .next 2>/dev/null || true
echo "✅ Next.js cache cleared"

# Clear node_modules if requested
if [ "$1" = "--full" ]; then
    echo "📦 Removing node_modules..."
    rm -rf node_modules 2>/dev/null || true
    echo "✅ node_modules removed"
    echo "💡 Run 'npm install' to reinstall dependencies"
fi

# Clear upload files but keep directory structure
echo "📁 Cleaning upload directory..."
find uploads -type f ! -name '.gitkeep' -delete 2>/dev/null || true
echo "✅ Upload files cleared"

# Clear temporary files
echo "🗑️  Removing temporary files..."
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name "*.temp" -delete 2>/dev/null || true
find . -name "*.swp" -delete 2>/dev/null || true
find . -name "*.swo" -delete 2>/dev/null || true
echo "✅ Temporary files removed"

# Check for large files
echo "📊 Checking for large files (>10MB)..."
find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*" | head -5

echo ""
echo "✨ Cleanup completed!"
echo ""
echo "💡 Usage:"
echo "  ./scripts/cleanup.sh       # Basic cleanup"
echo "  ./scripts/cleanup.sh --full # Full cleanup including node_modules"