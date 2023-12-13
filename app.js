const path = require("path");
const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./Backend/util/database");
const userRouter = require("./Backend/routes/user");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(userRouter);

async function startServer(){
    try{
        await sequelize.sync({force:false});
        app.listen(3000,()=>{
            console.log("Server is running")
        })
    }
    catch(err){console.log(err)};
}

startServer();