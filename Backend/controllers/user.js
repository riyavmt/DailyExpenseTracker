const Users = require("../models/user");

exports.postSignup = async(req,res)=>{
    
    try{
        const userData = await Users.findOne({where:{email:req.body.email}});
        if(!userData){
            const newUser = Users.create({...req.body});
            console.log(req.body);
            res.json({user: newUser});
        }
        else{
            res.json({message:"Email already in use!",userFound:true});

        }
    }
    catch(err){
        console.log("Email Exists");
    }
}

exports.postLogin = async(req,res)=>{
    try{
        const userDetails = await Users.findOne({where:{email:req.body.email}});
        console.log(userDetails,userDetails.password);
        if(userDetails){
            const userPassword = userDetails.password;
            if(req.body.password===userPassword){
                res.json({message:"Successfully logged in.",userDetails:true});
            }
            else{
                res.json({message:"Incorrect Password!"});
            }
        }
        else{
            res.json({message:"Invalid Email/Password"})
        }
    }
    catch(err){
        console.log(err)
    }
}  