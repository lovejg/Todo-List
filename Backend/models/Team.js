const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // description: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
    owner_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "teams",
    timestamps: true, // createdAt, updatedAt 자동 생성
    underscored: true, // created_at 같은 스네이크 케이스 컬럼
    paranoid: false,
  }
);

module.exports = Team;
