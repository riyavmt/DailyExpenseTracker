const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("orders",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    paymentId:Sequelize.STRING,
    orderId:Sequelize.STRING,
    status:Sequelize.STRING
})

module.exports = Order;
