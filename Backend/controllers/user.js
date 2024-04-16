const jwt= require("jsonwebtoken");
const Users = require("../models/user");
const ForgotPasswordRequest = require("../models/forgotPasswordRequests");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const ForgotPasswordRequests = require("../models/forgotPasswordRequests");



exports.postSignup = async(req,res)=>{
    const password = req.body.password; //when the user clicks on signup btn, post req is received along with the data, we retrieve the password from the req body
    try{
        const userData = await Users.findOne({email:req.body.email}); //we are trying to check if the email in the req body matches with any email in the User model db.
        if(!userData){ //If its not in the db , we will hash the password using bcrypt and create the account
            const saltRounds = 10;  //no. of times of Randomization of the string
            bcrypt.hash(password,saltRounds,async(err,hash)=>{
                if(err){console.log(err)}
                else{
                    const newUser = new Users({name:req.body.name, email: req.body.email, password:hash});
                    await newUser.save();
                     //once the password is hashed, new user record is created using the data in the req body
                    res.json({user: newUser,message:"Account Created Successfully!"}) //response is sent in the JSON format.
                }
            })
        }
        else{
            res.json({message:"Email already in use!",userFound:true}); //If the email is already in the db, we will send userforund true msg in the res which will go 

        }
    }
    catch(err){
        console.log(err);
    }
}

const secretKey = process.env.JWT_SECRET


function generateToken(_id,name){
    return jwt.sign({_id,name:name},secretKey)
}



exports.postLogin = async(req,res)=>{  //when the user clicks on login btn, a post req is received along with the data in the form
    try{
        const userDetails = await Users.findOne({email:req.body.email});// using the email in the req body, we try to find if the record of the email is in the db
        //console.log(userDetails,userDetails.password);
        if(userDetails){ //if the record is there, we will now check with the password
            const userPassword = userDetails.password;  //retrieving the password from the record present
           bcrypt.compare(req.body.password,userPassword, (err,result)=>{ //now we will compare the password in the req body with the hashed password
                //console.log(result);
                if(err){
                    throw new err("Something went wrong")
                }
                if(result===true){ //if the result is true, means the password is correct
                    res.json({message:"Successfully logged in.",userDetails:true, token: generateToken(userDetails._id,userDetails.name),premium:userDetails.premium_user}); //and the response is sent
                }
                else{
                    res.json({message:"Incorrect Password!"});//else the error msg is sent
                }
            
            })
        }
        else{
            res.json({message:"Invalid Email/Password"}) //if the email doesnt match, the error msg is sent
        }
    }
    catch(err){
        console.log(err)
    }
} 

exports.forgotPassword = async (req,res) =>{
    const uuid = uuidv4();//unique Id generated from the uuid
    const client = Sib.ApiClient.instance; //creating an instance of sendinblue API client
    var apiKey = client.authentications['api-key']; //accessing the API Key authentication
    apiKey.apiKey = process.env.API_KEY; //from the env file

    const apiInstance = new Sib.TransactionalEmailsApi(); //creating instance of transactional email API

    let sendSmtpEmail = new Sib.SendSmtpEmail(); //creating instance of sendSmtp email
    const sender ={email: 'riyavmt14@gmail.com'}; //setting the sender email id
    sendSmtpEmail = {
        sender,
        to: [{
            email: req.body.email//setting the receiver email id
        }], 
        subject : 'Password Reset Link',//subject of the email
        HTMLContent: `<html><head></head><body><a  href="http://localhost:3000/reset-password/${uuid}">Click to reset your password</a>`//link with uuid in the html content of the email
    };
    try {
        const user = await Users.findOne({email:req.body.email});//find the email
        // console.log("User: "+user.dataValues.id)
        const uid = new ForgotPasswordRequest({uuid:uuid,userId:user._id})//create a db in the sql 
        await uid.save();
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail); //sending the email along withe data
      res.json("Email sent Successfully!")
      
    } catch (error) {
      console.log(error);
    }

  }

  exports.resetPassword = async(req,res)=>{
    const uuid = req.params.uuid; //accessing uuid from the URL in the email link
    console.log("uuid is "+uuid);
    try{
        // res.sendFile(path.join(__dirname,'../../Frontend','User','resetPassword.html'))
        const result = await ForgotPasswordRequest.findOne({ uuid : uuid }); //find the uuid
        console.log("Result"+result);
        if(result&&result.isActive){
            res.sendFile(path.join(__dirname,'../../Frontend','User','resetPassword.html'))
        }
        else{
            const htmlContent = `<html><head></head><body><h1>This Link has already been used.</h1><a href="http://localhost:3000/forgotPassword.html">Click here to reset password</body></html>`;
            res.send(htmlContent);    
          }
    }
    catch(err){
        console.log(err)
    }
  }
  exports.updatePassword = async(req,res)=>{
    const password = req.body.password; //set a new password
    // console.log("Password"+password);
    const saltRounds=10;
    const result = await ForgotPasswordRequest.findOne({uuid:req.body.uuid});
    console.log("result"+result.userId);
    const user = await Users.findById({_id:result.userId});
    bcrypt.hash(password,saltRounds,async(err,hash)=>{//hashing the password using bcrypt
        if(err){console.log(err)}
    
        try{
            await Users.findByIdAndUpdate({_id:result.userId},{password: hash})//updating the password 
            const UpdateUserId = await ForgotPasswordRequest.findOne({userId:result.userId});
            await UpdateUserId.updateOne({isActive:false})
            console.log('Password updated');
        } 
        catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error occurred while updating the password.' });
        }
    }) 
}