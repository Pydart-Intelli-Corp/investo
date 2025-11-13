#!/bin/bash

# Investogold Database Setup Script
# This script creates the database and grants permissions

echo "🚀 Setting up Investogold Database..."
echo ""

# MySQL root password (you'll be prompted if not set here)
MYSQL_ROOT_PASS="Asd@btc123456"

# Database configuration
DB_NAME="investogold_db"
DB_USER="btc_remote"
DB_PASS="Asd@btc123456"

# Create database and grant permissions
mysql -u root -p"${MYSQL_ROOT_PASS}" << EOF
-- Create database
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Grant all privileges to btc_remote user
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';

-- Grant CREATE privilege
GRANT CREATE ON *.* TO '${DB_USER}'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Show databases
SHOW DATABASES LIKE '${DB_NAME}';

-- Show grants
SHOW GRANTS FOR '${DB_USER}'@'%';

EOF

echo ""
echo "✅ Database setup completed!"
echo ""
echo "Database: ${DB_NAME}"
echo "User: ${DB_USER}"
echo ""
