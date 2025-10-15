const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const TeamUser = sequelize.define(
  "TeamUser",
  {
    team_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "teams", // FK: teams.id
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users", // FK: users.id
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "team_users",
    timestamps: false,
    underscored: true,
  }
);

module.exports = TeamUser;
