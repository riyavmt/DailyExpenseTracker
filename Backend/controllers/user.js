const Users = require("../models/user");
const bcrypt = require("bcrypt");

exports.postSignup = async(req,res)=>{
    const password = req.body.password;
    try{
        const userData = await Users.findOne({where:{email:req.body.email}}); //we are trying to check if the email typed during signup is already in the db.
        if(!userData){ //If its not in the db , we will hash the password and create the account
            const saltRounds = 10;  //no. of times of Randomization of the string
            bcrypt.hash(password,saltRounds,async(err,hash)=>{
                if(err){console.log(err)}
                else{
                    const newUser = await Users.create({name:req.body.name, email: req.body.email, password:hash});
                    res.json({user: newUser,message:"Account Created Successfully!"})
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



exports.postLogin = async(req,res)=>{
    try{
        const userDetails = await Users.findOne({where:{email:req.body.email}});
        console.log(userDetails,userDetails.password);
        if(userDetails){
            const userPassword = userDetails.password;
           const result = await bcrypt.compare(req.body.password,userPassword, (err,result)=>{
                console.log(result);
                if(err){
                    throw new err("Something went wrong")
                }
                if(result===true){
                    res.json({message:"Successfully logged in.",userDetails:true});
                }
                else{
                    res.json({message:"Incorrect Password!"});
                }
            
            })
        }
        else{
            res.json({message:"Invalid Email/Password"})
        }
    }
    catch(err){
        console.log(err)
    }
}  