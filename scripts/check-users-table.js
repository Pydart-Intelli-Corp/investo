const { sequelize } = require('../config/database');

async function checkUsersTable() {
  try {
    console.log('Checking users table structure...');
    
    // Get all columns from users table
    const [results] = await sequelize.query(`
      DESCRIBE users;
    `);
    
    console.log('Users table columns:');
    results.forEach(column => {
      console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to check users table:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the check
checkUsersTable()
  .then(() => {
    console.log('Check completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Check failed:', error);
    process.exit(1);
  });