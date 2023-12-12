const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Users = sequelize.define("users",{
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
});

module.exports = Users;