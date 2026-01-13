const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createDatabase() {
  let connection;
  
  try {
    console.log('Connecting to MySQL server...');
    
    // Connect to MySQL server without specifying database
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Access@404',
      port: 3306
    });
    
    console.log('✓ Connected to MySQL server');
    
    // Create database if it doesn't exist
    console.log('Creating database "investogold_db"...');
    await connection.query('CREATE DATABASE IF NOT EXISTS `investogold_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✓ Database "investogold_db" created successfully');
    
    // Switch to the investogold_db database
    await connection.query('USE `investogold_db`');
    
    // Check if the users table exists and has data
      const [tableExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'investogold_db' AND table_name = 'users'
    `);    if (tableExists[0].count > 0) {
      // Check if admin user already exists
      const [adminExists] = await connection.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE email = 'admin@investogold.com' AND role = 'admin'
      `);
      
      if (adminExists[0].count === 0) {
        console.log('Creating default admin user...');
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        // Generate unique referral code
        const referralCode = 'ADMIN' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Insert admin user
        await connection.query(`
          INSERT INTO users (
            email, password, first_name, last_name, phone_number, role, 
            is_active, is_email_verified, referral_code, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          'admin@investogold.com',
          hashedPassword,
          'Admin',
          'User',
          '+1234567890',
          'admin',
          true,
          true,
          referralCode
        ]);
        
        console.log('✓ Default admin user created successfully');
        console.log('  Email: admin@investogold.com');
        console.log('  Password: admin123');
        console.log('  Role: admin');
      } else {
        console.log('✓ Admin user already exists');
      }
    } else {
      console.log('ℹ Users table not found. Run migrations first to create tables.');
    }
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createDatabase().then(() => {
    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  }).catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
}

module.exports = { createDatabase };