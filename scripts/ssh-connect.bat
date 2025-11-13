@echo off
REM Windows batch script to setup database via SSH

echo ========================================
echo Investogold Database Setup via SSH
echo ========================================
echo.

set SERVER=72.61.144.187
set SSH_USER=root
set SSH_PASS=Asd@btc123456

echo Connecting to %SERVER%...
echo.

REM Option 1: Interactive SSH connection
echo Please run these commands after connecting:
echo.
echo mysql -u root -p
echo.
echo Then paste these SQL commands:
echo.
echo CREATE DATABASE IF NOT EXISTS investogold_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo GRANT ALL PRIVILEGES ON investogold_db.* TO 'btc_remote'@'%%';
echo GRANT CREATE ON *.* TO 'btc_remote'@'%%';
echo FLUSH PRIVILEGES;
echo SHOW GRANTS FOR 'btc_remote'@'%%';
echo EXIT;
echo.
echo ========================================
echo.
echo Connecting to server...
ssh %SSH_USER%@%SERVER%
