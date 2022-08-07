import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Attribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attribute.belongsTo(models.Collection, {
        foreignKey: "collectionId",
      });
    }
  }
  Attribute.init(
    {
      trait_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      probability: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      subtrait: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rarity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
      collectionId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Collections",
          key: "id",
        },
        allowNull: false,
        validate: {
          isInt: true,
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "Attribute",
    }
  );
  return Attribute;
};
