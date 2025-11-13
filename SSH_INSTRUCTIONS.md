# SSH Connection and Database Permission Setup

## Server Details
- **Host:** 72.61.144.187
- **Username:** root
- **Password:** Asd@btc123456

## Step 1: Connect to Server via SSH

### From Windows PowerShell:
```powershell
ssh root@72.61.144.187
# Enter password when prompted: Asd@btc123456
```

### From Windows Command Prompt:
```cmd
ssh root@72.61.144.187
```

## Step 2: Once Connected, Grant Database Permissions

### Option A: Run MySQL Commands Directly
```bash
# Connect to MySQL as root
mysql -u root -p

# Then run these SQL commands:
```

```sql
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `investogold_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Grant all privileges to btc_remote user
GRANT ALL PRIVILEGES ON `investogold_db`.* TO 'btc_remote'@'%';

-- Grant CREATE DATABASE privilege
GRANT CREATE ON *.* TO 'btc_remote'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify permissions
SHOW GRANTS FOR 'btc_remote'@'%';

-- Exit MySQL
EXIT;
```

### Option B: Run SQL Script
```bash
# Upload and run the SQL script
mysql -u root -p < /path/to/grant-db-permissions.sql
```

## Step 3: Verify Connection from Local Machine

After granting permissions, exit SSH and run from your local machine:

```bash
# Test database connection
node scripts/setup-database.js
```

## Step 4: Run Migrations

Once the database is created successfully:

```bash
# Run migrations
npm run db:migrate

# Or run complete setup
npm run setup
```

## Alternative: One-Line Command via SSH

You can run the SQL commands without interactive login:

```bash
ssh root@72.61.144.187 "mysql -u root -p -e \"CREATE DATABASE IF NOT EXISTS investogold_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; GRANT ALL PRIVILEGES ON investogold_db.* TO 'btc_remote'@'%'; FLUSH PRIVILEGES;\""
```

## Troubleshooting

### If btc_remote user doesn't exist:
```sql
-- Create the user first
CREATE USER 'btc_remote'@'%' IDENTIFIED BY 'Asd@btc123456';

-- Then grant privileges
GRANT ALL PRIVILEGES ON `investogold_db`.* TO 'btc_remote'@'%';
FLUSH PRIVILEGES;
```

### Check existing users:
```sql
SELECT User, Host FROM mysql.user WHERE User = 'btc_remote';
```

### Check current database:
```sql
SHOW DATABASES LIKE 'investogold%';
```

## Database Configuration Summary

- **Database Name:** investogold_db
- **Database User:** btc_remote
- **Database Password:** Asd@btc123456
- **Database Host:** 72.61.144.187
- **Database Port:** 3306
- **Character Set:** utf8mb4
- **Collation:** utf8mb4_unicode_ci
