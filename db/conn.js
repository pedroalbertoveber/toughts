const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("toughts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectou ao banco de dados!");
} catch(err) {
  console.log("Não foi possível conectar ao banco de dados: ", err);
}

module.exports = sequelize;