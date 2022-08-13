"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Posts,{
        foreignKey: "postId",
        targetKey: "postId",
      });
      this.belongsTo(models.Users,{
        foreignKey: "userId",
        targetKey: "userId",
      });
    }
  }
  Likes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "Likes",
    }
  );
  return Likes;
};
