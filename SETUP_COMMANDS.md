# Database Setup Commands - Run on Server

You are now connected to: root@72.61.144.187

## Step 1: Connect to MySQL
```bash
mysql -u root -p
```
(Enter your MySQL root password when prompted)

## Step 2: Run these SQL commands one by one:

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS investogold_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant all privileges to btc_remote user
GRANT ALL PRIVILEGES ON investogold_db.* TO 'btc_remote'@'%';

-- Grant CREATE privilege
GRANT CREATE ON *.* TO 'btc_remote'@'%';

-- Apply the changes
FLUSH PRIVILEGES;

-- Verify the database was created
SHOW DATABASES LIKE 'investogold%';

-- Verify the permissions
SHOW GRANTS FOR 'btc_remote'@'%';

-- Exit MySQL
EXIT;
```

## Step 3: Exit SSH
```bash
exit
```

## Step 4: Return to Local Machine and Run Setup
```bash
# Test the connection
node scripts/setup-database.js

# Run migrations
npm run db:migrate

# Or run complete setup
npm run setup
```

---

## Quick Copy-Paste Version (All SQL commands at once):

After running `mysql -u root -p`, paste all these:

```sql
CREATE DATABASE IF NOT EXISTS investogold_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON investogold_db.* TO 'btc_remote'@'%';
GRANT CREATE ON *.* TO 'btc_remote'@'%';
FLUSH PRIVILEGES;
SHOW DATABASES LIKE 'investogold%';
SHOW GRANTS FOR 'btc_remote'@'%';
EXIT;
```
