const { Sequelize } = require("sequelize");
const Expenses = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");

exports.showLeaderboard = async(req,res)=>{
    try{
        const results = await User.findAll({
            attributes: [
                'name','totalExpense'
            ], 
            order: [['totalExpense','DESC']]
        });
        console.log("The results are",results);
        res.json(results);
    }
    catch(err){
        console.log(err);
    }
}

