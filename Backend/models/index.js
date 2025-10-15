const User = require("./User");
const Team = require("./Team");
const TeamUser = require("./TeamUser");
const Todo = require("./Todo");

// User : Team = N : M
User.belongsToMany(Team, { through: TeamUser, foreignKey: "user_id" });
Team.belongsToMany(User, { through: TeamUser, foreignKey: "team_id" });

// User : Todo = 1 : N
User.hasMany(Todo, { foreignKey: "user_id" });
Todo.belongsTo(User, { foreignKey: "user_id" });

// Team : Todo = 1 : N
Team.hasMany(Todo, { foreignKey: "team_id" });
Todo.belongsTo(Team, { foreignKey: "team_id" });

// Team : User = 1 : N (Team의 소유자/owner)
Team.belongsTo(User, { foreignKey: "owner_id" });
User.hasMany(Team, { foreignKey: "owner_id" });

module.exports = {
  User,
  Team,
  TeamUser,
  Todo,
  initModels,
};
