"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    
      this.belongsTo(models.Users,{
        foreignKey: "userId",
        targetKey: "userId",
    });
      this.hasMany(models.Comments,{
        foreignKey: "postId",
        sourceKey: "postId",
    });
      this.hasMany(models.Likes,{
        foreignKey: "postId",
        sourceKey: "postId",
    });
    }
  }
  Posts.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: 0,
      },
      title: DataTypes.STRING,
      images: DataTypes.STRING,
      content: DataTypes.STRING,
      category: DataTypes.STRING,
      likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );
  return Posts;
};
