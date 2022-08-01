export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Attributes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      trait_type: {
        type: Sequelize.STRING,
      },
      probability: {
        type: Sequelize.DECIMAL(10, 2),
      },
      subtrait: {
        type: Sequelize.STRING,
      },
      rarity: {
        type: Sequelize.DECIMAL(10, 2),
      },
      collectionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Collections",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Attributes");
  },
};
