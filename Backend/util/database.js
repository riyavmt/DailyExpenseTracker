const Sequelize = require("sequelize");
const schema = process.env.DATABASE_NAME;
const userSql = process.env.USER;
const password = process.env.PASSWORD;

const sequelize = new Sequelize(schema, userSql,password,{
    dialect: "mysql",
    host: "localhost"
})

module.exports = sequelize;