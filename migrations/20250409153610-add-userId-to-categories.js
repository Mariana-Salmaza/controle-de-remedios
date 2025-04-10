"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("categories", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users", // nome exato da tabela no banco de dados
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("categories", "userId");
  },
};
