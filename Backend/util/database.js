const Sequelize = require("sequelize");
const sequelize = new Sequelize("expense-manager","root","Mysqlnode147*",{
    dialect: "mysql",
    host: "localhost"
});

module.exports = sequelize;