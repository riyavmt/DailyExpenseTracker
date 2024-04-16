const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForgotPasswordRequestSchema = new Schema({
    uuid:{
        type:String
    },
    isActive:{
        type:Boolean,
        default: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
})

module.exports = mongoose.model("ForgotPasswordRequest",ForgotPasswordRequestSchema)
// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const ForgotPasswordRequest = sequelize.define("forgotPasswordRequests",{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     uuid: Sequelize.STRING,
//     isActive:{
//         type:Sequelize.BOOLEAN,
//         defaultValue: true
//     }
// })

// module.exports = ForgotPasswordRequest;