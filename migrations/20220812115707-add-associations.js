"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users", // Users 모델에서
        key: "userId", // 그 아이디 값을 참고합니다.
      },
      // onUpdate: "CASCADE",
      // onDelete: "SET NULL",
    });

    await queryInterface.addColumn("Comments", "postId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Posts",
        key: "postId",
      },
      // onUpdate: "CASCADE",
      // onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "Posts", // name of Source model
      "userId" // key we want to remove
    );
  },
};
