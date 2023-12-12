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