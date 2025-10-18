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

// User(Owner) : Team = 1 : N (owner가 따로 있기 때문에 이것도 따로 세팅해주는거임)
Team.belongsTo(User, { foreignKey: "owner_id" });
User.hasMany(Team, { foreignKey: "owner_id" });

module.exports = {
  User,
  Team,
  TeamUser,
  Todo,
};
