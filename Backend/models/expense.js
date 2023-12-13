const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expense = sequelize.define("expenses",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    amount:Sequelize.DOUBLE,
    description:Sequelize.STRING,
    category:Sequelize.STRING
})

module.exports = Expense;