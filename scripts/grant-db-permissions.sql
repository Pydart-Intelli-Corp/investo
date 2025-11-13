-- Grant all privileges on investogold_db to btc_remote user
-- Run this SQL script on your MySQL server

-- First, ensure the database exists
CREATE DATABASE IF NOT EXISTS `investogold_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Grant all privileges on the database to the btc_remote user
GRANT ALL PRIVILEGES ON `investogold_db`.* TO 'btc_remote'@'%';

-- Also grant CREATE DATABASE privilege if needed
GRANT CREATE ON *.* TO 'btc_remote'@'%';

-- Apply the changes
FLUSH PRIVILEGES;

-- Verify permissions
SHOW GRANTS FOR 'btc_remote'@'%';
