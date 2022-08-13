"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     

      this.hasMany(models.Posts,{
        foreignKey: "userId",
        sourceKey: "userId",
    });
      this.hasMany(models.Comments,{
        foreignKey: "userId",
        sourceKey: "userId",
    });
      this.hasMany(models.Likes,{
        foreignKey: "userId",
        sourceKey: "userId",
    });
    }
  }
  Users.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      loginId: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
