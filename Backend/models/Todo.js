const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, // Team Todo인 경우에는 얘는 null
    },
    team_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, // Personal Todo인 경우에는 얘는 null
    },
  },
  {
    tableName: "todos",
    timestamps: true, // createdAt, updatedAt 자동 생성
    underscored: true, // created_at 같은 스네이크 케이스 컬럼
  }
);

module.exports = Todo;
