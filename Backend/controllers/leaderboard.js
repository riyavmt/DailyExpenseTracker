const mongoose = require("mongoose");
const Expenses = require("../models/expense");
const User = require("../models/user");
;

exports.showLeaderboard = async(req,res)=>{
    try{
        const results = await User.find({})
        .select('name totalExpense')
        .sort({totalExpense:-1})
        .exec();
        console.log("The results are",results);
        res.json(results);
    }
    catch(err){
        console.log(err);
    }
}

