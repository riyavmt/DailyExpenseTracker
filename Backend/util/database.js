const Sequelize = require("sequelize");
const schema = process.env.DATABASE_NAME;
const userSql = process.env.USER;
const password = process.env.PASSWORD;

const sequelize = new Sequelize(schema, userSql,password,{
    dialect: "mysql",
    host: process.env.HOSTNAME,
})

module.exports = sequelize;
