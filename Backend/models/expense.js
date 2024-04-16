// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Expense = sequelize.define("expenses",{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     amount:Sequelize.DOUBLE,
//     description:Sequelize.STRING,
//     category:Sequelize.STRING
// })

// module.exports = Expense;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
     amount:{
        type:Number,
        required:true
     },
     description:{
        type:String,
        required:true
     },
     category:{
        type:String,
        required:true
     },
     userId:{type: Schema.Types.ObjectId,
      required:true}

})

module.exports = mongoose.model("Expense",expenseSchema)