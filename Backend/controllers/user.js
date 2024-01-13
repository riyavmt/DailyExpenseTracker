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
    const password = req.body.password; //when the user clicks on signup btn, post req is sent along with the data, we retrieve the password from the req body
    try{
        const userData = await Users.findOne({where:{email:req.body.email}}); //we are trying to check if the email in the req body matches with any email in the db.
        if(!userData){ //If its not in the db , we will hash the password using bcrypt and create the account
            const saltRounds = 10;  //no. of times of Randomization of the string
            bcrypt.hash(password,saltRounds,async(err,hash)=>{
                if(err){console.log(err)}
                else{
                    const newUser = await Users.create({name:req.body.name, email: req.body.email, password:hash}); //once the password is hashed, new user record is created using the data in the req body
                    res.json({user: newUser,message:"Account Created Successfully!"}) //response is sent in the JSON format.
                }
            })
        }
        else{
            res.json({message:"Email already in use!",userFound:true}); //If the email is already in the db, we will send an error msg that its already in use

        }
    }
    catch(err){
        console.log(err);
    }
}

const secretKey = process.env.JWT_SECRET


function generateToken(id,name){
    return jwt.sign({userId:id,name:name},secretKey)
}



exports.postLogin = async(req,res)=>{  //when the user clicks on login btn, a post req is sent along with the data in the form
    try{
        const userDetails = await Users.findOne({where:{email:req.body.email}});// using the email in the req body, we try to find the record of the email is in the db
        //console.log(userDetails,userDetails.password);
        if(userDetails){     //if the record is there, we will now check with the password
            const userPassword = userDetails.password;  //retrieving the password from the record present
           const result = await bcrypt.compare(req.body.password,userPassword, (err,result)=>{ //now we will compare the password in the req body with the hashed password
                //console.log(result);
                if(err){
                    throw new err("Something went wrong")
                }
                if(result===true){ //if the result is true, means the password is correct
                    res.json({message:"Successfully logged in.",userDetails:true, token: generateToken(userDetails.id,userDetails.name),premium:userDetails.premium_user}); //and the response is sent
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
    const uuid = uuidv4();
    const client = Sib.ApiClient.instance;
    var apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;

    const apiInstance = new Sib.TransactionalEmailsApi();

    let sendSmtpEmail = new Sib.SendSmtpEmail();
    const sender ={email: 'riyavmt14@gmail.com'};
    sendSmtpEmail = {
        sender,
        to: [{
            email: req.body.email
        }], 
        subject : 'Password Reset Link',
        HTMLContent: `<html><head></head><body><a  href="http://localhost:3000/password/reset-password/${uuid}">Click to reset your password</a>`
    };
    try {
        const user = await Users.findOne({where:{email:req.body.email}});
        console.log("User: "+user.dataValues.id)
        const uid = await ForgotPasswordRequest.create({uuid:uuid,userId:user.dataValues.id})
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail); //sending the email along withe data
      res.json("Email sent Successfully!")
      
    } catch (error) {
      console.log(error);
    }

  }

  exports.resetPassword = async(req,res)=>{
    const uuid = req.params.uuid;
    console.log("uuid is "+uuid);
    try{
        // res.sendFile(path.join(__dirname,'../../Frontend','User','resetPassword.html'))
        const result = await ForgotPasswordRequest.findOne({where : { uuid : uuid }});
        console.log("Result"+result);
        if(result&&result.isActive){
            res.sendFile(path.join(__dirname,'../../Frontend','User','resetPassword.html'))
        }
        else{
            const htmlContent = `<html><head></head><body><h1>This Link has already been used.</h1><a href="http://localhost:3000/User/forgotPassword.html">Click here to reset password</body></html>`;
            res.send(htmlContent);    
          }
    }
    catch(err){
        console.log(err)
    }
  }
  exports.updatePassword = async(req,res)=>{
    const password = req.body.password;
    console.log("Password"+password);
    const saltRounds=10;
    const result = await ForgotPasswordRequest.findOne({where:{uuid:req.body.uuid}});
    console.log("result"+result.dataValues.userId);
    const user = await Users.findByPk(result.dataValues.userId);
    bcrypt.hash(password,saltRounds,async(err,hash)=>{
        if(err){console.log(err)}
    
        try{
            await Users.update({password: hash} ,{where:{id:result.dataValues.userId}});
            await ForgotPasswordRequest.update({ isActive: false },{where:{userId:result.dataValues.userId}});
            console.log('Password updated');
        } 
        catch(err){
            console.log(err);
            res.status(500).json({ message: 'Error occurred while updating the password.' });
        }
    }) 
}