const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    totalExpense: {
        type:Number,
        default: 0
    },
    premium_user: {
        type:Boolean,
        default: false 
    }
});

module.exports = mongoose.model("User",userSchema)