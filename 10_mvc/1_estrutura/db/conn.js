const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodemvc", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

try {
  sequelize.authenticate();
  console.log("Conectamos ao MySQL");
} catch (err) {
  console.log(`Não foi possível conectar:`, err);
}

module.exports = sequelize;
