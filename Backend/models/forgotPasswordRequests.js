const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ForgotPasswordRequest = sequelize.define("forgotPasswordRequests",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    uuid: Sequelize.STRING,
    isActive:{
        type:Sequelize.BOOLEAN,
        defaultValue: true
    }
})

module.exports = ForgotPasswordRequest;