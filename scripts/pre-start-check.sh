#!/bin/bash

# Pre-start health check script for investogold
# This script runs before PM2 starts the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "${BLUE}🔍 Running pre-start health checks...${NC}"

# Check if MySQL is running
if ! systemctl is-active --quiet mysql; then
    log "${RED}❌ MySQL is not running${NC}"
    exit 1
fi

log "${GREEN}✅ MySQL is running${NC}"

# Check if required environment variables are set
if [ -z "$NODE_ENV" ]; then
    log "${YELLOW}⚠️ NODE_ENV not set, defaulting to production${NC}"
    export NODE_ENV=production
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    log "${RED}❌ .env file not found${NC}"
    exit 1
fi

log "${GREEN}✅ Environment configuration found${NC}"

# Check available disk space (require at least 1GB)
AVAILABLE_SPACE=$(df . | awk 'NR==2{print $4}')
if [ "$AVAILABLE_SPACE" -lt 1048576 ]; then # 1GB in KB
    log "${RED}❌ Insufficient disk space: ${AVAILABLE_SPACE}KB available${NC}"
    exit 1
fi

log "${GREEN}✅ Sufficient disk space available${NC}"

# Check if port 5000 is available
if netstat -tuln | grep -q ":5000 "; then
    log "${YELLOW}⚠️ Port 5000 is already in use${NC}"
    # Don't exit here as PM2 might be restarting
fi

# Test database connection
log "${BLUE}🗄️ Testing database connection...${NC}"
node -e "
const { sequelize } = require('./config/database');
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
" || exit 1

# Check if logs directory exists
mkdir -p logs
log "${GREEN}✅ Logs directory ready${NC}"

log "${GREEN}🎉 All pre-start checks passed!${NC}"
exit 0