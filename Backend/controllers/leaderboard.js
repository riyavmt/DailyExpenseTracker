const { Sequelize } = require("sequelize");
const Expenses = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");

exports.showLeaderboard = async(req,res)=>{
    try{
        const results = await User.findAll({
            attributes: [
                'id','name',[Sequelize.fn('SUM',Sequelize.col('amount')),'totalExpense']
            ],
            include:[
                {model:Expenses,attributes:[]}
            ], 
            group: 'userId',
            order: [['totalExpense','DESC']]
        });
        res.json(results);
    }
    catch(err){
        console.log(err);
    }
}