const Expenses = require("../models/expense");
const User = require("../models/user");
const DownloadLogs = require("../models/downloadlogs");
const sequelize = require("../util/database");
const jwt= require("jsonwebtoken");
const AWS = require("aws-sdk");

async function uploadToS3(data,fileName){
    const BUCKET = 'dailyexpensetracker';
    const IAM_USER_KEY = process.env.IAM_ACCESSKEY;
    const IAM_SECRET_KEY = process.env.IAM_SECRETKEY;
    console.log("access id "+IAM_USER_KEY)
    console.log("secret id "+IAM_SECRET_KEY)
    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_SECRET_KEY,
        // bucket: BUCKET
    })
    let params ={
        Bucket : BUCKET,
        Key:fileName,
        Body: data,
        ACL: 'public-read'
      }
      return new Promise((resolve,reject)=>{
        s3Bucket.upload(params , (err,res) =>{
          if(err) reject(err);
          else {
            console.log(res);
            resolve(res.Location);
          }
        })
      })
     }

exports.postAddExpense = async(req,res)=>{
    const t = await sequelize.transaction();    //As soon as the user clicks on add expense btn, the post request is sent, 
    try{
        const expenseData = await Expenses.create({...req.body,userId :req.user.userId},{transaction:t}); //the new expense record is created using the data in the request
        // console.log(req.user,req.body);
        const userTotal = await User.findByPk(req.user.userId);
        console.log(userTotal.totalExpense);
        let total = userTotal.totalExpense;
        console.log("total before adding"+total);
        total = total + +expenseData.amount;
        console.log("total after adding"+ total);
        await User.update(
            {totalExpense:total},
              {where:{id:req.user.userId},transaction:t}
              
          )
          await t.commit();
        res.json(expenseData); //and sent as a response in the JSON format.

    }
    catch(err){
        await t.rollback();
        console.log(err);
    }
}

exports.getAddExpense = async(req,res)=>{
  const page = +req.query.page || 1;
  const rows = +req.query.rows;
  try{
      const user = await User.findByPk(req.user.userId);
      const expenseList = await Expenses.findAll({
        where: { userId: req.user.userId },
        offset: (page - 1) * rows,
        limit: rows,
      });
      const count = await Expenses.count({where:{userId:req.user.userId}}) //everytime the page reloads, get request is sent, and using findAll method, where thr userId matches with the userId in the req object,all the expenses in the list is retrieved
      console.log(count);
      // const expenseList = await req.user.getExpenses();
      console.log(expenseList);
      res.json({"ExpenseList":expenseList,"premiumUser":user.premium_user,pageData: {
        currentPage: page,
        hasNextPage: rows * page < count,
        nextPage: page+1,
        hasPreviousPage: page > 1,
        previousPage: page - 1
    }}); //and sent as a response in the JSON format
  }
  catch(err){
      console.log(err);
  }
}

exports.deleteExpense = async(req,res)=>{
    const t = await sequelize.transaction();
    try{
        const id = req.params.id; //when the user clicks on del button, a del req is sent with the id as a param,we extract it here
    const expense = await Expenses.findByPk(id);
    const user = await User.findByPk(req.user.userId);
    console.log('total before removing'+ user.totalExpense);
    let total = user.totalExpense;
    // console.log(expense.amount);
    total = total - expense.amount;
    console.log('total after removing'+ total);
    await User.update(
        {totalExpense:total},
          {where:{id:req.user.userId},transaction:t}
          
      )
    await expense.destroy({transaction:t});//once its retrieved, its removed from the db using destroy
    await t.commit();

    res.sendStatus(200);
    }
    catch(err){
        await t.rollback();
        console.log(err)
    }
}
 exports.downloadExpense = async(req,res)=>{
    try{
        const user = await User.findByPk(req.user.userId);
        const expenseList = await Expenses.findAll({where:{userId:req.user.userId}});
        console.log(expenseList);
        const stringifiedExpense = JSON.stringify(expenseList);
        console.log("stringifiedExpense"+stringifiedExpense);
        const userId = req.user.userId;
        const date = new Date()
        const fileName = `Expense/${userId}/${date}.txt`;
        console.log("fileName",fileName)
        const fileUrl = await uploadToS3(stringifiedExpense,fileName);
        await DownloadLogs.create({fileUrl:fileUrl , userId :req.user.userId, date:JSON.stringify(date)});
        res.json(fileUrl);
        // console.log("fileUrl",fileUrl);
        // res.json({fileUrl,success:true})
        // const expenses = await req.user.getExpenses();
        // console.log(expenses);
    }
    catch(err){
        console.log(err);
    }
 }

 exports.showDownloads = async (req,res) =>{
    try{
      const downloadLogs = await DownloadLogs.findAll({where:{userId:req.user.userId}});
      res.json({"Downloads": downloadLogs});
    }
    catch(err){
        console.log(err);
      res.json({"Error": err})
    }
  }

  
  