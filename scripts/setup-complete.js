#!/usr/bin/env node

/**
 * Investogold Database Setup and Migration Script
 * This script will:
 * 1. Create the database if it doesn't exist
 * 2. Run all migrations to create tables
 * 3. Seed initial data (admin user, wallets, portfolios)
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Investogold Database Setup...\n');

async function runCommand(command, description) {
  console.log(`\n📌 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log(`✅ ${description} completed successfully!\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed!`);
    console.error(error.message);
    return false;
  }
}

async function setupComplete() {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Database setup completed successfully!');
  console.log('='.repeat(60));
  
  console.log('\n📋 Summary:');
  console.log('   ✓ Database created: investogold_db');
  console.log('   ✓ Tables created and migrated');
  console.log('   ✓ Admin user created');
  console.log('   ✓ Sample data seeded');
  
  console.log('\n👤 Admin Login Credentials:');
  console.log('   Email: admin@investogold.com');
  console.log('   Password: Admin@Investogold2024');
  
  console.log('\n🔧 Next steps:');
  console.log('   1. Review .env file for configuration');
  console.log('   2. Start the server: npm start');
  console.log('   3. Access admin panel: http://72.61.144.187:5000/adminpanel');
  console.log('   4. Access user portal: http://72.61.144.187:5000');
  
  console.log('\n' + '='.repeat(60) + '\n');
}

async function main() {
  try {
    // Step 1: Create database
    const dbCreated = await runCommand(
      'node scripts/setup-database.js',
      'Step 1/2: Creating database'
    );
    
    if (!dbCreated) {
      console.error('\n❌ Database creation failed. Please check your connection settings.');
      process.exit(1);
    }

    // Small delay to ensure database is ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Run migrations
    const migrated = await runCommand(
      'node scripts/migrate.js',
      'Step 2/2: Running migrations and seeding data'
    );
    
    if (!migrated) {
      console.error('\n❌ Migration failed. Please check the error above.');
      process.exit(1);
    }

    // Display success message
    await setupComplete();
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
main();
