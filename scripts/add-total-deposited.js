const { sequelize } = require('../config/database');

async function addTotalDepositedColumn() {
  try {
    console.log('Adding total_deposited column to users table...');
    
    // Check if column already exists
    const [results] = await sequelize.query(`
      SHOW COLUMNS FROM users LIKE 'total_deposited';
    `);
    
    if (results.length > 0) {
      console.log('Column total_deposited already exists.');
      return;
    }
    
    // Add the column
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN total_deposited DECIMAL(15,2) DEFAULT 0.00 NOT NULL 
      COMMENT 'Total amount deposited by the user';
    `);
    
    console.log('✓ Successfully added total_deposited column to users table.');
    
  } catch (error) {
    console.error('❌ Failed to add total_deposited column:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the migration
addTotalDepositedColumn()
  .then(() => {
    console.log('Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });