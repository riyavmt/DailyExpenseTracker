const Expenses = require("../models/expense");
const User = require("../models/user");
const DownloadLogs = require("../models/downloadlogs");
const mongoose = require("mongoose");
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
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const expense = new Expenses({...req.body, userId:req.user._id}); //the new expense record is created using the data in the request
        // console.log(req.user,req.body);
        const userTotal = await User.findById(req.user._id);
        console.log(userTotal.totalExpense);
        let total = userTotal.totalExpense;
        console.log("total before adding"+total);
        total = total + +expense.amount; //+expense.amount converts string to a num
        console.log("total after adding"+ total);
        await User.findByIdAndUpdate(req.user._id,{totalExpense:total},)
          await expense.save();
          await session.commitTransaction();
        res.json(expense); //and sent as a response in the JSON format.

    }
    catch(err){
        await session.abortTransaction();
        console.log(err);
    }
    finally{
      session.endSession();
    }
}

exports.getAddExpense = async(req,res)=>{
  const page = +req.query.page || 1;
  const rows = +req.query.rows;
  try{
      const user = await User.findById(req.user._id);
      const expenseList = await Expenses.find({ userId: req.user._id })
        .skip((page - 1) * rows)
        .limit(rows);
      const count = await Expenses.countDocuments({userId:req.user._id}) //everytime the page reloads, get request is sent, and using findAll method, where thr userId matches with the userId in the req object,all the expenses in the list is retrieved
      // console.log(count);
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
    const session = await mongoose.startSession();
    session.startTransaction(); 
    try{
        const id = req.params.id; //when the user clicks on del button, a del req is sent with the id as a param,we extract it here
    const expense = await Expenses.findById(id);
    console.log(expense);
    const user = await User.findById(req.user._id);
    console.log('total before removing'+ user.totalExpense);
    let total = user.totalExpense;
    // console.log(expense.amount);
    total = total - expense.amount;
    console.log('total after removing'+ total);
    await User.findByIdAndUpdate(req.user._id,{totalExpense:total},{session})
    await Expenses.findByIdAndDelete({_id:req.params.id});//once its retrieved, its removed from the db using destroy
    await session.commitTransaction();

    res.sendStatus(200);
    }
    catch(err){
        await session.abortTransaction();
        console.log(err)
    }
    finally{
      await session.endSession()
    }
}
 exports.downloadExpense = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        const expenseList = await Expenses.find({userId:req.user._id});
        console.log(expenseList);
        const result = expenses.map(data => {
          const value ={
            Amount:data.amount,
            Description:data.description,
            category:data.category
          };
          return value;
        })
        console.log(result);
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
      const downloadLogs = await DownloadLogs.find({userId:req.user._id});
      res.json({"Downloads": downloadLogs});
    }
    catch(err){
        console.log(err);
      res.json({"Error": err})
    }
  }

  
  