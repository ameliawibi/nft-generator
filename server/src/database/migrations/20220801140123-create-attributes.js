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
        allowNull: false,
      },
      probability: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      subtrait: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rarity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      collectionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Collections",
          key: "id",
        },
        allowNull: false,
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
