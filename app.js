require('dotenv').config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Sib = require("sib-api-v3-sdk");
const mongoose = require("mongoose");

const userRoute = require("./Backend/routes/user");
const expenseRoute = require("./Backend/routes/expense");
const purchaseRoute = require("./Backend/routes/purchase");
const premiumRoute = require("./Backend/routes/premium");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(userRoute);
app.use(expenseRoute);
app.use('/purchase',purchaseRoute);
app.use(premiumRoute);

app.use((req,res)=>{
    if(req.url=='/') res.redirect("http://localhost:3000/User/login.html")
    else{
        res.sendFile(path.join(__dirname,`Frontend/${req.url}`));
    }
    
})

async function startServer(){
    try{
        await mongoose.connect(process.env.MONGOOSE_DATABASE);
        app.listen(process.env.PORT||3000,()=>{
            console.log("Server is running")
        })
    }
    catch(err){console.log(err)};
}
startServer();