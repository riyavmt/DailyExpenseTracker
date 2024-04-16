const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    paymentId:{
        type:String
    },
    orderId:{
        type:String
    },
    status:{
        type:String
    },
    userId:{
        type:Schema.Types.ObjectId
    }
})

module.exports = mongoose.model("Order",OrderSchema);



// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Order = sequelize.define("orders",{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     paymentId:Sequelize.STRING,
//     orderId:Sequelize.STRING,
//     status:Sequelize.STRING
// })

// module.exports = Order;
