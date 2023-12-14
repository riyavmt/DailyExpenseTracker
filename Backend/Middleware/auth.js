const jwt = require("jsonwebtoken");
const User = require("../models/user");

const secretKey = process.env.JWT_SECRET

const authenticate = async (req,res,next)=>{
    try{
        const token = req.header("Authorization");
        // console.log(token);
        const user = jwt.verify(token, secretKey);
        const userFound = await User.findByPk(user.userId);
        if(userFound){
            // console.log(JSON.stringify(user));
            req.user = user;
            //req.userId = user.id;
            next();
        }
        else{
            throw new Error("User not Found")
        }
            
    }
    catch(err){
        console.log(err);
        return res.status(401).json({userDetails:false})
    }
        
}


module.exports = {authenticate};