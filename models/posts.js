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
      // db.Post.belongsTo(db.User, { foreignKey: "userId", targetKey: "userId" });
      // db.Post.hasMany(db.Comment, {
      //   foreignKey: "postId",
      //   sourceKey: "postId",
      // });
      this.belongsTo(models.Users);
      this.hasMany(models.Comments);
      this.hasMany(models.Likes);
    }
  }
  Posts.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
