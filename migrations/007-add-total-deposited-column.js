'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'total_deposited', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0.00,
      allowNull: false,
      comment: 'Total amount deposited by the user'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'total_deposited');
  }
};