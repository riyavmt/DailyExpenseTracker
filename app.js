require('dotenv').config();
const path = require("path");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./Backend/util/database");
const userRouter = require("./Backend/routes/user");
const expenseRouter = require("./Backend/routes/expense");
const Users = require("./Backend/models/user");
const Expense = require("./Backend/models/expense");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(userRouter);
app.use(expenseRouter);

Users.hasMany(Expense); //One user can have many expenses
Expense.belongsTo(Users); //But one expense belongs to only one user

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