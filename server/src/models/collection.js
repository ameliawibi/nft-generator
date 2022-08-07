import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Collection.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Collection.hasMany(models.Attribute, {
        foreignKey: "collectionId",
      });
    }
  }
  Collection.init(
    {
      collectionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
        validate: {
          isInt: true,
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      isNFTGenerated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: "Collection",
    }
  );
  return Collection;
};
