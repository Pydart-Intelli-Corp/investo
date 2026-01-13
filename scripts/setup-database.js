const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Access@404',
};

const DB_NAME = process.env.DB_NAME || 'investogold_db';

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL server...');
    console.log(`Host: ${DB_CONFIG.host}`);
    console.log(`User: ${DB_CONFIG.user}`);
    
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to MySQL server successfully!');

    // Check if database exists
    console.log(`\n🔍 Checking if database '${DB_NAME}' exists...`);
    const [databases] = await connection.query(
      `SHOW DATABASES LIKE '${DB_NAME}'`
    );

    if (databases.length > 0) {
      console.log(`⚠️  Database '${DB_NAME}' already exists.`);
      console.log('   Skipping database creation.');
    } else {
      // Create database
      console.log(`\n📦 Creating database '${DB_NAME}'...`);
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` 
         CHARACTER SET utf8mb4 
         COLLATE utf8mb4_unicode_ci`
      );
      console.log(`✅ Database '${DB_NAME}' created successfully!`);
    }

    // Verify database exists
    await connection.query(`USE \`${DB_NAME}\``);
    console.log(`✅ Using database '${DB_NAME}'`);

    console.log('\n✨ Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run migrations: npm run migrate');
    console.log('   2. Seed admin data: node scripts/seed-admin-wallets.js');
    console.log('   3. Start server: npm start');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Please check:');
      console.error('   - MySQL server is running');
      console.error('   - Host and port are correct');
      console.error('   - Firewall allows connections');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Please check:');
      console.error('   - Username and password are correct');
      console.error('   - User has proper permissions');
      console.error('   - User can connect from your IP address');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database error. Please verify database name.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed.');
    }
  }
}

// Run the setup
setupDatabase();
