# investogold Project Cleanup Script (PowerShell)
# This script helps maintain a clean project structure

Write-Host "🧹 investogold Project Cleanup" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

# Clear logs but keep directory structure
Write-Host "📝 Cleaning log files..." -ForegroundColor Yellow
Get-ChildItem -Path "logs\*.log" -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Host "✅ Log files cleared" -ForegroundColor Green

# Clear Next.js build cache
Write-Host "🔄 Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}
Write-Host "✅ Next.js cache cleared" -ForegroundColor Green

# Clear node_modules if requested
if ($args[0] -eq "--full") {
    Write-Host "📦 Removing node_modules..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ node_modules removed" -ForegroundColor Green
    Write-Host "💡 Run 'npm install' to reinstall dependencies" -ForegroundColor Blue
}

# Clear upload files but keep directory structure
Write-Host "📁 Cleaning upload directory..." -ForegroundColor Yellow
Get-ChildItem -Path "uploads\*" -Exclude ".gitkeep" -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Host "✅ Upload files cleared" -ForegroundColor Green

# Clear temporary files
Write-Host "🗑️  Removing temporary files..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Include "*.tmp", "*.temp", "*.swp", "*.swo" -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Host "✅ Temporary files removed" -ForegroundColor Green

# Check for large files
Write-Host "📊 Checking for large files (>10MB)..." -ForegroundColor Yellow
$largeFiles = Get-ChildItem -Recurse -File | Where-Object { $_.Length -gt 10MB -and $_.FullName -notmatch "node_modules|\.git" } | Select-Object -First 5
if ($largeFiles) {
    $largeFiles | ForEach-Object { Write-Host "  $($_.FullName) - $([math]::Round($_.Length/1MB, 2)) MB" }
} else {
    Write-Host "  No large files found" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Cleanup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Usage:" -ForegroundColor Blue
Write-Host "  .\scripts\cleanup.ps1       # Basic cleanup" -ForegroundColor Gray
Write-Host "  .\scripts\cleanup.ps1 --full # Full cleanup including node_modules" -ForegroundColor Gray