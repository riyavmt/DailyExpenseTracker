const Expenses = require("../models/expense");

exports.postAddExpense = async(req,res)=>{
    try{
        const expenseData = await Expenses.create({...req.body});
        res.json(expenseData);
    }
    catch(err){
        console.log(err);
    }
}

exports.getAddExpense = async(req,res)=>{
    try{
        const ExpenseList = await Expenses.findAll();
        res.json(ExpenseList);
    }
    catch(err){
        console.log(err);
    }
}

exports.deleteExpense = async(req,res)=>{
    try{
        const id = req.params.id;
    const expense = await Expenses.findByPk(id);
    expense.destroy();
    res.sendStatus(200);
    }
    catch(err){
        console.log(err)
    }
}