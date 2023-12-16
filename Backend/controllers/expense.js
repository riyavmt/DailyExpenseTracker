const Expenses = require("../models/expense");
const User = require("../models/user");

exports.postAddExpense = async(req,res)=>{    //As soon as the user clicks on add expense btn, the post request is sent, 
    try{
        const expenseData = await Expenses.create({...req.body,userId :req.user.userId}); //the new expense record is created using the data in the request
        res.json(expenseData); //and sent as a response in the JSON format.
    }
    catch(err){
        console.log(err);
    }
}

exports.getAddExpense = async(req,res)=>{
    try{
        const user = await User.findByPk(req.user.userId);
        const expenseList = await Expenses.findAll({where:{userId:req.user.userId}}); //everytime the page reloads, get request is sent, and using findAll method, where thr userId matches with the userId in the req object,all the expenses in the list is retrieved
        console.log(user.premium_user);
        // const expenseList = await req.user.getExpenses();
        //console.log(expenseList);
        res.json({"ExpenseList":expenseList,"premiumUser":user.premium_user}); //and sent as a response in the JSON format
    }
    catch(err){
        console.log(err);
    }
}

exports.deleteExpense = async(req,res)=>{
    try{
        const id = req.params.id; //when the user clicks on del button, a del req is sent with the id as a param,we extract it here
    const expense = await Expenses.findByPk(id);//using the id, we retrieve the record that needs to be deleted
    expense.destroy();//once its retrieved, its removed from the db using destroy
    res.sendStatus(200);
    }
    catch(err){
        console.log(err)
    }
}

